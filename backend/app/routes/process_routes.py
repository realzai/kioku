from flask import Blueprint, jsonify, request

from app.models import UserFiles
from app.utils import is_signed_in, get_user_id
from app.rag import load_documents
import requests
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

process_bp = Blueprint("process", __name__)

def call_groq(messages, api_key, model_name):
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"model": model_name, "messages": messages, "temperature": 0.7}

    res = requests.post(
        "https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload
    )
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"]


@process_bp.route("/process", methods=["POST"])
def process():
    if not is_signed_in(request):
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Validate input
        if not all(k in request.json for k in ["query", "groq_token", "model"]):
            return jsonify({"error": "Missing required fields"}), 400

        query = request.json["query"]
        token = request.json["groq_token"]
        model = request.json["model"]

        # Get user files
        user_id = get_user_id(request)
        user_files = UserFiles.query.filter_by(user_id=user_id).all()

        # Get local file paths instead of URLs
        local_files = [uf.local_path for uf in user_files if uf.local_path and os.path.exists(uf.local_path)]

        if not local_files:
            return jsonify({"error": "No valid files found for this user"}), 400

        # Load and split documents
        documents = load_documents(local_files=local_files)
        if not documents:
            return jsonify({"error": "Could not load any documents"}), 400

        splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_documents(documents)

        if not chunks:
            return jsonify({"error": "No text content found in documents"}), 400

        # Use lighter embedding model
        embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-albert-small-v2"
        )

        # Create vector store
        vectorstore = Chroma.from_documents(
            chunks,
            embedding_model,
            persist_directory=f"./chroma_db/{user_id}"  # Persist per user
        )
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

        # Retrieve context
        docs = retriever.get_relevant_documents(query)
        if not docs:
            return jsonify({"error": "No relevant content found for query"}), 400

        context = "\n\n".join([doc.page_content for doc in docs])

        # Call Groq API
        messages = [
            {
                "role": "system",
                "content": "Answer based only on the provided context.",
            },
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"},
        ]

        response = call_groq(messages, token, model)
        if not response:
            return jsonify({"error": "Empty response from AI"}), 500

        return jsonify({
            "query": query,
            "message": response,
            "sources": [str(doc.metadata.get('source', 'unknown')) for doc in docs]
        })

    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")
        return jsonify({"error": "Failed to communicate with AI service"}), 502

    except Exception as e:
        print(f"Processing Error: {e}")
        return jsonify({"error": f"Processing error: {str(e)}"}), 500
from flask import Blueprint, jsonify, request
from app.utils import is_signed_in
from groq import Groq
import requests

process_bp = Blueprint('process', __name__)

def call_groq(messages,api_key,model_name):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model_name,
        "messages": messages,
        "temperature": 0.7
    }

    res = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"]

@process_bp.route("/process", methods=["POST"])
def process():
    if not is_signed_in(request):
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        query = request.json['query']
        token = request.json['groq_token']

        context = "I love Mandalay"

        messages = [
            {"role": "system",
             "content": "You are an AI assistant that answers based only on the provided context but never mention about the provided context exists."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
        ]

        # Call the Groq API
        response = call_groq(messages,api_key=token,model_name="meta-llama/llama-4-scout-17b-16e-instruct")


        return jsonify({
            'query': query,
            'message': response,
        })
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'error': 'An error occurred while processing the request'}), 500

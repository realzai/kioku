import os
import tempfile
import requests
from urllib.parse import urlparse
from pathlib import Path
from langchain.document_loaders import (
    TextLoader, PyPDFLoader, WebBaseLoader,
    UnstructuredWordDocumentLoader,
    UnstructuredExcelLoader
)


def load_documents(file_urls=[], web_urls=[]):
    all_docs = []

    # Helper function to get file extension from URL
    def get_file_extension(url):
        parsed = urlparse(url)
        path = parsed.path
        return Path(path).suffix.lower()

    # Process file URLs
    for file_url in file_urls:
        try:
            # Download the file to a temporary location
            response = requests.get(file_url)
            response.raise_for_status()

            # Create a temporary file
            ext = get_file_extension(file_url)
            with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as temp_file:
                temp_file.write(response.content)
                temp_path = temp_file.name

            # Load based on file type
            if ext in ['.txt', '.md']:
                loader = TextLoader(temp_path)
            elif ext == '.pdf':
                loader = PyPDFLoader(temp_path)
            elif ext == '.docx':
                loader = UnstructuredWordDocumentLoader(temp_path)
            elif ext in ['.xlsx', '.xls']:
                loader = UnstructuredExcelLoader(temp_path)
            else:
                print(f"⚠️ Skipping unsupported file type: {file_url}")
                os.unlink(temp_path)
                continue

            # Load and add to docs
            docs = loader.load()
            all_docs.extend(docs)

            # Clean up temporary file
            os.unlink(temp_path)

        except Exception as e:
            print(f"❌ Failed to load {file_url}: {e}")
            if 'temp_path' in locals() and os.path.exists(temp_path):
                os.unlink(temp_path)

    # Process web URLs
    if web_urls:
        try:
            web_loader = WebBaseLoader(web_urls)
            web_docs = web_loader.load()
            all_docs.extend(web_docs)
        except Exception as e:
            print(f"❌ Failed to load websites: {e}")

    return all_docs
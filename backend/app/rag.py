from pathlib import Path
from langchain.document_loaders import (
    TextLoader, PyPDFLoader,
    UnstructuredWordDocumentLoader,
    UnstructuredExcelLoader,
    UnstructuredPowerPointLoader,
    WebBaseLoader
)


def load_documents(local_files=[], web_urls=[]):
    """
    Load documents from local files and web URLs

    Args:
        local_files: List of local file paths
        web_urls: List of web page URLs

    Returns:
        List of loaded documents
    """
    all_docs = []

    # Process local files
    for file_path in local_files:
        try:
            path = Path(file_path)
            if not path.exists():
                print(f"⚠️ File not found: {file_path}")
                continue

            # Load based on file type
            if path.suffix.lower() in ['.txt', '.md']:
                loader = TextLoader(str(path))
            elif path.suffix.lower() == '.pdf':
                loader = PyPDFLoader(str(path))
            elif path.suffix.lower() == '.docx':
                loader = UnstructuredWordDocumentLoader(str(path))
            elif path.suffix.lower() in ['.xlsx', '.xls']:
                loader = UnstructuredExcelLoader(str(path))
            elif path.suffix.lower() == '.pptx':
                loader = UnstructuredPowerPointLoader(str(path))
            else:
                print(f"⚠️ Skipping unsupported file type: {path.name}")
                continue

            # Load and add to docs
            docs = loader.load()
            for doc in docs:
                # Add metadata with original file path
                doc.metadata['source'] = str(path)
            all_docs.extend(docs)

        except Exception as e:
            print(f"❌ Failed to load {file_path}: {e}")

    # Process web URLs (if still needed)
    if web_urls:
        try:
            web_loader = WebBaseLoader(web_urls)
            web_docs = web_loader.load()
            all_docs.extend(web_docs)
        except Exception as e:
            print(f"❌ Failed to load websites: {e}")

    return all_docs
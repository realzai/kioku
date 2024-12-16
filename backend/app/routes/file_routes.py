from flask import Blueprint, jsonify, request
from app.models import UserFiles
from app.utils import is_signed_in, get_user_id

files_bp = Blueprint("files", __name__)


@files_bp.route("/files")
def get_files():
    if not is_signed_in(request):
        return jsonify({"error": "Unauthorized"}), 401

    user_id = get_user_id(request)
    user_files = UserFiles.query.filter_by(user_id=user_id).all()
    files = [
        {"id": uf.id, "file_url": uf.file_url, "file_name": uf.file_name}
        for uf in user_files
    ]
    return jsonify(files)

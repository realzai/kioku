from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.models import db, UserFiles
from app.utils import is_signed_in, get_user_id
import boto3
import os

upload_bp = Blueprint("upload", __name__)

s3 = boto3.client(
    "s3",
    endpoint_url=os.getenv("FILEBASE_ENDPOINT"),
    aws_access_key_id=os.getenv("FILEBASE_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("FILEBASE_SECRET_KEY"),
)


@upload_bp.route("/upload", methods=["POST"])
def upload_files():
    if not is_signed_in(request):
        return jsonify({"error": "Unauthorized"}), 401

    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    files = request.files.getlist("file")
    user_id = get_user_id(request)

    if not files or all(file.filename == "" for file in files):
        return jsonify({"error": "No files selected for uploading"}), 400

    uploaded_files = []
    for file in files:
        if file.filename != "":
            filename = secure_filename(file.filename)
            s3.upload_fileobj(file, os.getenv("FILEBASE_BUCKET"), filename)
            file_url = f"{os.getenv('FILEBASE_ENDPOINT')}/{os.getenv('FILEBASE_BUCKET')}/{filename}"
            uploaded_files.append(file_url)

            user_file = UserFiles(
                user_id=user_id, file_url=file_url, file_name=filename
            )
            db.session.add(user_file)
            db.session.commit()

    return jsonify({"message": "Files uploaded successfully!", "files": uploaded_files})

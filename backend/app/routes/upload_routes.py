from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.models import db, UserFiles
from app.utils import is_signed_in, get_user_id
import os

upload_bp = Blueprint("upload", __name__)

UPLOAD_FOLDER = 'user_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


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

            # Create user-specific subdirectory
            user_folder = os.path.join(UPLOAD_FOLDER, str(user_id))
            os.makedirs(user_folder, exist_ok=True)

            # Save file locally
            file_path = os.path.join(user_folder, filename)
            file.save(file_path)

            # Create relative URL path
            file_url = f"/uploads/{user_id}/{filename}"
            uploaded_files.append(file_url)

            # Store in database
            user_file = UserFiles(
                user_id=user_id,
                file_url=file_url,
                file_name=filename,
                local_path=file_path
            )
            db.session.add(user_file)
            db.session.commit()

    return jsonify({"message": "Files uploaded successfully!", "files": uploaded_files})
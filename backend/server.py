from flask import Flask, jsonify, request
from utils import is_signed_in, get_user_id
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import boto3
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
CORS(app)

# Database configuration (SQLite example)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

class UserFiles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    file_url = db.Column(db.String(200), nullable=False)
    file_name = db.Column(db.String(200), nullable=False)

@app.before_request
def create_tables():
    db.drop_all()
    # Create tables if they don't exist
    db.create_all()


s3 = boto3.client(
    's3',
    endpoint_url=os.getenv("FILEBASE_ENDPOINT"),
    aws_access_key_id=os.getenv("FILEBASE_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("FILEBASE_SECRET_KEY")
)

@app.route("/upload", methods=["POST"])
def upload_files():
    if is_signed_in(request):
        # Check if the 'file' key exists in the request
        if "file" not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        files = request.files.getlist("file")
        user_id = get_user_id(request)

        # Check if any files were uploaded
        if not files or all(file.filename == "" for file in files):
            return jsonify({"error": "No files selected for uploading"}), 400

        uploaded_files = []
        for file in files:
            if file.filename != "":
                filename = secure_filename(file.filename)
                s3.upload_fileobj(file, os.getenv("FILEBASE_BUCKET"), filename)
                file_url = f"{os.getenv('FILEBASE_ENDPOINT')}/{os.getenv('FILEBASE_BUCKET')}/{filename}"
                uploaded_files.append(file_url)

                # Save file URL to the database
                user_file = UserFiles(user_id=user_id, file_url=file_url, file_name=filename)
                db.session.add(user_file)
                db.session.commit()

        return jsonify({"message": "Files uploaded successfully!", "files": uploaded_files})
    else:
        return jsonify({'error': 'Unauthorized'}), 401

@app.route('/files')
def get_files():
    if is_signed_in(request):
        user_id = get_user_id(request)
        user_files = UserFiles.query.filter_by(user_id=user_id).all()
        files = [{"id": uf.id, "file_url": uf.file_url} for uf in user_files]
        return jsonify(files)
    else:
        return jsonify({'error': 'Unauthorized'}), 401

@app.route('/')
def home():
    return jsonify({
        'message': 'Your kioku is ready!',
    })

@app.route("/process", methods=["POST"])
def process():
    if is_signed_in(request):
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Process the data (example: echoing it back)
        return jsonify({
            'message': 'Data received successfully',
            'data': data
        })
    else:
        return jsonify({'error': 'Unauthorized'}), 401

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
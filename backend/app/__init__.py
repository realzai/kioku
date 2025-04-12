from flask import Flask, jsonify
from flask_cors import CORS
from app.models.user_file import db
from app.routes import upload_bp, files_bp, process_bp
from app.routes.weburl_routes import web_url_bp
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)

    @app.before_request
    def create_tables():
        db.create_all()

    app.register_blueprint(upload_bp)
    app.register_blueprint(files_bp)
    app.register_blueprint(process_bp)
    app.register_blueprint(web_url_bp)

    @app.route("/")
    def home():
        return jsonify({"message": "Your kioku is ready!"})

    return app

from flask import Blueprint, request, jsonify
from app.models import db, UserUrl
from app.utils import is_signed_in, get_user_id

web_url_bp = Blueprint("web_url", __name__)

@web_url_bp.route("/web_urls", methods=["POST", "GET"])
def handle_web_url():
    if not is_signed_in(request):
        return jsonify({"error": "Unauthorized"}), 401

    if request.method == "POST":
        data = request.get_json()
        web_url = data.get("web_url")

        if not web_url:
            return jsonify({"error": "No URL provided"}), 400

        user_id = get_user_id(request)

        user_url = UserUrl(
            user_id=user_id,
            web_url=web_url
        )
        db.session.add(user_url)
        db.session.commit()

        return jsonify({"message": "URL saved successfully!"})

    elif request.method == "GET":
        user_id = get_user_id(request)
        urls = UserUrl.query.filter_by(user_id=user_id).all()
        url_list = [{"id": url.id, "web_url": url.web_url} for url in urls]

        return jsonify({"urls": url_list})
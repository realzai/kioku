from flask_sqlalchemy import SQLAlchemy
from .user_file import db

class UserUrl(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    web_url = db.Column(db.String(200), nullable=False)

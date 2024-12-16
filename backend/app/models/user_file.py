from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class UserFiles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    file_url = db.Column(db.String(200), nullable=False)
    file_name = db.Column(db.String(200), nullable=False)

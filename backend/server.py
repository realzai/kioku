from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    # want to delay for 5 seconds
    time.sleep(5)
    return jsonify({
        'message': 'Your kioku is ready!',
    })

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()  # Parse JSON data from the request
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Process the data (example: echoing it back)
    return jsonify({
        'message': 'Data received successfully',
        'data': data
    })
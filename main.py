from flask import Flask, render_template, send_from_directory, jsonify
import os
import json

app = Flask(__name__, static_folder='.')

# Route for serving index.html
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Route to serve any static file
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Route to get class data from JSON file
@app.route('/api/classes', methods=['GET'])
def get_classes():
    try:
        with open('data-2.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
            return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
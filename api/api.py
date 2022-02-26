import os

from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from os.path import dirname, join
from services.DB import DB
from services.PlagiarismChecker import PlagiarismChecker

app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config["PROPAGATE_EXCEPTIONS"] = True

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "7212baf2-3844-4aa5-8e7f-c1c77ede0be3"
jwt = JWTManager(app)

# Prepare DB
db = DB()
db.init_db()


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route("/api/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    users = db.select("SELECT id FROM users WHERE email = ? AND password = ?", (email, password))
    if len(users) <= 0:
        return jsonify({"error": "Incorrect username or password."}), 401

    user_id = users[0]['id']
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return jsonify(access_token=access_token, refresh_token=refresh_token)


@app.route("/api/refresh-token", methods=["POST"])
@jwt_required()
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)


@app.route("/api/documents", methods=["GET"])
@jwt_required()
def documents():
    user_id = get_jwt_identity()
    documents_result = db.select("SELECT * FROM documents WHERE created_by = ? ORDER BY id DESC", (user_id,))
    documents = []
    for row in documents_result:
        documents.append({
            'id': row['id'],
            'title': row['title'],
            'document': row['document'],
            'matching_probability': row['matching_probability'],
            'created_at': row['created_at'],
        })
    return jsonify(documents), 200


@app.route("/api/documents/check", methods=["POST"])
@jwt_required()
def check():
    document = request.form.get("text")
    file = request.files.get("file")
    if document is None and file is None:
        return jsonify({"error": "text/file is required."}), 422

    if file is not None:
        document = file.read().decode("utf-8")

    current_dir = dirname(__file__)
    tmpFilePath = join(current_dir, "./input.txt")
    tmpFile = open(tmpFilePath, "w")
    tmpFile.write(document)
    tmpFile.close()

    reference_files = os.listdir(join(current_dir, './reference_docs'))
    max_matching_probability = 0.0
    for reference_file in reference_files:
        checker = PlagiarismChecker(join(current_dir, './reference_docs/' + reference_file), tmpFilePath)
        matching_probability = round(checker.get_rate(), 2)
        if matching_probability > max_matching_probability:
            max_matching_probability = matching_probability

    title = file.filename if file is not None else document[:20]
    created_by = get_jwt_identity()

    db.insert(
        "INSERT INTO documents (title, document, matching_probability, created_by) VALUES (?, ?, ?, ?)",
        (title, document, max_matching_probability, created_by)
    )

    return jsonify({"matching_probability": max_matching_probability}), 200

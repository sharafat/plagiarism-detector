from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from services.DB import DB

app = Flask(__name__, static_folder='../build', static_url_path='/')

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "7212baf2-3844-4aa5-8e7f-c1c77ede0be3"
jwt = JWTManager(app)

# Prepare DB
db = DB()
db.init_db()


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/')
def index():
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
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)


@app.route("/api/documents", methods=["GET"])
@jwt_required()
def protected():
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

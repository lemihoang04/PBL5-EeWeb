from flask import Flask, jsonify, request, session
from werkzeug.utils import secure_filename
import os
from backend.users2 import *
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'hotel'
CORS(app, origins="http://localhost:3000", supports_credentials=True)

@app.route('/register', methods=['POST'])
def api_create_user():
    data = request.form
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    if not all([name, email, password, phone]):
        return jsonify({"error": "Missing required information"}), 400

    create_user(name, email, password, phone)
    return jsonify({"errCode": 0, "message": "User successfully created"}), 201

@app.route('/api/account', methods=['GET'])
def get_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"errCode": 1, "message": "Not authenticated"}), 401

    user = get_user_by_id(user_id)
    if user:
        return jsonify({"errCode": 0, "user": user}), 200
    else:
        return jsonify({"errCode": 1, "message": "User not found"}), 404

@app.route('/users', methods=['GET'])
def api_get_all_users():
    users = get_all_users()
    return jsonify(users), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def api_get_user_by_id(user_id):
    user = get_user_by_id(user_id)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "User does not exist"}), 404

@app.route('/users/<int:user_id>', methods=['PUT'])
def api_update_user(user_id):
    data = request.form
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    if not any([name, email, password, phone]):
        return jsonify({"error": "No information to update"}), 400

    update_user(user_id, name=name, email=email, password=password, phone=phone)
    return jsonify({"errCode": 0, "message": "User information successfully updated"}), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def api_delete_user(user_id):
    delete_user(user_id)
    return jsonify({"errCode": 0, "message": "User has been deleted"}), 200

@app.route('/login', methods=['POST'])
def api_login():
    session.clear()
    data = request.form
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = login(email, password)

    if user:
        session['user_id'] = user['id']
        session['email'] = email
        return jsonify({"errCode": 0, "user": user}), 200
    else:
        return jsonify({"error": "Wrong email or password"}), 404

@app.route('/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({"errCode": 0, "message": "Logged out successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)

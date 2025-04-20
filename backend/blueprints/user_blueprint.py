from flask import Blueprint, request, jsonify, session
from DAL.user_dal import *

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/register', methods=['POST'])
def api_create_user():
    data = request.form
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    if not all([name, email, password, phone]):
        return jsonify({"errCode": 1, "error": "Missing required information"}), 400
    
    if check_existing_user(email, phone):
        return jsonify({"errCode": 1, "error": "Email or phone already exists"}), 409

    create_user(name, email, password, phone)
    return jsonify({"errCode": 0, "message": "User successfully created"}), 201

@user_blueprint.route('/api/account', methods=['GET'])
def get_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"errCode": 1, "message": "Not authenticated"}), 401

    user = get_user_by_id(user_id)
    cart_items_count = get_number_of_cart_items(user_id)
    if user:
        return jsonify({"errCode": 0, "user": user, "cart_items_count": cart_items_count}), 200
    else:
        return jsonify({"errCode": 1, "message": "User not found"}), 404

@user_blueprint.route('/users', methods=['GET'])
def api_get_all_users():
    users = get_all_users()
    return jsonify(users), 200

@user_blueprint.route('/users/<int:user_id>', methods=['GET'])
def api_get_user_by_id(user_id):
    user = get_user_by_id(user_id)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "User does not exist"}), 404

@user_blueprint.route('/users/<int:user_id>', methods=['PUT'])
def api_update_user(user_id):
    data = request.form
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    address = data.get('address')  

    user = get_user_by_id(user_id)
    if not any([name, email, password, phone, address]):
        return jsonify({"error": "No information to update"}), 400
    
    if check_phone_existing(phone) and user['phone'] != phone:
        return jsonify({"errCode": 1, "error": "Phone already exists"}), 409
    
    update_user(user_id, name=name, email=email, password=password, phone=phone, address=address)
    return jsonify({"errCode": 0, "message": "User information successfully updated"}), 200

@user_blueprint.route('/users/<int:user_id>', methods=['DELETE'])
def api_delete_user(user_id):
    delete_user(user_id)
    return jsonify({"errCode": 0, "message": "User has been deleted"}), 200

@user_blueprint.route('/login', methods=['POST'])
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

@user_blueprint.route('/changePassword', methods=['PUT'])
def api_change_password():    
    data = request.json
    user_id = data.get('userid')
    if not user_id:
        return jsonify({"errCode": 1, "message": "Not authenticated"}), 401
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if not old_password or not new_password:
        return jsonify({"errCode": 1, "message": "Missing old or new password"}), 400
    success = change_password(user_id, old_password, new_password)
    if success:
        return jsonify({"errCode": 0, "message": "Password changed successfully"}), 200
    else:
        return jsonify({"errCode": 1, "message": "Old password is incorrect"}), 400

@user_blueprint.route('/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({"errCode": 0, "message": "Logged out successfully"}), 200
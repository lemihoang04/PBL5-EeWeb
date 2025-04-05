from config import db
from bson import ObjectId
from datetime import datetime

def user_to_json(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "created_at": user["created_at"].isoformat(),
    }

def create_user(name, email, password, phone):
    user = {
        "name": name,
        "email": email,
        "password": password,
        "phone": phone,
        "created_at": datetime.utcnow()
    }
    db.users.insert_one(user)

def check_existing_user(email, phone):
    return db.users.find_one({"$or": [{"email": email}, {"phone": phone}]}) is not None

def get_all_users():
    users = db.users.find({})
    return [user_to_json(user) for user in users]

def get_user_by_id(user_id):
    user = db.users.find_one({"_id": ObjectId(user_id)})
    return user_to_json(user) if user else None

def login(email, password):
    user = db.users.find_one({"email": email, "password": password})
    return user_to_json(user) if user else None

def update_user(user_id, name=None, email=None, password=None, phone=None):
    update_data = {}
    if name: update_data["name"] = name
    if email: update_data["email"] = email
    if password: update_data["password"] = password
    if phone: update_data["phone"] = phone

    if update_data:
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})

def delete_user(user_id):
    db.users.delete_one({"_id": ObjectId(user_id)})

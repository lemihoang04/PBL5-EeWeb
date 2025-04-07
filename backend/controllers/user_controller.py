from config import get_db_connection
from datetime import datetime

def user_to_json(user_data):
    return {
        "id": user_data['id'],
        "name": user_data['name'],
        "email": user_data['email'],
        "phone": user_data['phone'],
        "created_at": user_data['created_at'].isoformat(),
    }


def create_user(name, email, password, phone):
    connection = get_db_connection()
    cursor = connection.cursor()
    sql = "INSERT INTO users (name, email, password, phone, created_at) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(sql, (name, email, password, phone, datetime.utcnow()))
    connection.commit()
    cursor.close()
    connection.close()
    
def check_existing_user(email, phone):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = "SELECT id FROM users WHERE email = %s OR phone = %s"
    cursor.execute(query, (email, phone))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return result is not None

def get_all_users():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    connection.close()
    return [user_to_json(user) for user in users]

def get_user_by_id(user_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user_to_json(user) if user else None


def login(email, password):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user_to_json(user) if user else None



def update_user(user_id, name=None, email=None, password=None, phone=None):
    connection = get_db_connection()
    cursor = connection.cursor()
    updates = []
    values = []

    if name is not None:
        updates.append("name = %s")
        values.append(name)
    if email is not None:
        updates.append("email = %s")
        values.append(email)
    if password is not None:
        updates.append("password = %s")
        values.append(password)
    if phone is not None:
        updates.append("phone = %s")
        values.append(phone)

    if updates:  # Chỉ cập nhật nếu có dữ liệu thay đổi
        values.append(user_id)
        sql = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
        cursor.execute(sql, tuple(values))
        connection.commit()

    cursor.close()
    connection.close()

def delete_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    connection.commit()
    cursor.close()
    connection.close()

from config import get_db_connection
from mysql.connector import Error
from datetime import datetime
import random
import string

def user_to_json(user_data):
    return {
        "id": user_data['id'],
        "name": user_data['name'],
        "email": user_data['email'],
        "phone": user_data['phone'],
        "address": user_data['address'],  
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

def check_phone_existing(phone):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = "SELECT id FROM users WHERE phone = %s"
    cursor.execute(query, (phone,))
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

def update_user(user_id, name=None, email=None, password=None, phone=None, address=None):
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
    if address is not None:  # Thêm address
        updates.append("address = %s")
        values.append(address)

    if updates:  # Chỉ cập nhật nếu có dữ liệu thay đổi
        values.append(user_id)
        sql = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
        cursor.execute(sql, tuple(values))
        connection.commit()

    cursor.close()
    connection.close()

def change_password(user_id, old_password, new_password):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s AND password = %s", (user_id, old_password))
    user = cursor.fetchone()
    if not user:
        cursor.close()
        connection.close()
        return False  
    cursor.execute("UPDATE users SET password = %s WHERE id = %s", (new_password, user_id))
    connection.commit()
    cursor.close()
    connection.close()
    return True 

def delete_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    connection.commit()
    cursor.close()
    connection.close()
    
def get_number_of_cart_items(user_id):
    connection = get_db_connection()
    if not connection:
        raise Exception("Database connection failed")
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT COUNT(*) AS cart_count FROM Cart WHERE user_id = %s
        """, (user_id,))
        result = cursor.fetchone()
        return result['cart_count'] if result else 0
    except Error as e:
        raise Exception(f"Database error: {str(e)}")
    finally:
        cursor.close()
        connection.close()

def get_user_by_email(email):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user if user else None

def create_otp(email, otp_code, expiry_time):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # First, delete any existing OTP for this email
    cursor.execute("DELETE FROM otp_codes WHERE email = %s", (email,))
    
    # Insert new OTP
    sql = "INSERT INTO otp_codes (email, otp_code, created_at, expires_at) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, (email, otp_code, datetime.utcnow(), expiry_time))
    connection.commit()
    cursor.close()
    connection.close()

def verify_otp(email, otp_code):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    # Get OTP and check if it's valid and not expired
    cursor.execute("""
        SELECT * FROM otp_codes 
        WHERE email = %s AND otp_code = %s AND expires_at > %s
    """, (email, otp_code, datetime.utcnow()))
    
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    
    return result is not None

def reset_password(email, new_password):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    cursor.execute("UPDATE users SET password = %s WHERE email = %s", (new_password, email))
    affected_rows = cursor.rowcount
    
    connection.commit()
    cursor.close()
    connection.close()
    
    return affected_rows > 0

def generate_otp():
    """Generate a 6-digit OTP code"""
    return ''.join(random.choices(string.digits, k=6))

def delete_otp(email):
    """Delete OTP after it's been used or expired"""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    cursor.execute("DELETE FROM otp_codes WHERE email = %s", (email,))
    
    connection.commit()
    cursor.close()
    connection.close()
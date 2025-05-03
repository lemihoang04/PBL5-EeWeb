from config import get_db_connection
from mysql.connector import Error

def get_all_categories():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT category_id, category_name, description, 
                   DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
                   DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at 
            FROM categories
        """)
        categories = cursor.fetchall()
        return categories if categories else []
    except Exception as e:
        print("Database error:", str(e))
        return []
    finally:
        cursor.close()
        connection.close()

def create_category(category_name, description=None):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO categories (category_name, description) VALUES (%s, %s)",
        (category_name, description)
    )
    connection.commit()
    cursor.close()
    connection.close()

def update_category(category_id, category_name, description=None):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE categories SET category_name = %s, description = %s WHERE category_id = %s",
        (category_name, description, category_id)
    )
    connection.commit()
    cursor.close()
    connection.close()

# def delete_category(category_id):
#     connection = get_db_connection()
#     cursor = connection.cursor()
#     cursor.execute("DELETE FROM categories WHERE id = %s", (category_id,))
#     connection.commit()
#     cursor.close()
#     connection.close()
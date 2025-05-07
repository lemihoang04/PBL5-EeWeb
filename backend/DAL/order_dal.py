from config import get_db_connection
from mysql.connector import Error

def get_all_orders():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            o.*, 
            u.name AS user_name
        FROM `Order` o
        JOIN Users u ON o.user_id = u.id
    """)
    orders = cursor.fetchall()
    cursor.close()
    connection.close()
    return orders

def get_order_by_id(order_id):
    connection = get_db_connection()
    if not connection:
        raise Exception("Database connection failed")
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT * FROM `Order` WHERE id = %s
        """, (order_id,))
        order = cursor.fetchone()
        return order
    except Error as e:
        raise Exception(f"Database error: {str(e)}")
    finally:
        cursor.close()
        connection.close()

def get_orders_by_user_id(user_id):
    connection = get_db_connection()
    if not connection:
        raise Exception("Database connection failed")
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT 
                o.id,
                o.order_id,
                o.user_id,
                o.product_id,
                o.quantity,
                o.price,
                o.status,
                o.shipping_address,
                o.created_at,
                p.title,
                p.price AS product_price,
                p.image
            FROM `Order` o
            JOIN Products p ON o.product_id = p.product_id
            WHERE o.user_id = %s
            ORDER BY o.order_id DESC
        """, (user_id,))
        orders = cursor.fetchall()
        return orders
    except Error as e:
        raise Exception(f"Database error: {str(e)}")
    finally:
        cursor.close()
        connection.close()
        

def cancel_order(order_id):
    connection = get_db_connection()
    if not connection:
        raise Exception("Database connection failed")
    cursor = connection.cursor()
    try:
        # First try to update using the id column
        cursor.execute("""
            UPDATE `Order` SET status = %s WHERE id = %s
        """, ('cancelled', order_id))
        
        # If no rows were updated, try with order_id instead
        if cursor.rowcount == 0:
            cursor.execute("""
                UPDATE `Order` SET status = %s WHERE order_id = %s
            """, ('cancelled', order_id))
            
        connection.commit()
        return cursor.rowcount  
    except Error as e:
        connection.rollback()
        raise Exception(f"Database error: {str(e)}")
    finally:
        cursor.close()
        connection.close()
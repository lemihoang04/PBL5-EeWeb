from config import get_db_connection
from mysql.connector import Error

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
        cursor.execute("""
            UPDATE `order` SET status = %s WHERE id = %s
        """, ('cancelled', order_id))
        connection.commit()
        return cursor.rowcount  
    except Error as e:
        connection.rollback()
        raise Exception(f"Database error: {str(e)}")
    finally:
        cursor.close()
        connection.close()
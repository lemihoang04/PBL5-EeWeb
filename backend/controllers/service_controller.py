from flask import jsonify
from config import get_db_connection
from mysql.connector import Error
from datetime import datetime

def checkout(order_data):
    connection = get_db_connection()
    if not connection:
        raise Exception("Database connection failed")
    cursor = connection.cursor()
    try:
        order_id = int(f"{int(datetime.now().strftime("%d%m%y"))}{order_data['user_id']}")
        for item in order_data['order_items']:
            cursor.execute("""
                INSERT INTO `Order` (order_id, user_id, product_id, quantity, price, status, shipping_address)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                order_id,
                order_data['user_id'],
                item['product_id'],
                item['quantity'],
                item['total_price'] / item['quantity'],  
                'pending',  
                order_data['shipping_address']
            ))

        for item in order_data['order_items']:
            if 'cart_id' in item and item['cart_id']:
                cursor.execute("""
                    DELETE FROM Cart WHERE cart_id = %s
                """, (item['cart_id'],))

        cursor.execute("""
            INSERT INTO Payments (order_id, user_id, amount, payment_method, payment_status)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            order_id,
            order_data['user_id'],
            order_data['total_amount'],
            order_data['payment_method'],
            'pending'  
        ))
        connection.commit()
        return {
            'message': 'Order and payment created successfully',
            'order_id': order_id
        }
    except Error as e:
        connection.rollback()
        raise Exception(f"Database error: {str(e)}")

    finally:
        cursor.close()
        connection.close()
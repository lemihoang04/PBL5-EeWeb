from config import get_db_connection
from mysql.connector import Error
from datetime import datetime
import time
import uuid
import random
import string

def checkout(order_data):
    connection = get_db_connection()
    if not connection:
        raise Exception("Database connection failed")
    cursor = connection.cursor()
    try:
        # Generate a more unique order_id using timestamp, user_id and a random string
        # timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        # random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        order_id = order_data.get('app_trans_id', time.strftime("%y%m%d") + "_" + str(int(time.time())))
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
        isBuyNow = order_data.get('isBuyNow', False)
        if not isBuyNow:
            for item in order_data['order_items']:
                if 'cart_id' in item and item['cart_id']:
                    cursor.execute("""
                        DELETE FROM Cart WHERE cart_id = %s
                    """, (item['cart_id'],))
                
        payment_status = 'completed' if order_data['payment_method'] == 'online_payment' else 'pending'
        cursor.execute("""
            INSERT INTO Payments (order_id, user_id, amount, payment_method, payment_status)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            order_id,
            order_data['user_id'],
            order_data['total_amount'],
            order_data['payment_method'],
            payment_status  
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

def get_payment_by_order_id(order_id):
    connection = get_db_connection()
    if not connection:
        raise Exception("Database connection failed")
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT * FROM Payments WHERE order_id = %s
        """, (order_id,))
        payment = cursor.fetchone()
        return payment
    except Error as e:
        raise Exception(f"Database error: {str(e)}")
    finally:
        cursor.close()
        connection.close()

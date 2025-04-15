from flask import Flask, request, jsonify
from config import get_db_connection
from mysql.connector import Error
from datetime import datetime

def checkout(user_id, billing_details, order_items, total_amount, payment_method):
    connection = get_db_connection()
    if not connection:
        raise Exception("Database connection failed")

    cursor = connection.cursor()
    try:
        # 1. Tạo đơn hàng
        # Sinh order_id
        order_id = int(f"{int(datetime.now().timestamp())}{user_id}")
        # Lấy thông tin giao hàng từ billing_details
        shipping_address = None
        if billing_details:
            shipping_address = f"{billing_details.get('street_address', '')}, {billing_details.get('country', '')}".strip()
            if not shipping_address:
                raise ValueError("Shipping address is required")
        for item in order_items:
            # Tìm product_id dựa trên model_number
            cursor.execute("""
                SELECT product_id 
                FROM Product_Attributes 
                WHERE attribute_name = 'model_number' AND attribute_value = %s
            """, (item['model_number'],))
            product = cursor.fetchone()

            if not product:
                raise ValueError(f"Product with model_number {item['model_number']} not found")

            product_id = product[0]
            quantity = item['quantity']
            price_per_item = item['total_price'] / quantity

            # Chèn vào Order, bao gồm shipping_address
            cursor.execute("""
                INSERT INTO `Order` (order_id, user_id, product_id, quantity, price, status, shipping_address)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (order_id, user_id, product_id, quantity, price_per_item, 'pending', shipping_address))

        # 2. Tạo thanh toán
        cursor.execute("""
            INSERT INTO Payments (order_id, user_id, amount, payment_method, payment_status)
            VALUES (%s, %s, %s, %s, %s)
        """, (order_id, user_id, total_amount, payment_method, 'pending'))

        # Commit giao dịch
        connection.commit()
        return {
            'message': 'Order placed successfully',
            'order_id': order_id
        }

    except Error as e:
        connection.rollback()
        raise Exception(f"Database error: {str(e)}")

    except ValueError as e:
        connection.rollback()
        raise Exception(str(e))

    finally:
        cursor.close()
        connection.close()
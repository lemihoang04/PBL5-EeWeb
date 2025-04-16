from flask import Flask, jsonify, request, session
from flask_cors import CORS
import mysql.connector
import os
import requests
import time, hmac, hashlib, json, requests, urllib.request, urllib.parse
from controllers.user_controller import *
# from dotenv import load_dotenv

# # Load biến môi trường từ .env
# load_dotenv()
app = Flask(__name__)
app.secret_key = "phuocnopro123" 
CORS(app, origins="http://localhost:3000", supports_credentials=True)

# Kết nối MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    port=3306,
    password="",
    database="techshop_db",
)
ZALOPAY_CONFIG = {
    "app_id": "2553",
    "key1": "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    "key2": "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    "create_order_endpoint": "https://sb-openapi.zalopay.vn/v2/create",
    "query_order_endpoint": "https://sb-openapi.zalopay.vn/v2/query",
}


@app.route("/create_order", methods=["POST"])
def create_order():
    # Lấy dữ liệu từ request.form
    data = request.form
    amount = int(float(data.get("amount", 10000)))
    embed_data = {
        "redirecturl": f"http://localhost:3000/laptops",
    }
    # Tạo ID giao dịch duy nhất cho đơn hàng
    app_trans_id = time.strftime("%y%m%d") + "_" + str(int(time.time()))
    app_time = int(time.time() * 1000)

    # Dữ liệu đơn hàng
    order = {
        "app_id": ZALOPAY_CONFIG["app_id"],
        "app_trans_id": app_trans_id,
        "app_user": "user123",  # Thông tin người dùng, có thể thay đổi
        "app_time": app_time,
        "embed_data": json.dumps(embed_data),
        "item": json.dumps([{}]),
        "amount": amount,
        "description": f"Thanh toán đơn hàng #{app_trans_id}",
        "bank_code": "zalopayapp",  # Mã ngân hàng nếu cần (nếu không để rỗng)
        "callback_url": "http://localhost:3000/products",
    }

    # Tạo chữ ký (MAC) cho đơn hàng
    data = f"{order['app_id']}|{order['app_trans_id']}|{order['app_user']}|{order['amount']}|{order['app_time']}|{order['embed_data']}|{order['item']}"
    order["mac"] = hmac.new(ZALOPAY_CONFIG["key1"].encode(), data.encode(), hashlib.sha256).hexdigest()

    # Gửi yêu cầu tạo đơn hàng đến ZaloPay
    try:
        response = requests.post(
            ZALOPAY_CONFIG["create_order_endpoint"],
            data=order,  # Changed to `data` for form-encoded content
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route("/zalo-ipn", methods=["POST"])
def zalo_ipn():
    # Lắng nghe IPN (Instant Payment Notification) từ ZaloPay
    ipn_data = request.json
    print("📥 IPN từ ZaloPay:", ipn_data)

    # Thực hiện kiểm tra thông tin từ ZaloPay (nếu cần)
    # Ví dụ: Kiểm tra mã đơn hàng và kết quả thanh toán

    # Trả lời ZaloPay để xác nhận đã nhận được IPN
    return jsonify({"return_code": 1, "return_message": "OK"})


@app.route('/register', methods=['POST'])
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

@app.route('/api/account', methods=['GET'])
def get_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"errCode": 1, "message": "Not authenticated"}), 401

    user = get_user_by_id(user_id)
    if user:
        return jsonify({"errCode": 0, "user": user}), 200
    else:
        return jsonify({"errCode": 1, "message": "User not found"}), 404

@app.route('/users', methods=['GET'])
def api_get_all_users():
    users = get_all_users()
    return jsonify(users), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def api_get_user_by_id(user_id):
    user = get_user_by_id(user_id)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "User does not exist"}), 404

@app.route('/users/<int:user_id>', methods=['PUT'])
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
    
    if check_existing_user(email, phone) and (user['email'] != email or user['phone'] != phone):
        return jsonify({"errCode": 1, "error": "Phone already exists"}), 409
    
    update_user(user_id, name=name, email=email, password=password, phone=phone, address=address)
    return jsonify({"errCode": 0, "message": "User information successfully updated"}), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def api_delete_user(user_id):
    delete_user(user_id)
    return jsonify({"errCode": 0, "message": "User has been deleted"}), 200

@app.route('/login', methods=['POST'])
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

@app.route('/changePassword', methods=['PUT'])
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

@app.route('/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({"errCode": 0, "message": "Logged out successfully"}), 200

@app.route("/products", methods=["GET"])
def get_products():
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM laptop")
        products = cursor.fetchall()
        cursor.close()
        return jsonify(products)
    except Exception as e:
        print("Error fetching products:", e)
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/filters", methods=["GET"])
def get_filters():
    try:
        cursor = db.cursor(dictionary=True)

        # Lấy các giá trị distinct từ các cột
        cursor.execute("SELECT DISTINCT screen_size FROM laptop ")
        screen_sizes = [row["screen_size"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT ram FROM laptop")
        ram_sizes = [row["ram"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT brand FROM laptop")
        brands = [row["brand"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT operating_system FROM laptop")
        operating_systems = [row["operating_system"] for row in cursor.fetchall()]

        # Trả về dữ liệu dưới dạng JSON
        filters = {
            "Display Size": screen_sizes,
            "RAM Size": ram_sizes,
            "Brands": brands,
            "Operating System": operating_systems,
        }

        cursor.close()
        return jsonify(filters)
    except Exception as e:
        print("Error fetching filters:", e)
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route("/product-images/<int:product_id>", methods=["GET"])
def get_product_images(product_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT image FROM products WHERE product_id = %s", (product_id,))
    images = cursor.fetchone()
    cursor.close()

    if images and images["image"]:
        image_urls = images["image"].split("; ")
    else:
        image_urls = []

    return jsonify(image_urls)

@app.route('/laptops', methods=['GET'])
def get_laptops():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT 
                p.product_id,
                p.title,
                p.price,
                p.image,
                p.rating,
                pa.attribute_name,
                pa.attribute_value
            FROM Products p
            LEFT JOIN Product_Attributes pa ON p.product_id = pa.product_id
            WHERE p.category_id = 4
        """)
        rows = cursor.fetchall()

        products = {}
        for row in rows:
            product_id = row['product_id']
            if product_id not in products:
                products[product_id] = {
                    'id': product_id,
                    'title': row['title'],
                    'price': row['price'],
                    'image': row['image'],
                    'rating': row['rating'],
                }

            attr_name = row['attribute_name']
            attr_value = row['attribute_value']
            if attr_name:
                products[product_id][attr_name] = attr_value  

        return jsonify(list(products.values()))
    finally:
        cursor.close()
        connection.close()

@app.route('/addToCart', methods=['POST'])
def add_to_cart():
    data = request.json
    user_id = data.get('user_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not user_id or not product_id:
        return jsonify({'error': 'user_id and product_id are required'}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            SELECT quantity FROM cart 
            WHERE user_id = %s AND product_id = %s
        """, (user_id, product_id))
        row = cursor.fetchone()

        if row:
            new_quantity = row[0] + quantity
            cursor.execute("""
                UPDATE cart
                SET quantity = %s
                WHERE user_id = %s AND product_id = %s
            """, (new_quantity, user_id, product_id))
        else:
            cursor.execute("""
                INSERT INTO cart (user_id, product_id, quantity)
                VALUES (%s, %s, %s)
            """, (user_id, product_id, quantity))

        connection.commit()
        return jsonify({"errCode": 0, 'message': 'Cart updated successfully'}), 200

    except Exception as e:
        connection.rollback()
        return jsonify({"errCode": 1, 'error': str(e)}), 500

    finally:
        cursor.close()
        connection.close()
        
@app.route('/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT 
                c.cart_id,
                c.product_id,
                c.quantity,
                p.title,
                p.price,
                p.image
            FROM cart c
            JOIN products p ON c.product_id = p.product_id
            WHERE c.user_id = %s
        """, (user_id,))
        rows = cursor.fetchall()

        cart_items = []
        for row in rows:
            cart_items.append({
                'cart_id': row['cart_id'],
                'product_id': row['product_id'],
                'name': row['title'],
                'price': row['price'],
                'quantity': row['quantity'],
                'image': row['image'],
            })

        return jsonify({"errCode": 0, "data": cart_items})
    finally:
        cursor.close()
        connection.close()

@app.route('/delete_cart/<int:cart_id>', methods=['DELETE'])
def delete_cart(cart_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM cart WHERE cart_id = %s", (cart_id,))
        cart = cursor.fetchone()
        if not cart:
            return jsonify({"message": "Cart not found"}), 404
        cursor.execute("DELETE FROM cart WHERE cart_id = %s", (cart_id,))
        connection.commit()
        return jsonify({"errCode": 0, "message": "Cart deleted successfully"}), 200
    except mysql.connector.Error as err:
        connection.rollback()
        return jsonify({"errCode": 1, "message": f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

def checkout(user_id, order_items, total_amount, payment_method):
    connection = get_db_connection()
    if not connection:
        raise Exception("Database connection failed")
    cursor = connection.cursor()
    try:
        order_id = int(f"{int(datetime.now().timestamp())}{user_id}")
        for item in order_items:
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

            cursor.execute("""
                INSERT INTO `Order` (order_id, user_id, product_id, quantity, price, status)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (order_id, user_id, product_id, quantity, price_per_item, 'pending'))

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
if __name__ == "__main__":
    app.run(debug=True, port=5000)

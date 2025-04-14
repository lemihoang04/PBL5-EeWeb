from flask import Flask, json, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
# from dotenv import load_dotenv

# # Load biến môi trường từ .env
# load_dotenv()
app = Flask(__name__)

CORS(app, origins="http://localhost:3000", supports_credentials=True)


# Kết nối MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    port=3306,
    password="",
    database="computer_store"
)

################USER############
cursor = db.cursor(dictionary=True)

# CREATE - Thêm user mới
@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    try:
        cursor.execute("""
            INSERT INTO user (name, email, phone, password)
            VALUES (%s, %s, %s, %s)
        """, (name, email, phone, password))
        db.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400

# READ - Lấy danh sách tất cả user
@app.route('/users', methods=['GET'])
def get_users():
    cursor.execute("SELECT * FROM user")
    users = cursor.fetchall()
    return jsonify(users)

# READ - Lấy thông tin user theo ID
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    cursor.execute("SELECT * FROM user WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

# UPDATE - Cập nhật thông tin user
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    cursor.execute("SELECT * FROM user WHERE user_id = %s", (user_id,))
    if not cursor.fetchone():
        return jsonify({'error': 'User not found'}), 404

    try:
        cursor.execute("""
            UPDATE user
            SET name = %s, email = %s, phone = %s, password = %s
            WHERE user_id = %s
        """, (name, email, phone, password, user_id))
        db.commit()
        return jsonify({'message': 'User updated successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400

# DELETE - Xóa user theo ID
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    cursor.execute("SELECT * FROM user WHERE user_id = %s", (user_id,))
    if not cursor.fetchone():
        return jsonify({'error': 'User not found'}), 404

    cursor.execute("DELETE FROM user WHERE user_id = %s", (user_id,))
    db.commit()
    return jsonify({'message': 'User deleted successfully'})

###########PRODUCT################
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
    cursor.execute("SELECT image FROM laptop WHERE id = %s", (product_id,))
    images = cursor.fetchone()
    cursor.close()

    if images and images["image"]:
        image_urls = images["image"].split("; ")
    else:
        image_urls = []

    return jsonify(image_urls)

##############COMPONENT###################
# Cursor dictionary style
cursor = db.cursor(dictionary=True)

# CREATE - Thêm một component mới
@app.route('/components', methods=['POST'])
def create_component():
    data = request.json
    try:
        cursor.execute("""
            INSERT INTO component (type, title, price, image, brand, series, model_number, specs)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['type'],
            data['title'],
            data['price'],
            data['image'],
            data['brand'],
            data['series'],
            data['model_number'],
            json.dumps(data['specs'])  # 🔥 Convert object to valid JSON string
        ))
        db.commit()
        return jsonify({"message": "Component created successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400

# READ - Lấy danh sách toàn bộ component
@app.route('/components', methods=['GET'])
def get_components():
    cursor.execute("SELECT * FROM component")
    result = cursor.fetchall()
    return jsonify(result), 200

# READ - Lấy 1 component theo ID
@app.route('/components/<int:component_id>', methods=['GET'])
def get_component(component_id):
    cursor.execute("SELECT * FROM component WHERE id = %s", (component_id,))
    result = cursor.fetchone()
    if result:
        return jsonify(result)
    return jsonify({'error': 'Component not found'}), 404

# UPDATE - Cập nhật 1 component
@app.route('/components/<int:component_id>', methods=['PUT'])
def update_component(component_id):
    data = request.json
    cursor.execute("SELECT * FROM component WHERE id = %s", (component_id,))
    if not cursor.fetchone():
        return jsonify({'error': 'Component not found'}), 404

    try:
        cursor.execute("""
            UPDATE component SET
                type = %s,
                title = %s,
                price = %s,
                image = %s,
                brand = %s,
                series = %s,
                model_number = %s,
                specs = %s
            WHERE id = %s
        """, (
            data['type'],
            data['title'],
            data['price'],
            data['image'],
            data['brand'],
            data['series'],
            data['model_number'],
            json.dumps(data['specs']),
            component_id
        ))
        db.commit()
        return jsonify({'message': 'Component updated successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400

# DELETE - Xoá 1 component
@app.route('/components/<int:component_id>', methods=['DELETE'])
def delete_component(component_id):
    cursor.execute("SELECT * FROM component WHERE id = %s", (component_id,))
    if not cursor.fetchone():
        return jsonify({'error': 'Component not found'}), 404

    cursor.execute("DELETE FROM component WHERE id = %s", (component_id,))
    db.commit()
    return jsonify({'message': 'Component deleted successfully'})


if __name__ == "__main__":
    app.run(debug=True, port=5000)

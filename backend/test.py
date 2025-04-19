from flask import Flask, json, jsonify, request
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)

# Kết nối MySQL với connection pool để quản lý kết nối tốt hơn
db_config = {
    'host': 'localhost',
    'user': 'root',
    'port': 3306,
    'password': '',
    'database': 'techshop_db',
    'pool_name': 'mypool',
    'pool_size': 5
}

def get_db_connection():
    try:
        return mysql.connector.connect(**db_config)
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

################USER############
# CREATE - Thêm user mới
@app.route('/users', methods=['POST'])
def create_user():
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
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
    finally:
        cursor.close()
        db.close()

# READ - Lấy danh sách tất cả user
@app.route('/users', methods=['GET'])
def get_users():
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM user")
        users = cursor.fetchall()
        return jsonify(users)
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

# READ - Lấy thông tin user theo ID
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM user WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        if user:
            return jsonify(user)
        return jsonify({'error': 'User not found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

# UPDATE - Cập nhật thông tin user
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    try:
        cursor.execute("SELECT * FROM user WHERE user_id = %s", (user_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'User not found'}), 404

        cursor.execute("""
            UPDATE user
            SET name = %s, email = %s, phone = %s, password = %s
            WHERE user_id = %s
        """, (name, email, phone, password, user_id))
        db.commit()
        return jsonify({'message': 'User updated successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        db.close()

# DELETE - Xóa user theo ID
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM user WHERE user_id = %s", (user_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'User not found'}), 404

        cursor.execute("DELETE FROM user WHERE user_id = %s", (user_id,))
        db.commit()
        return jsonify({'message': 'User deleted successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

###########PRODUCT################
@app.route("/laptops", methods=["GET"])
def get_products():
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM laptop")
        products = cursor.fetchall()
        return jsonify(products)
    except mysql.connector.Error as err:
        print(f"Error fetching products: {err}")
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

@app.route("/filters", methods=["GET"])
def get_filters():
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT DISTINCT screen_size FROM laptop")
        screen_sizes = [row["screen_size"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT ram FROM laptop")
        ram_sizes = [row["ram"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT brand FROM laptop")
        brands = [row["brand"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT operating_system FROM laptop")
        operating_systems = [row["operating_system"] for row in cursor.fetchall()]

        filters = {
            "Display Size": screen_sizes,
            "RAM Size": ram_sizes,
            "Brands": brands,
            "Operating System": operating_systems,
        }
        return jsonify(filters)
    except mysql.connector.Error as err:
        print(f"Error fetching filters: {err}")
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

@app.route("/product-images/<int:product_id>", methods=["GET"])
def get_product_images(product_id):
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT image FROM laptop WHERE id = %s", (product_id,))
        images = cursor.fetchone()
        if images and images["image"]:
            image_urls = images["image"].split("; ")
        else:
            image_urls = []
        return jsonify(image_urls)
    except mysql.connector.Error as err:
        print(f"Error fetching product images: {err}")
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

##############COMPONENT###################
# CREATE - Thêm một component mới
@app.route('/components', methods=['POST'])
def create_component():
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
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
            json.dumps(data['specs'])
        ))
        db.commit()
        return jsonify({"message": "Component created successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        db.close()

# READ - Lấy danh sách toàn bộ component
@app.route('/components', methods=['GET'])
def get_components():
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM component")
        result = cursor.fetchall()
        return jsonify(result), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

# READ - Lấy 1 component theo ID
@app.route('/components/<int:component_id>', methods=['GET'])
def get_component(component_id):
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM component WHERE id = %s", (component_id,))
        result = cursor.fetchone()
        if result:
            return jsonify(result)
        return jsonify({'error': 'Component not found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

# UPDATE - Cập nhật 1 component
@app.route('/components/<int:component_id>', methods=['PUT'])
def update_component(component_id):
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    data = request.json
    try:
        cursor.execute("SELECT * FROM component WHERE id = %s", (component_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Component not found'}), 404

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
    finally:
        cursor.close()
        db.close()

# DELETE - Xoá 1 component
@app.route('/components/<int:component_id>', methods=['DELETE'])
def delete_component(component_id):
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM component WHERE id = %s", (component_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Component not found'}), 404

        cursor.execute("DELETE FROM component WHERE id = %s", (component_id,))
        db.commit()
        return jsonify({'message': 'Component deleted successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

@app.route("/cpus", methods=["GET"])
def get_cpus():
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM component WHERE type = 'cpu'")
        cpus = cursor.fetchall()
        return jsonify(cpus), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

# @app.route("/components/<string:type>", methods=["GET"])
# def get_components_by_type(type):
#     valid_types = ['storage', 'psu', 'mainboard', 'gpu', 'cpu', 'ram', 'cpu_cooler', 'case']
#     if type not in valid_types:
#         return jsonify({"error": "Invalid component type"}), 400
#     db = get_db_connection()
#     if not db:
#         return jsonify({'error': 'Database connection failed'}), 500
#     cursor = db.cursor(dictionary=True)
#     try:
#         cursor.execute("SELECT * FROM component WHERE type = %s", (type,))
#         components = cursor.fetchall()
#         return jsonify(components), 200
#     except mysql.connector.Error as err:
#         return jsonify({"error": str(err)}), 500
#     finally:
#         cursor.close()
#         db.close()

@app.route("/components/<string:type>", methods=["GET"])
def get_components_by_type(type):
    valid_types = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case']
    if type not in valid_types:
        return jsonify({"error": "Invalid component type"}), 400
    
    db = get_db_connection()
    if not db:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = db.cursor(dictionary=True)
    try:
        query = """
        SELECT 
            p.product_id,
            p.title,
            p.price,
            p.stock,
            p.rating,
            p.description,
            p.image,
            p.created_at,
            p.updated_at,
            c.category_name,
            GROUP_CONCAT(pa.attribute_name, ':', pa.attribute_value) as attributes
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_attributes pa ON p.product_id = pa.product_id
        WHERE c.category_name = %s
        GROUP BY p.product_id
        """
        cursor.execute(query, (type,))
        components = cursor.fetchall()
        
        if not components:
            return jsonify({"message": "No components found for this type"}), 404
            
        return jsonify(components), 200
        
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
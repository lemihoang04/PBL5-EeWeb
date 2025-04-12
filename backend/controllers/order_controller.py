from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from datetime import datetime

app = Flask(__name__)

# Cấu hình kết nối MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'computer_store'

mysql = MySQL(app)

# CREATE - Tạo đơn hàng
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    user_id = data['user_id']
    product_id = data['product_id']
    quantity = data.get('quantity', 1)

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO `order` (user_id, product_id, quantity)
        VALUES (%s, %s, %s)
    """, (user_id, product_id, quantity))
    mysql.connection.commit()
    return jsonify({'message': 'Order created successfully'})

# READ - Lấy danh sách đơn hàng
@app.route('/api/orders', methods=['GET'])
def get_orders():
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT 
            o.booking_id,
            o.booking_date,
            o.quantity,
            o.status,
            u.name AS user_name,
            p.category,
            l.title AS laptop_title,
            l.price AS laptop_price,
            c.title AS component_title,
            c.price AS component_price,
            c.type AS component_type
        FROM `order` o
        JOIN user u ON o.user_id = u.user_id
        JOIN product p ON o.product_id = p.product_id
        LEFT JOIN laptop l ON p.category = 'laptop' AND p.reference_id = l.id
        LEFT JOIN component c ON p.category = 'component' AND p.reference_id = c.id
        ORDER BY o.booking_date DESC
    """)
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    result = [dict(zip(columns, row)) for row in rows]
    return jsonify(result)

# UPDATE - Cập nhật trạng thái đơn hàng
@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.json
    status = data['status']

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE `order`
        SET status = %s
        WHERE booking_id = %s
    """, (status, order_id))
    mysql.connection.commit()
    return jsonify({'message': 'Order updated successfully'})

# DELETE - Xoá đơn hàng
@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM `order` WHERE booking_id = %s", (order_id,))
    mysql.connection.commit()
    return jsonify({'message': 'Order deleted successfully'})

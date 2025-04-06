from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv

# Load biến môi trường từ .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Cho phép React gọi API từ Flask

# Kết nối MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    port=3306,
    database="amazon_db"
)

@app.route("/products", methods=["GET"])
def get_products():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM amazon_laptops")
    products = cursor.fetchall()
    cursor.close()
    return jsonify(products)

@app.route("/product-images/<int:product_id>", methods=["GET"])
def get_product_images(product_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT image FROM amazon_laptops WHERE id = %s", (product_id,))
    images = cursor.fetchone()
    cursor.close()

    # Kiểm tra nếu có dữ liệu và tách chuỗi thành danh sách
    if images and images["image"]:
        image_urls = images["image"].split("; ")  # Tách URL bằng dấu `; `
    else:
        image_urls = []

    return jsonify(image_urls)


@app.route("/product/<int:product_id>", methods=["GET"])
def get_product_details(product_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM amazon_laptops WHERE id = %s", (product_id,))
    product = cursor.fetchone()
    cursor.close()
    
    if product:
        return jsonify(product)
    else:
        return jsonify({"error": "Product not found"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)

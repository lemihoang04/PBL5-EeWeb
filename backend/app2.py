from flask import Flask, jsonify
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
    port=3307,
    password="",
    database="amazon_db"
)

@app.route("/products", methods=["GET"])
def get_products():
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM amazon_laptops")
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
        cursor.execute("SELECT DISTINCT screen_size FROM amazon_laptops ")
        screen_sizes = [row["screen_size"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT ram FROM amazon_laptops")
        ram_sizes = [row["ram"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT brand FROM amazon_laptops")
        brands = [row["brand"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT operating_system FROM amazon_laptops")
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


if __name__ == "__main__":
    app.run(debug=True, port=5000)

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



if __name__ == "__main__":
    app.run(debug=True, port=5000)

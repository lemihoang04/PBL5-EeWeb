
from pymongo import MongoClient

# Kết nối MongoDB Cloud
MONGO_URI = "mongodb+srv://anhzai2002:matzOtWu83LITqD6@plb5.t2lrlri.mongodb.net/?retryWrites=true&w=majority&appName=PLB5&tls=true"  # Thay bằng connect string của bạn
client = MongoClient(MONGO_URI)  # Kết nối đến MongoDB
db = client["ecommercedata"]  # Truy cập database "hotel_db"

import csv
from pymongo import MongoClient

# Kết nối MongoDB Cloud
MONGO_URI = "mongodb+srv://anhzai2002:matzOtWu83LITqD6@plb5.t2lrlri.mongodb.net/?retryWrites=true&w=majority&appName=PLB5&tls=true"
client = MongoClient(MONGO_URI)
db = client["ecommercedata"]
collection = db["laptops"]

# Đọc dữ liệu từ file CSV
def read_csv(file_path):
    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)
        headers = next(reader)  # Lấy tiêu đề cột
        data = []
        for row in reader:
            data.append(dict(zip(headers, row)))
    return data

# Đưa dữ liệu vào MongoDB, tránh trùng lặp
def upload_to_mongodb(data):
    for item in data:
        query = {"title": item["title"], "price": item["price"], "rating": item["rating"], "image": item["image"]}
        if not collection.find_one(query):  # Kiểm tra trùng lặp
            collection.insert_one(item)
            print(f"Inserted: {item['title']}")
        else:
            print(f"Skipped (Duplicate): {item['title']}")

if __name__ == "__main__":
    file_path = "E:/PBL5/PBL5_1/backend/datalaptop.csv"  # Đổi thành đường dẫn chính xác nếu cần
    laptop_data = read_csv(file_path)
    upload_to_mongodb(laptop_data)

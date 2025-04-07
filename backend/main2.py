from flask import Flask, jsonify, request, session
from werkzeug.utils import secure_filename
import time, hmac, hashlib, json, requests, urllib.request, urllib.parse
from backend.controllers.user_controller import *
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'hotel'
CORS(app, origins="http://localhost:3000", supports_credentials=True)


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
        "redirecturl": f"http://localhost:3000/products",
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

    if not any([name, email, password, phone]):
        return jsonify({"error": "No information to update"}), 400

    update_user(user_id, name=name, email=email, password=password, phone=phone)
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

@app.route('/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({"errCode": 0, "message": "Logged out successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)

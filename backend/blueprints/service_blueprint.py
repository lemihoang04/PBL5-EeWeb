from flask import Blueprint, request, jsonify, session
from DAL.service_dal import *
import time, hmac, hashlib, json, requests, urllib.request, urllib.parse

service_blueprint = Blueprint('service', __name__)
ZALOPAY_CONFIG = {
    "app_id": "2553",
    "key1": "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    "key2": "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    "create_order_endpoint": "https://sb-openapi.zalopay.vn/v2/create",
    "query_order_endpoint": "https://sb-openapi.zalopay.vn/v2/query",
}

@service_blueprint.route("/create_order", methods=["POST"])
def create_order():
    # Lấy dữ liệu từ request.form
    data = request.json
    amount = int(float(data.get("amount", 10000)))
    embed_data = {
        "redirecturl": f"http://localhost:3000/checkPayment",
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
        resp_json = response.json()
        # Trả về app_trans_id cho client sử dụng
        resp_json["app_trans_id"] = app_trans_id
        return jsonify(resp_json), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@service_blueprint.route("/zalo-ipn", methods=["POST"])
def zalo_ipn():
    # Lắng nghe IPN (Instant Payment Notification) từ ZaloPay
    ipn_data = request.json
    print("📥 IPN từ ZaloPay:", ipn_data)

    # Thực hiện kiểm tra thông tin từ ZaloPay (nếu cần)
    # Ví dụ: Kiểm tra mã đơn hàng và kết quả thanh toán

    # Trả lời ZaloPay để xác nhận đã nhận được IPN
    return jsonify({"return_code": 1, "return_message": "OK"})

@service_blueprint.route("/checkPayment", methods=["POST"])
def query_order():
    try:
        data = request.json
        app_trans_id = data.get("app_trans_id")
        if not app_trans_id:
            return jsonify({"errCode": 1, "message": "Missing app_trans_id"}), 400

        # Tạo dữ liệu truy vấn
        params = {
            "app_id": ZALOPAY_CONFIG["app_id"],
            "app_trans_id": app_trans_id,
        }
        # Tạo chữ ký (mac) cho truy vấn
        data_mac = f"{params['app_id']}|{params['app_trans_id']}|{ZALOPAY_CONFIG['key1']}"
        params["mac"] = hmac.new(ZALOPAY_CONFIG["key1"].encode(), data_mac.encode(), hashlib.sha256).hexdigest()

        # Gửi yêu cầu truy vấn đến ZaloPay
        response = requests.post(
            ZALOPAY_CONFIG["query_order_endpoint"],
            data=params,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"errCode": 1, "message": str(e)}), 500

@service_blueprint.route('/checkout', methods=['POST'])
def api_checkout():
    try:
        order_data = request.json
        required_fields = ['user_id', 'order_items', 'total_amount', 'payment_method', 'shipping_address']
        for field in required_fields:
            if field not in order_data:
                return jsonify({"errCode": 1, "message": f"Missing required field: {field}"}), 400
        result = checkout(order_data)
        return jsonify({"errCode": 0, "message": result['message'], "order_id": result['order_id']}), 200

    except Exception as e:
        return jsonify({"errCode": 1, "message": str(e)}), 500    

@service_blueprint.route('/orders/<int:user_id>', methods=['GET'])
def api_get_orders_by_user(user_id):
    try:
        orders = get_orders_by_user_id(user_id)
        return jsonify({"errCode": 0, "orders": orders}), 200
    except Exception as e:
        return jsonify({"errCode": 1, "message": str(e)}), 500

@service_blueprint.route('/order/<order_id>', methods=['GET'])
def api_get_order_by_id(order_id):
    try:
        order = get_order_by_id(order_id)
        if order:
            return jsonify({"errCode": 0, "data": order}), 200
        else:
            return jsonify({"errCode": 1, "message": "Order not found"}), 404
    except Exception as e:
        return jsonify({"errCode": 1, "message": str(e)}), 500

@service_blueprint.route('/payment/<order_id>', methods=['GET'])
def api_get_payment_by_order_id(order_id):
    try:
        payment = get_payment_by_order_id(order_id)
        if payment:
            return jsonify({"errCode": 0, "data": payment}), 200
        else:
            return jsonify({"errCode": 1, "message": "Payment not found"}), 404
    except Exception as e:
        return jsonify({"errCode": 1, "message": str(e)}), 500




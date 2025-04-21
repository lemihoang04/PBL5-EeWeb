import mysql.connector

DATABASE_CONFIG = {
    'user': 'root',
    'password': '',
    'host': 'localhost',  
<<<<<<< HEAD
    'port': 3306, #3307        
=======
    'port': 3306,        
>>>>>>> 89321cb4be26e1d64cd49bb0abcd972927e9712f
    'database': 'techshop_db',
}
ZALOPAY_CONFIG = {
    "app_id": "2553",
    "key1": "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    "key2": "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    "create_order_endpoint": "https://sb-openapi.zalopay.vn/v2/create",
    "query_order_endpoint": "https://sb-openapi.zalopay.vn/v2/query",
}
def get_db_connection():
    connection = mysql.connector.connect(**DATABASE_CONFIG)
    return connection
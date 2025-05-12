from config import get_db_connection
from mysql.connector import Error

def admin_to_json(admin_data):
    return {
        "id": admin_data['id'],
        "username": admin_data['username'],
        "created_at": admin_data['created_at'].isoformat(),
    }

def get_dashboard_data():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    # Get order counts by status
    cursor.execute("""
        SELECT status, COUNT(*) as count
        FROM `Order`
        GROUP BY status
    """)
    status_counts = cursor.fetchall()
    
    # Get revenue data for chart (last 7 days)
    cursor.execute("""
        SELECT DATE(created_at) as date, SUM(total_price) as revenue
        FROM `Order`
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
    """)
    revenue_data = cursor.fetchall()
    
    # Get top selling products
    cursor.execute("""
        SELECT p.title, COUNT(o.product_id) as sold_count
        FROM `Order` o
        JOIN products p ON o.product_id = p.product_id
        GROUP BY o.product_id
        ORDER BY sold_count DESC
        LIMIT 5
    """)
    top_products = cursor.fetchall()
    
    cursor.close()
    connection.close()
    
    return {
        "statusCounts": status_counts,
        "revenueData": revenue_data,
        "topProducts": top_products
    }

def get_admin_users():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    
    cursor.close()
    connection.close()
    
    return users

def login_admin(username, password):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM admin WHERE username = %s AND password = %s", (username, password))
    admin = cursor.fetchone()
    cursor.close()
    connection.close()
    return admin_to_json(admin) if admin else None

def verify_admin_credentials(username, password):
    # In a real application, you would check against a database
    # This is just a simple example
    admin_users = {
        "admin": "admin123",
        "superadmin": "super123"
    }
    
    return username in admin_users and admin_users[username] == password
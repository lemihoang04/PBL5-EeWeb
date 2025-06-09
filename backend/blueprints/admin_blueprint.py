from flask import Blueprint, request, jsonify, session
from DAL.user_dal import get_user_by_id, get_all_users
from DAL.admin_dal import login_admin 
# from DAL.product_dal import get_all_products
from DAL.order_dal import get_all_orders
from datetime import datetime, timedelta
from collections import defaultdict

admin_blueprint = Blueprint('admin', __name__)

@admin_blueprint.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    admin = login_admin(username, password)

    if admin:
        session['admin_logged_in'] = True
        return jsonify({
            "errCode": 0,
            "message": "Login successful",
            "admin": admin
        })
    else:
        return jsonify({
            "errCode": 1,
            "message": "Invalid username or password"
        }), 401

@admin_blueprint.route('/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_logged_in', None)
    return jsonify({
        "errCode": 0,
        "message": "Logged out successfully"
    })

@admin_blueprint.route('/admin/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    # Get total users
    users = get_all_users()
    total_users = len(users) if users else 0
    
    # Get total products
    # products = get_all_products()
    # total_products = len(products) if products else 0
    
    # Get total orders
    orders = get_all_orders()
    total_orders = len(orders) if orders else 0
    
    # Calculate total revenue
    total_revenue = 0
    if orders:
        for order in orders:
            if order.get('price'):
                total_revenue += float(order.get('price', 0))
    
    # Get recent orders (last 5)
    recent_orders = []
    if orders:
        sorted_orders = sorted(orders, key=lambda x: x.get('created_at', ''), reverse=True)
        recent_orders = sorted_orders[:5]
    
    # Calculate daily revenue for the last 7 days
    daily_revenue = defaultdict(float)
    today = datetime.now().date()
    
    # Initialize last 7 days with 0 revenue
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        daily_revenue[date.strftime('%Y-%m-%d')] = 0
    
    # Calculate actual daily revenue from orders
    if orders:
        for order in orders:
            if order.get('created_at') and order.get('price'):
                try:
                    created_at = order['created_at']
                    
                    # Convert to string if it's a datetime object
                    if isinstance(created_at, datetime):
                        created_at_str = created_at.strftime('%Y-%m-%d %H:%M:%S')
                        order_date = created_at.date()
                    else:
                        # Handle string format: "2025-06-03 12:58:02"
                        created_at_str = str(created_at)
                        # Parse just the date part (first 10 characters: YYYY-MM-DD)
                        order_date = datetime.strptime(created_at_str[:10], '%Y-%m-%d').date()
                    
                    # Check if within last 7 days
                    days_diff = (today - order_date).days
                    if 0 <= days_diff <= 6:
                        daily_revenue[order_date.strftime('%Y-%m-%d')] += float(order.get('price', 0))
                        
                except (ValueError, TypeError) as e:
                    print(f"Error parsing date: {created_at}, error: {e}")
                    continue
    
    # Convert to lists for frontend
    daily_labels = list(daily_revenue.keys())
    daily_values = [round(daily_revenue[date], 2) for date in daily_labels]
    
    # Create stats for dashboard
    return jsonify({
        "errCode": 0,
        "stats": {
            "totalUsers": total_users,
            # "totalProducts": total_products,
            "totalOrders": total_orders,
            "totalRevenue": round(total_revenue, 2),
            "recentOrders": recent_orders,
            "dailyRevenue": {
                "labels": daily_labels,
                "values": daily_values
            }
        }
    })

@admin_blueprint.route('/admin/users', methods=['GET'])
def get_admin_users():
    users = get_all_users()
    return jsonify({
        "errCode": 0,
        "users": users or []
    })

@admin_blueprint.route('/admin/orders', methods=['GET'])
def get_admin_orders():
    orders = get_all_orders()
    return jsonify({
        "errCode": 0,
        "orders": orders or []
    })

@admin_blueprint.route('/admin/products', methods=['GET'])
def get_admin_products():
    products = get_all_products()
    return jsonify({
        "errCode": 0,
        "products": products or []
    })
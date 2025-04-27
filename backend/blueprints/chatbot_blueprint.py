from flask import Blueprint, request, jsonify
from DAL.product_dal import get_products, get_product_by_id
from DAL.order_dal import get_order_by_id

chatbot_blueprint = Blueprint('chatbot', __name__)

@chatbot_blueprint.route("/chatbot/query", methods=["POST"])
def chatbot_query():
    data = request.json
    query = data.get('query', '').lower()
    user_id = data.get('user_id')
    
    # Simple keyword-based response system
    if any(word in query for word in ['hello', 'hi', 'hey']):
        return jsonify({"response": "Hello! Welcome to TechShop. How can I help you today?"})
    
    elif any(word in query for word in ['product', 'item', 'phone', 'laptop']):
        products = get_products(limit=5)
        product_names = [p['title'] for p in products]
        return jsonify({
            "response": f"We have many products including: {', '.join(product_names[:3])} and more. Would you like to see our featured products?"
        })
    
    elif any(word in query for word in ['order', 'purchase', 'buy']):
        if user_id:
            return jsonify({"response": "You can check your orders in the Orders section. Is there a specific order you need help with?"})
        else:
            return jsonify({"response": "You'll need to log in to view your orders. Can I help you with something else?"})
    
    elif any(word in query for word in ['payment', 'pay', 'checkout']):
        return jsonify({"response": "We accept various payment methods including credit cards and ZaloPay. Would you like to know more about our payment options?"})
    
    elif any(word in query for word in ['contact', 'support', 'help']):
        return jsonify({"response": "You can reach our customer support at support@techshop.com or call us at (123) 456-7890."})
    
    else:
        return jsonify({"response": "I'm not sure I understand. Could you rephrase your question or ask about our products, orders, or payment options?"})
from flask import Blueprint, request, jsonify
from DAL.product_dal import *
from context.langchain_utils import create_product_agent  # Thêm import này

chatbot_blueprint = Blueprint('chatbot', __name__)


# Khởi tạo agent một lần (hoặc có thể tạo trong hàm nếu muốn mỗi lần mới)
product_agent = create_product_agent()

@chatbot_blueprint.route("/chatbot/query", methods=["POST"])
def chatbot_langchain_query():
    user_message = request.json.get('query', '')
    
    # Check for greeting before invoking the LLM agent.
    if any(greeting in user_message.lower() for greeting in ["hi", "hello", "hey"]):
        response = "Hello! I'm your product assistant. How can I help you find products today?"
        return jsonify({'response': response})
    
    try:
        response = product_agent.invoke(user_message)
        return jsonify({'response': response})
    except Exception as e:
        error_text = str(e)
        if "Final Answer:" in error_text:
            start_idx = error_text.find("Final Answer:") + len("Final Answer:")
            response = error_text[start_idx:].strip()
        else:
            response = "I encountered an issue processing your request. Please try asking about specific product details."
        return jsonify({'response': response})
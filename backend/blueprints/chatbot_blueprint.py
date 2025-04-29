from flask import Blueprint, request, jsonify
from DAL.product_dal import *
from context.langchain_utils import create_product_agent  # Thêm import này

chatbot_blueprint = Blueprint('chatbot', __name__)


# Khởi tạo agent một lần (hoặc có thể tạo trong hàm nếu muốn mỗi lần mới)
product_agent = create_product_agent()

@chatbot_blueprint.route("/chatbot/query", methods=["POST"])
def chatbot_langchain_query():
    try:
        user_message = request.json['query']
        response = product_agent.invoke(user_message)
        return jsonify({'response': response})
    except Exception as e:
        # Fallback for errors
        if any(greeting in user_message.lower() for greeting in ["hi", "hello", "hey"]):
            response = "Hello! I'm your product assistant. How can I help you find products today?"
            return jsonify({'response': response})
        else:
            # Extract useful information from the error if possible
            error_text = str(e)
            if "Final Answer:" in error_text:
                # Extract the final answer from the error message
                start_idx = error_text.find("Final Answer:") + len("Final Answer:")
                response = error_text[start_idx:].strip()
                return jsonify({'response': response})
            else:
                response = "I encountered an issue processing your request. Please try asking about specific product details."
                return jsonify({'response': response})
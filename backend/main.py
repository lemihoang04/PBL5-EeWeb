from flask import Flask
from flask_cors import CORS
from blueprints.user_blueprint import user_blueprint
from blueprints.service_blueprint import service_blueprint
from blueprints.cart_blueprint import cart_blueprint
from blueprints.product_blueprint import product_blueprint
from blueprints.order_blueprint import order_blueprint
from blueprints.category_blueprint import category_blueprint
from blueprints.chatbot_blueprint import chatbot_blueprint
from blueprints.review_blueprint import review_blueprint
from blueprints.admin_blueprint import admin_blueprint
 
app = Flask(__name__)
app.secret_key = "phuocnopro123" 
CORS(app, origins="http://localhost:3000", supports_credentials=True)


app.register_blueprint(user_blueprint)
app.register_blueprint(service_blueprint)
app.register_blueprint(cart_blueprint)
app.register_blueprint(product_blueprint)
app.register_blueprint(order_blueprint)
app.register_blueprint(category_blueprint)
app.register_blueprint(chatbot_blueprint)  
app.register_blueprint(review_blueprint)
app.register_blueprint(admin_blueprint)
if __name__ == "__main__":
    app.run(debug=True, port=5000)

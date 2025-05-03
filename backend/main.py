from flask import Flask
from flask_cors import CORS
from blueprints.user_blueprint import user_blueprint
from blueprints.service_blueprint import service_blueprint
from blueprints.cart_blueprint import cart_blueprint
from blueprints.product_blueprint import product_blueprint
from blueprints.order_blueprint import order_blueprint
<<<<<<< HEAD
from blueprints.category_blueprint import category_blueprint
=======
from blueprints.chatbot_blueprint import chatbot_blueprint
>>>>>>> 0fc7324a961e590c11b1f487e1afd6a462b1ce34
 
app = Flask(__name__)
app.secret_key = "phuocnopro123" 
CORS(app, origins="http://localhost:3000", supports_credentials=True)


app.register_blueprint(user_blueprint)
app.register_blueprint(service_blueprint)
app.register_blueprint(cart_blueprint)
app.register_blueprint(product_blueprint)
app.register_blueprint(order_blueprint)
<<<<<<< HEAD
app.register_blueprint(category_blueprint)
=======
app.register_blueprint(chatbot_blueprint)  # Thêm dòng này
>>>>>>> 0fc7324a961e590c11b1f487e1afd6a462b1ce34

if __name__ == "__main__":
    app.run(debug=True, port=5000)

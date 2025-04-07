from backend.app2 import db

class Order(db.Model):
    __tablename__ = 'order'
    booking_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'), nullable=False)
    booking_date = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    quantity = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default='pending')

from flask import Blueprint, request, jsonify, session
from DAL.product_dal import *

product_blueprint = Blueprint('product', __name__)

@product_blueprint.route("/filters", methods=["GET"])
def get_filters():
    try:
        filters = dal_get_filters()
        return jsonify(filters)
    except Exception as e:
        print("Error fetching filters:", e)
        return jsonify({"error": "Internal Server Error"}), 500

@product_blueprint.route("/product-images/<int:product_id>", methods=["GET"])
def get_product_images(product_id):
    try:
        image_urls = dal_get_product_images(product_id)
        return jsonify(image_urls)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_blueprint.route('/laptops', methods=['GET'])
def get_laptops():
    try:
        laptops = dal_get_laptops()
        return jsonify(laptops)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/components/<string:type>", methods=["GET"])
def get_components_by_type(type):
    try:
        components, status = dal_get_components_by_type(type)
        if status == 200:
            return jsonify(components), 200
        else:
            return jsonify(components), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500
from flask import Blueprint, request, jsonify
from DAL.category_dal import get_all_categories, create_category, update_category

category_blueprint = Blueprint('category', __name__)

@category_blueprint.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = get_all_categories()
        if categories is None:
            categories = []
        # print("Categories from database:", categories)  # Thêm log để debug
        return jsonify(categories)
    except Exception as e:
        print("Error getting categories:", str(e))  # Thêm log để debug
        return jsonify([])

@category_blueprint.route('/categories', methods=['POST'])
def add_category():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    create_category(name)
    return jsonify({'message': 'Category created'}), 201

@category_blueprint.route('/categories/<int:category_id>', methods=['PUT'])
def edit_category(category_id):
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    update_category(category_id, name)
    return jsonify({'message': 'Category updated'}), 200

# @category_blueprint.route('/categories/<int:category_id>', methods=['DELETE'])
# def remove_category(category_id):
#     delete_category(category_id)
#     return jsonify({'message': 'Category deleted'}), 200
from flask import Blueprint, request, jsonify, session
from DAL.product_dal import *

product_blueprint = Blueprint('product', __name__)

@product_blueprint.route("/products", methods=["GET"])
def get_all_products():
    try:
        products, status = dal_get_all_products()
        if status == 200:
            return jsonify(products), 200
        else:
            return jsonify(products), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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

# @product_blueprint.route("/components/<string:type>", methods=["GET"])
# def get_components_by_type(type):
#     try:
#         components, status = dal_get_components_by_type(type)
#         if status == 200:
#             return jsonify(components), 200
#         else:
#             return jsonify(components), status
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
@product_blueprint.route("/getallproduct", methods=["GET"])
def get_all_product():
    try:
        products = get_products_from_db_by_query()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@product_blueprint.route("/components/<int:product_id>", methods=["GET"])
def get_component_by_id(product_id):
    try:
        component, status = dal_get_component_by_id(product_id)
        if status == 200:
            return jsonify(component), 200
        else:
            return jsonify(component), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    
# @product_blueprint.route("/components/<string:type>", methods=["GET"])
# def get_components(type):
#     """
#     API route to get components by type or CPU Coolers compatible with a specific CPU socket.

#     Args:
#         type (str): The category name of the component (e.g., 'CPU', 'RAM', 'CPU Cooler').
    
#     Query Parameters:
#         cpu_socket (str, optional): The CPU socket to filter CPU Coolers (e.g., 'AM4', 'LGA1700').
    
#     Returns:
#         JSON response with components or error message.
#     """
#     try:
#         # Kiểm tra nếu type là 'CPU Cooler' và có tham số cpu_socket
#         cpu_socket = request.args.get('cpu_socket')
#         if type.lower() == 'cpu cooler' and cpu_socket:
#             print(f"Getting CPU Coolers compatible with socket: {cpu_socket}")
#             coolers, status = dal_CPU_Cooler_vs_CPU(cpu_socket)
#             if status == 200:
#                 return jsonify(coolers), 200
#             else:
#                 return jsonify(coolers), status

#         # Nếu không có cpu_socket, xử lý như bình thường
#         if request.args:
#             # Có query parameters - lọc theo thuộc tính
#             attributes = {}
#             for key, value in request.args.items():
#                 attributes[key] = value

#             print(f"Filtering {type} with attributes: {attributes}")
#             components, status = dal_get_components_by_attributes(type, attributes)
#         else:
#             # Không có query parameters - lấy tất cả components theo type
#             print(f"Getting all components of type: {type}")
#             components, status = dal_get_components_by_attributes(type)
        
#         # Trả về kết quả
#         if status == 200:
#             return jsonify(components), 200
#         else:
#             return jsonify(components), status
#     except Exception as e:
#         print(f"Error in get_components: {e}")
#         return jsonify({"error": str(e)}), 500
    
# Đây là đoạn code đã được kết hợp từ cả hai hàm
@product_blueprint.route("/components/<string:type>", methods=["GET"])
def get_components_by_type(type):
    try:
        # Kiểm tra xem có query parameters không
        if request.args:
            # Có query parameters - lọc theo thuộc tính
            attributes = {}
            for key, value in request.args.items():
                attributes[key] = value

            print(f"Filtering {type} with attributes: {attributes}")
            components, status = dal_get_components_by_attributes(type, attributes)
        else:
            # Không có query parameters - lấy tất cả components theo type
            print(f"Getting all components of type: {type}")
            components, status = dal_get_components_by_attributes(type)
        
        # Phần code sau đây sẽ chạy sau khi đã gán giá trị cho components và status
        if status == 200:
            return jsonify(components), 200
        else:
            return jsonify(components), status
    except Exception as e:
        print(f"Error in get_components_by_type: {e}")
        return jsonify({"error": str(e)}), 500
    
@product_blueprint.route("/cpu-coolers/compatible/<string:cpu_socket>", methods=["GET"])
def get_compatible_cpu_coolers(cpu_socket):
    """
    API route to get CPU Coolers compatible with a specific CPU socket.
    
    Args:
        cpu_socket (str): The CPU socket to match (e.g., 'AM4', 'LGA1700')
    
    Returns:
        JSON response with compatible CPU Coolers or error message.
    """
    try:
        # Gọi hàm DAL để lấy danh sách CPU Cooler tương thích
        coolers, status = dal_CPU_Cooler_vs_CPU(cpu_socket)
        
        # Trả về kết quả
        if status == 200:
            return jsonify(coolers), 200
        else:
            return jsonify(coolers), status
    except Exception as e:
        print(f"Error in get_compatible_cpu_coolers: {e}")
        return jsonify({"error": str(e)}), 500
    
    
@product_blueprint.route("/mainboards/compatible/<string:cpu_socket>", methods=["GET"])
def get_compatible_mainboards(cpu_socket):
    """
    API route to get Mainboards compatible with a specific CPU socket.
    
    Args:
        cpu_socket (str): The CPU socket to match (e.g., 'AM4', 'LGA1700')
    
    Returns:
        JSON response with compatible Mainboards or error message.
    """
    try:
        # Call the DAL function to get compatible mainboards
        mainboards, status = dal_Mainboard_vs_CPU(cpu_socket)
        
        # Return the result
        if status == 200:
            return jsonify(mainboards), 200
        else:
            return jsonify(mainboards), status
    except Exception as e:
        print(f"Error in get_compatible_mainboards: {e}")
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/ram/compatible/<string:memory_type>", methods=["GET"])
def get_compatible_Ram(memory_type):
    """
    API route to get Mainboards compatible with a specific CPU socket.
    
    Args:
        cpu_socket (str): The CPU socket to match (e.g., 'AM4', 'LGA1700')
    
    Returns:
        JSON response with compatible Mainboards or error message.
    """
    try:
        # Call the DAL function to get compatible mainboards
        ram, status = dal_RAM_vs_Mainboard(memory_type)
        
        # Return the result
        if status == 200:
            return jsonify(ram), 200
        else:
            return jsonify(ram), status
    except Exception as e:
        print(f"Error in get_compatible_mainboards: {e}")

@product_blueprint.route("/storage/compatible", methods=["GET"])
def get_compatible_storage():
    """
    API route to get storage devices compatible with motherboards.
    
    Returns:
        JSON response with compatible storage devices or error message.
    """
    try:
        # Call the DAL function to get compatible storage devices
        storage_devices, status = dal_Storage_vs_Mainboard()
        
        # Return the result
        if status == 200:
            return jsonify(storage_devices), 200
        else:
            return jsonify(storage_devices), status
    except Exception as e:
        print(f"Error in get_compatible_storage: {e}")
        return jsonify({"error": str(e)}), 500
    
@product_blueprint.route("/cases/compatible/<string:form_factor>", methods=["GET"])
def get_compatible_cases(form_factor):
    """
    API route to get Cases compatible with a specific Mainboard form factor.
    
    Args:
        form_factor (str): The form factor to match (e.g., 'ATX', 'Micro-ATX', 'Mini-ITX')
    
    Returns:
        JSON response with compatible cases or error message.
    """
    try:
        # Call the DAL function to get compatible cases
        cases, status = dal_Case_vs_Mainboard(form_factor)
        
        # Return the result
        if status == 200:
            return jsonify(cases), 200
        else:
            return jsonify(cases), status
    except Exception as e:
        print(f"Error in get_compatible_cases: {e}")
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/psu/compatible/<int:total_tdp>", methods=["GET"])
def get_compatible_psu(total_tdp):
    """
    API route to get PSUs compatible with a system having the specified total TDP.
    
    Args:
        total_tdp (int): Total power consumption (TDP) of the system in watts
    
    Returns:
        JSON response with compatible PSUs or error message.
    """
    try:
        # Call the DAL function to get compatible PSUs
        psus, status = dal_PSU_vs_TotalTDP(total_tdp)
        
        # Return the result
        if status == 200:
            return jsonify(psus), 200
        else:
            return jsonify(psus), status
    except Exception as e:
        print(f"Error in get_compatible_psu: {e}")
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/product/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    """
    API endpoint to delete a product by ID
    
    Args:
        product_id (int): The ID of the product to delete
        
    Returns:
        JSON response with success or error message
    """
    try:
        result, status = dal_delete_product(product_id)
        return jsonify(result), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/product/<int:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    try:
        product, status = dal_get_product_by_id(product_id)
        if status == 200:
            return jsonify(product), 200
        else:
            return jsonify({"error": "Product not found"}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/category/<int:category_id>/products", methods=["GET"])
def get_products_by_category(category_id):
    try:
        products, status = dal_get_products_by_category(category_id)
        return jsonify(products), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@product_blueprint.route("/featured-categories", methods=["GET"])
def get_products_from_different_categories():
    try:
        products, status = dal_get_products_from_different_categories()
        return jsonify(products), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

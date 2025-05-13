from flask import Blueprint, request, jsonify, session, current_app
from DAL.product_dal import *
import os
import json
from werkzeug.utils import secure_filename
# from DAL.gdrive_utils_new import upload_image_to_drive

# Import patched version of component functions
try:
    from DAL.component_patch import dal_get_components_by_attributes as patched_dal_get_components_by_attributes
    print("Successfully imported patched dal_get_components_by_attributes function")
except ImportError as e:
    print(f"Failed to import patched function: {e}")
    patched_dal_get_components_by_attributes = None

product_blueprint = Blueprint('product', __name__)

@product_blueprint.route("/products", methods=["GET"])
def get_all_products():
    try:
        products, status = dal_get_all_products()
        if status == 200:
            # Wrap in 'products' object to match what frontend expects
            return jsonify({"products": products}), 200
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
        print(f"Fetched {len(laptops) if laptops else 0} laptops from database")
        for idx, laptop in enumerate(laptops[:3] if laptops else []):
            print(f"Sample laptop {idx + 1}: {laptop.get('title')} (ID: {laptop.get('id')})")
        return jsonify(laptops)
    except Exception as e:
        print(f"Error in get_laptops: {e}")
        return jsonify({"error": str(e)}), 500

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
    
@product_blueprint.route("/components/<string:type>", methods=["GET"])
def get_components_by_type(type):
    try:
        print(f"Received request for components of type: {type}")
        
        # First try to get category info directly from the database
        db = get_db_connection()
        if not db:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = db.cursor(dictionary=True)
        try:
            # Find matching category by name (case insensitive)
            cursor.execute("""
                SELECT category_id, category_name 
                FROM categories 
                WHERE LOWER(category_name) = LOWER(%s)
            """, (type,))
            
            category = cursor.fetchone()
            
            if category:
                print(f"Found matching category: {category['category_name']} (ID: {category['category_id']})")
                type_to_use = category['category_name']  # Use exact case from database
            else:
                print(f"No matching category found for '{type}', using fallback method")
                # Fallback to standard types list
                valid_types = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case']
                standardized_type = None
                
                # Try to match against valid types in a case-insensitive way
                for valid_type in valid_types:
                    if valid_type.lower() == type.lower():
                        standardized_type = valid_type
                        print(f"Matched {type} to standardized type: {standardized_type}")
                        break
                
                # Use standardized type if found, otherwise use original
                type_to_use = standardized_type if standardized_type else type
        finally:
            cursor.close()
            db.close()
          # Kiểm tra xem có query parameters không
        if request.args:
            # Có query parameters - lọc theo thuộc tính
            attributes = {}
            for key, value in request.args.items():
                attributes[key] = value

            print(f"Filtering {type_to_use} with attributes: {attributes}")
            
            # Use patched version if available, fall back to original
            if patched_dal_get_components_by_attributes:
                print("Using patched function for component filtering")
                components, status = patched_dal_get_components_by_attributes(type_to_use, attributes)
            else:
                components, status = dal_get_components_by_attributes(type_to_use, attributes)
        else:
            # Không có query parameters - lấy tất cả components theo type
            print(f"Getting all components of type: {type_to_use}")
            try:
                # Use patched version if available, fall back to original
                if patched_dal_get_components_by_attributes:
                    print("Using patched function for component listing")
                    components, status = patched_dal_get_components_by_attributes(type_to_use)
                else:
                    components, status = dal_get_components_by_attributes(type_to_use)
            except Exception as e:
                print(f"Error in dal_get_components_by_attributes: {e}")
                # Fallback to simpler method if attribute filtering fails
                components, status = dal_get_components_by_type(type_to_use)
        
        # Phần code sau đây sẽ chạy sau khi đã gán giá trị cho components và status
        if status == 200:
            return jsonify(components), 200
        else:
            return jsonify(components), status
    except Exception as e:
        import traceback
        print(f"Error in get_components_by_type: {e}")
        print(traceback.format_exc())
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500
    
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

@product_blueprint.route("/product-categories", methods=["GET"])
def get_product_categories():
    """
    API endpoint to get all available product categories.
    
    Returns:
        JSON response with categories or error message.
    """
    try:
        categories, status = dal_get_product_categories()
        return jsonify(categories), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/product-schema/<string:category_name>", methods=["GET"])
def get_product_schema(category_name):
    """
    API endpoint to get schema for a specific product category.
    
    Args:
        category_name (str): The name of the product category
        
    Returns:
        JSON response with schema fields or error message.
    """
    try:
        schema, status = dal_get_product_schema(category_name)
        return jsonify(schema), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/products", methods=["POST"])
def add_product():
    """
    API endpoint to add a new product.
    
    Request JSON should contain:
      - category_name: The product category name
      - common_fields: Fields for the products table
      - specific_fields: Fields for the category-specific table
      - attributes: Additional product attributes (optional)
    
    Returns:
        JSON response with success message or error.
    """
    try:
        # Extract form data
        product_data = {}
        
        # Get category name
        category_name = request.form.get('category_name')
        if not category_name:
            return jsonify({"error": "Category name is required"}), 400
        
        product_data['category_name'] = category_name
        
        # Extract common fields
        common_fields = {}
        for key in request.form:
            if key.startswith('common_'):
                field_name = key.replace('common_', '')
                common_fields[field_name] = request.form.get(key)
          # Handle images
        image_urls = []
        if 'images' in request.files:
            image_files = request.files.getlist('images')
            for image in image_files:
                if image and image.filename:
                    try:
                        # Generate a unique filename to prevent overwriting
                        from datetime import datetime
                        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                        filename = f"{timestamp}_{secure_filename(image.filename)}"
                        
                        # Save to temp path
                        temp_path = os.path.join(current_app.config.get('UPLOAD_FOLDER', '/tmp'), filename)
                        image.save(temp_path)
                          # Upload to Google Drive with automatic local fallback
                        image_url = upload_image_to_drive(temp_path)
                                
                        # Add the URL to our list if it was successfully created
                        if image_url:
                            image_urls.append(image_url)
                    except Exception as e:
                        print(f"Error processing image {image.filename}: {str(e)}")
                        # Continue processing other images
                    finally:
                        # Clean up temp file
                        if 'temp_path' in locals() and os.path.exists(temp_path):
                            try:
                                os.remove(temp_path)
                            except:
                                pass
        # Nếu có ảnh thì mới thêm vào common_fields
        if image_urls:
            common_fields['image'] = "; ".join(image_urls)
        
        product_data['common_fields'] = common_fields
          # Extract specific fields
        specific_fields = {}
        # First check if specific_fields was sent as JSON string
        if 'specific_fields' in request.form:
            try:
                specific_fields = json.loads(request.form.get('specific_fields'))
            except json.JSONDecodeError:
                pass
                
        # Also check for individual specific_ fields
        for key in request.form:
            if key.startswith('specific_') and key != 'specific_fields':
                field_name = key.replace('specific_', '')
                specific_fields[field_name] = request.form.get(key)
        
        product_data['specific_fields'] = specific_fields
        
        # Extract attributes
        attributes = {}
        # First check if attributes was sent as JSON string
        if 'attributes' in request.form:
            try:
                attributes = json.loads(request.form.get('attributes'))
            except json.JSONDecodeError:
                pass
                
        # Also check for individual attr_ fields
        for key in request.form:
            if key.startswith('attr_'):
                attr_name = key.replace('attr_', '')
                attributes[attr_name] = request.form.get(key)
        
        product_data['attributes'] = attributes
        
        # Add the product
        result, status = dal_add_product(product_data)
        
        return jsonify(result), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/check-static", methods=["GET"])
def check_static_folder():
    """
    API endpoint to check if static folder is properly configured.
    For debugging purposes.
    """
    try:
        # Get the static folder path
        static_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static')
        uploads_path = os.path.join(static_path, 'uploads')
        
        # Check if directories exist
        static_exists = os.path.exists(static_path)
        uploads_exists = os.path.exists(uploads_path)
        
        # Check permissions (try to write a test file)
        permission_ok = False
        try:
            test_file_path = os.path.join(uploads_path, 'test_write.txt')
            with open(test_file_path, 'w') as f:
                f.write('Test write access')
            os.remove(test_file_path)
            permission_ok = True
        except Exception as e:
            permission_ok = str(e)
        
        # Get list of files in uploads folder
        files = []
        if uploads_exists:
            files = os.listdir(uploads_path)
        
        # Result
        result = {
            'static_exists': static_exists,
            'static_path': static_path,
            'uploads_exists': uploads_exists,
            'uploads_path': uploads_path,
            'permission_ok': permission_ok,
            'files': files,
            'app_instance_path': current_app.instance_path,
            'app_root_path': current_app.root_path,
            'app_static_folder': current_app.static_folder,
            'app_static_url_path': current_app.static_url_path
        }
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_blueprint.route("/test-static-file/<path:filename>", methods=["GET"])
def test_static_file(filename):
    """
    Test if a static file exists and is accessible.
    """
    try:
        # Get the static folder path
        static_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static')
        file_path = os.path.join(static_path, filename)
        
        if os.path.exists(file_path):
            # Return file metadata
            file_stats = os.stat(file_path)
            file_size = file_stats.st_size
            
            return jsonify({
                "exists": True,
                "file_path": file_path,
                "size": file_size,
                "url": f"/static/{filename}",
                "is_readable": os.access(file_path, os.R_OK)
            }), 200
        else:
            return jsonify({
                "exists": False,
                "file_path": file_path
            }), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

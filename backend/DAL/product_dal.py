from config import get_db_connection
import pandas as pd
import json
import mysql.connector

# New imports for product schema handling
from collections import OrderedDict

def dal_get_all_products():
    db = get_db_connection()
    if not db:
        return {"error": "Database connection failed"}, 500
        
    cursor = db.cursor(dictionary=True)
    try:
        query = """
        SELECT 
            p.product_id,
            p.title,
            p.price,
            p.stock,
            p.rating,
            p.description,
            p.image,
            p.created_at,
            p.updated_at,
            c.category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.product_id DESC
        """
        cursor.execute(query)
        products = cursor.fetchall()
        return products, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        db.close()

def dal_get_filters():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Lấy category_id cho Laptop
        cursor.execute("SELECT category_id FROM categories WHERE category_name = 'Laptop'")
        cat = cursor.fetchone()
        laptop_cat_id = cat['category_id'] if cat else 4  # fallback 4

        # Always use product_attributes table to get filters
        print("Getting filter data from product_attributes table")
        
        # Lọc theo category_id
        cursor.execute("""
            SELECT DISTINCT attribute_value FROM product_attributes 
            WHERE attribute_name = 'screen_size' AND category_id = %s
        """, (laptop_cat_id,))
        screen_sizes = [row["attribute_value"] for row in cursor.fetchall()]
        
        cursor.execute("""
            SELECT DISTINCT attribute_value FROM product_attributes 
            WHERE attribute_name = 'ram' AND category_id = %s
        """, (laptop_cat_id,))
        ram_sizes = [row["attribute_value"] for row in cursor.fetchall()]
        
        cursor.execute("""
            SELECT DISTINCT attribute_value FROM product_attributes 
            WHERE attribute_name = 'brand' AND category_id = %s
        """, (laptop_cat_id,))
        brands = [row["attribute_value"] for row in cursor.fetchall()]
        
        cursor.execute("""
            SELECT DISTINCT attribute_value FROM product_attributes 
            WHERE attribute_name = 'operating_system' AND category_id = %s
        """, (laptop_cat_id,))
        operating_systems = [row["attribute_value"] for row in cursor.fetchall()]

        filters = {
            "Display Size": screen_sizes if 'screen_sizes' in locals() else [],
            "RAM Size": ram_sizes if 'ram_sizes' in locals() else [],
            "Brands": brands if 'brands' in locals() else [],
            "Operating System": operating_systems if 'operating_systems' in locals() else [],
        }
        return filters
    finally:
        cursor.close()
        db.close()

def dal_get_product_images(product_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT image FROM products WHERE product_id = %s", (product_id,))
        images = cursor.fetchone()
        if images and images["image"]:
            image_urls = images["image"].split("; ")
        else:
            image_urls = []
        return image_urls
    finally:
        cursor.close()
        db.close()

def dal_get_laptops():
    print("Fetching laptops from database...")
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        # First get the category ID for 'Laptop'
        cursor.execute("SELECT category_id FROM categories WHERE category_name = 'Laptop'")
        category_result = cursor.fetchone()
        laptop_category_id = category_result['category_id'] if category_result else None
        
        print(f"Found laptop category_id: {laptop_category_id}")
        
        if not laptop_category_id:
            print("Warning: Laptop category not found, using fallback category ID")
            laptop_category_id = 4  # Fallback to the hardcoded ID if not found        # Check table names - MySQL is case-sensitive for table names
        cursor.execute("""
            SELECT 
                p.product_id,
                p.title,
                p.price,
                p.image,
                p.rating,
                p.description,
                pa.attribute_name,
                pa.attribute_value
            FROM products p
            LEFT JOIN product_attributes pa ON p.product_id = pa.product_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE c.category_name = 'Laptop' OR p.category_id = %s
            ORDER BY p.product_id DESC
        """, (laptop_category_id,))
        rows = cursor.fetchall()
        
        products = {}
        for row in rows:
            product_id = row['product_id']
            if product_id not in products:
                products[product_id] = {
                    'id': product_id,
                    'title': row['title'],
                    'price': row['price'],
                    'image': row['image'],
                    'rating': row['rating'],
                    'description': row['description'] or '', # Added description field
                    'brand': '', # Initialize common attributes with default values
                    'screen_size': '',
                    'ram': '',
                    'processor_type': '',
                    'storage_type': '',
                    'storage_capacity': '',
                }

            attr_name = row['attribute_name']
            attr_value = row['attribute_value']
            if attr_name:
                # Map attribute names to the expected frontend property names
                attr_mapping = {
                    'brand': 'brand',
                    'screen_size': 'screen_size',
                    'ram': 'ram',
                    'processor_type': 'processor_type',
                    'cpu_manufacturer': 'cpuManufacturer',
                    'operating_system': 'operatingSystem',
                    'graphics_coprocessor': 'graphicsCoprocessor',
                    'storage_type': 'storage_type',
                    'storage_capacity': 'storage_capacity',
                    'weight': 'weight'                }
                field_name = attr_mapping.get(attr_name.lower(), attr_name)
                products[product_id][field_name] = attr_value

        result = list(products.values())
        print(f"Returning {len(result)} laptops")
        # Print a sample of the first laptop for debugging
        if result:
            print(f"Sample laptop: {result[0]['title']} with attributes:")
            for key, value in result[0].items():
                if key not in ['id', 'title', 'price', 'image', 'rating', 'description']:
                    print(f"  {key}: {value}")
                    
        return result
    finally:
        cursor.close()
        connection.close()

def dal_get_product_by_id(product_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        # Get basic product info
        cursor.execute("""
            SELECT 
                p.product_id,
                p.title,
                p.price,
                p.stock,
                p.rating,
                p.description,
                p.image,
                p.category_id
            FROM Products p
            WHERE p.product_id = %s
        """, (product_id,))
        
        product = cursor.fetchone()
        
        if not product:
            return None, 404
        
        # Get product attributes
        cursor.execute("""
            SELECT 
                attribute_name,
                attribute_value
            FROM Product_Attributes
            WHERE product_id = %s
        """, (product_id,))
        
        attributes = cursor.fetchall()
        
        # Convert attributes to dictionary
        attributes_dict = {}
        for attr in attributes:
            attributes_dict[attr['attribute_name']] = attr['attribute_value']
        
        # Add attributes to product
        product['attributes'] = attributes_dict
        
        return product, 200
    except Exception as e:
        print(f"Error fetching product: {str(e)}")
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        connection.close()

def dal_get_components_by_type(type):
    valid_types = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case']
    if type not in valid_types:
        return {"error": "Invalid component type"}, 400

    db = get_db_connection()
    if not db:
        return {'error': 'Database connection failed'}, 500

    cursor = db.cursor(dictionary=True)
    cursor.execute("SET SESSION group_concat_max_len = 100000;")
    try:
        query = """
        SELECT 
            p.product_id,
            p.title,
            p.price,
            p.stock,
            p.rating,
            p.description,
            p.image,
            p.created_at,
            p.updated_at,
            c.category_name,
            GROUP_CONCAT(pa.attribute_name, ':', pa.attribute_value) as attributes
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_attributes pa ON p.product_id = pa.product_id
        WHERE c.category_name = %s
        GROUP BY p.product_id
        """
        cursor.execute(query, (type,))
        components = cursor.fetchall()
        if not components:
            return {"message": "No components found for this type"}, 404
        return components, 200
    except mysql.connector.Error as err:
        return {"error": str(err)}, 500
    finally:
        cursor.close()
        db.close()
       
        
def dal_get_component_by_id(product_id):
    db = get_db_connection()
    if not db:
        return {'error': 'Database connection failed'}, 500

    cursor = db.cursor(dictionary=True)
    try:
        # Get product basic information
        product_query = """
        SELECT 
            p.product_id,
            p.title,
            p.price,
            p.stock,
            p.rating,
            p.description,
            p.image,
            p.created_at,
            p.updated_at,
            c.category_name,
            c.category_id
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id = %s
        """
        cursor.execute(product_query, (product_id,))
        product = cursor.fetchone()
        
        if not product:
            return {"error": "Component not found"}, 404
            
        # Get attributes as formatted JSON string
        attributes_query = """
        SELECT 
            CONCAT('{', GROUP_CONCAT(CONCAT('"', attribute_name, '":"', attribute_value, '"')), '}') AS attributes
        FROM 
            product_attributes
        WHERE 
            product_id = %s
        """
        cursor.execute(attributes_query, (product_id,))
        attributes_result = cursor.fetchone()
        
        # Parse attributes JSON string if available
        attributes = {}
        if attributes_result and attributes_result['attributes']:
            try:
                import json
                attributes = json.loads(attributes_result['attributes'])
            except json.JSONDecodeError as e:
                print(f"Error parsing attributes JSON: {e}")
        
        # Combine product info with attributes
        result = {**product, 'attributes': attributes}
        return result, 200
        
    except mysql.connector.Error as err:
        return {"error": str(err)}, 500
    finally:
        cursor.close()
        db.close()
        
def get_products(limit=None):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        query = """
            SELECT 
                product_id as id,
                title,
                price,
                image,
                rating
            FROM Products
        """
        
        if limit:
            query += " LIMIT %s"
            cursor.execute(query, (limit,))
        else:
            cursor.execute(query)
            
        products = cursor.fetchall()
        return products
    except Exception as e:
        print(f"Error fetching products: {str(e)}")
        return []
    finally:
        cursor.close()
        connection.close()

def get_product_by_id(product_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT 
                product_id as id,
                title,
                price,
                stock,
                rating,
                description,
                image,
                created_at,
                updated_at,
                category_id
            FROM Products
            WHERE product_id = %s
        """, (product_id,))
        product = cursor.fetchone()
        return product
    except Exception as e:
        print(f"Error fetching product: {str(e)}")
        return None
    finally:
        cursor.close()
        connection.close()



def dal_get_products_by_ids(product_ids):
    """
    Get detailed information for a list of product IDs.

    Args:
        product_ids (list): List of product IDs to retrieve.

    Returns:
        tuple: (products_data, status_code)
            products_data: List of product details with attributes or error message.
            status_code: HTTP status code.
    """
    if not product_ids:
        return {"error": "No product IDs provided"}, 400

    db = get_db_connection()
    if not db:
        return {"error": "Database connection failed"}, 500

    cursor = db.cursor(dictionary=True)
    try:
        # Convert list of product_ids to a comma-separated string for SQL IN clause
        product_ids_placeholder = ', '.join(['%s'] * len(product_ids))

        # Query to get product details
        product_query = f"""
        SELECT 
            p.product_id,
            p.title,
            p.price,
            p.stock,
            p.rating,
            p.description,
            p.image,
            p.created_at,
            p.updated_at,
            c.category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id IN ({product_ids_placeholder})
        """
        cursor.execute(product_query, product_ids)
        products = cursor.fetchall()

        if not products:
            return {"error": "No products found for the given IDs"}, 404

        # Query to get attributes for the given product IDs
        attributes_query = f"""
        SELECT 
            product_id,
            attribute_name,
            attribute_value
        FROM product_attributes
        WHERE product_id IN ({product_ids_placeholder})
        """
        cursor.execute(attributes_query, product_ids)
        attributes = cursor.fetchall()

        # Organize attributes by product_id
        attributes_by_product = {}
        for attr in attributes:
            product_id = attr['product_id']
            if product_id not in attributes_by_product:
                attributes_by_product[product_id] = {}
            attributes_by_product[product_id][attr['attribute_name']] = attr['attribute_value']

        # Combine product details with attributes
        detailed_products = []
        for product in products:
            product_id = product['product_id']
            product['attributes'] = attributes_by_product.get(product_id, {})
            detailed_products.append(product)

        return detailed_products, 200

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        cursor.close()
        db.close()

def dal_CPU_Cooler_vs_CPU(cpu_socket):
    """
    Get product IDs of CPU Coolers compatible with a specific CPU socket.
    
    Args:
        cpu_socket (str): The CPU socket to match (e.g., 'AM5', 'LGA1700')
    
    Returns:
        tuple: (product_ids, status_code)
            product_ids: List of product IDs or error message
            status_code: HTTP status code
    """
    db = get_db_connection()
    if not db:
        return {'error': 'Database connection failed'}, 500

    try:
        # Viết câu truy vấn SQL chỉ lấy product_id
        query = """
        SELECT DISTINCT pa.product_id
        FROM product_attributes pa
        JOIN products p ON pa.product_id = p.product_id
        WHERE p.category_id = 11
          AND pa.attribute_name = 'CPU Socket'
          AND pa.attribute_value LIKE %s
        """

        # Sử dụng pandas để đọc dữ liệu từ cơ sở dữ liệu
        df = pd.read_sql_query(query, db, params=(f"%{cpu_socket}%",))

        # Trả về danh sách product_id
        product_ids = df['product_id'].tolist()

        return dal_get_products_by_ids(product_ids)


    except Exception as e:
        return {'error': str(e)}, 500

    finally:
        db.close()

def dal_Mainboard_vs_CPU(cpu_socket):
    """
    Get product IDs of Mainboards compatible with a specific CPU socket.
    
    Args:
        cpu_socket (str): The CPU socket to match (e.g., 'AM5', 'LGA1700')
    
    Returns:
        tuple: (products, status_code)
            products: List of compatible motherboards with details or error message
            status_code: HTTP status code
    """
    db = get_db_connection()
    if not db:
        return {'error': 'Database connection failed'}, 500

    try:
        # Query to find mainboards compatible with the given CPU socket
        query = """
        SELECT DISTINCT pa.product_id
        FROM product_attributes pa
        JOIN products p ON pa.product_id = p.product_id
        WHERE p.category_id = 14  # Assuming 7 is the category_id for motherboards
          AND pa.attribute_name = 'Socket/CPU'
          AND pa.attribute_value LIKE %s
        """

        # Use pandas to read data from database
        df = pd.read_sql_query(query, db, params=(f"%{cpu_socket}%",))

        # Get product IDs list
        product_ids = df['product_id'].tolist()

        # Return detailed product information using existing function
        return dal_get_products_by_ids(product_ids)

    except Exception as e:
        return {'error': str(e)}, 500

    finally:
        db.close()
def dal_get_components_by_attributes(type, attributes=None):
    """
    Get components by type and optionally filter by specific attributes.
    Special handling for CPU Socket to include similar values.
    """
    print(f"Starting dal_get_components_by_attributes with type: {type}")
    
    # First check if the category exists in the database
    db = get_db_connection()
    if not db:
        return {'error': 'Database connection failed'}, 500
    
    cursor = db.cursor(dictionary=True)
    try:
        # Check if this category actually exists in the database
        cursor.execute("""
            SELECT category_id, category_name 
            FROM categories 
            WHERE LOWER(category_name) = LOWER(%s)
        """, (type,))
        
        category = cursor.fetchone()
        
        if category:
            # Use the exact category name from the database
            type = category['category_name']
            print(f"Found matching category in database: {type}")
        else:
            # If not found in database, use the standard list for fallback
            valid_types = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case']
            
            # Case-insensitive type matching
            type_match = None
            for valid_type in valid_types:
                if valid_type.lower() == type.lower():
                    type_match = valid_type
                    break
            
            # If no matching type found, return error
            if not type_match:
                print(f"Invalid component type: {type} - not found in database or standard types")
                return {"error": f"Product type '{type}' not found"}, 404
            
            # Use the case-correct version
            type = type_match
            print(f"Using standardized type: {type}")
    finally:
        cursor.close()
    
    print(f"Getting components of type: {type} with attributes: {attributes}")
    
    # Re-use the same database connection
    if not db.is_connected():
        db = get_db_connection()
        if not db:
            return {'error': 'Database connection failed'}, 500

    cursor = db.cursor(dictionary=True)
    try:
        params = [type]
        joins = ""
        conditions = ""
        
        if attributes:
            for idx, (attr_name, attr_value) in enumerate(attributes.items()):
                alias = f"pa{idx}"
                joins += f" JOIN product_attributes {alias} ON p.product_id = {alias}.product_id"
                if attr_name == "CPU Socket":
                    # Add logic to handle multiple CPU socket values
                    conditions += f" AND {alias}.attribute_name = %s AND {alias}.attribute_value IN ('AM4', 'AM5', 'LGA1150', 'LGA1151', 'LGA1155', 'LGA1156', 'LGA1200', 'LGA1700')"
                    params.append(attr_name)
                else:
                    conditions += f" AND {alias}.attribute_name = %s AND {alias}.attribute_value = %s"
                    params.append(attr_name)
                    params.append(attr_value)

        query = f"""
        SELECT 
            p.product_id,
            p.title,
            p.price,
            p.stock,
            p.rating,
            p.description,
            p.image,
            p.created_at,
            p.updated_at,
            c.category_name,
            IFNULL(pa_group.attributes, '') AS attributes
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN (
            SELECT 
                product_id,
                GROUP_CONCAT(CONCAT(attribute_name, ':', attribute_value) SEPARATOR '; ') AS attributes
            FROM 
                product_attributes
            GROUP BY 
                product_id
        ) pa_group ON p.product_id = pa_group.product_id
        {joins}
        WHERE c.category_name = %s
        {conditions}
        GROUP BY p.product_id
        """

        try:
            print(f"Executing query: {query} with params: {params}")
            cursor.execute(query, params)
            components = cursor.fetchall()
        except Exception as query_error:
            print(f"Error executing query: {query_error}")
            # Try a simpler fallback query without joins
            fallback_query = """
            SELECT 
                p.product_id,
                p.title,
                p.price,
                p.stock,
                p.rating,
                p.description,
                p.image,
                p.created_at,
                p.updated_at,
                c.category_name
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            WHERE LOWER(c.category_name) = LOWER(%s)
            """
            print(f"Trying fallback query: {fallback_query}")
            cursor.execute(fallback_query, [type])
            components = cursor.fetchall()
            # Add empty attributes field to match expected structure
            for comp in components:
                comp['attributes'] = ""

        # Parse attributes string into dict
        for component in components:
            attrs = {}
            if component.get('attributes'):
                for pair in component['attributes'].split('; '):
                    if ':' in pair:
                        key, value = pair.split(':', 1)
                        attrs[key.strip()] = value.strip()
            component['attributes'] = attrs

        if not components:
            return {"message": f"No components found for {type} with the specified attributes"}, 404
        
        return components, 200
    except mysql.connector.Error as err:
        return {"error": str(err)}, 500
    finally:
        cursor.close()
        db.close()


def get_products_from_db_by_query(query=None):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    sql = """
        SELECT p.product_id, p.title AS product_name, c.category_name AS type, p.price
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.product_id ASC
    """
    if query:
        sql += " WHERE p.title LIKE %s"
        cursor.execute(sql, (f"%{query}%",))
    else:
        cursor.execute(sql)
    products = cursor.fetchall()
    for product in products:
        if "type" in product and isinstance(product["type"], str):
            product["type"] = product["type"].lower()
    cursor.close()
    connection.close()
    return products

def dal_delete_product(product_id):
    """
    Delete a product from the database.
    
    Args:
        product_id (int): The ID of the product to delete.
        
    Returns:
        tuple: (result, status_code)
            result: Dict with success or error message
            status_code: HTTP status code
    """
    db = get_db_connection()
    if not db:
        return {"error": "Database connection failed"}, 500
    
    cursor = db.cursor()
    try:
        # First delete related data from product_attributes table
        cursor.execute("DELETE FROM product_attributes WHERE product_id = %s", (product_id,))
        
        # Then delete the product from products table
        cursor.execute("DELETE FROM products WHERE product_id = %s", (product_id,))
        
        if cursor.rowcount > 0:
            db.commit()
            return {"message": f"Product with ID {product_id} successfully deleted"}, 200
        else:
            db.rollback()
            return {"error": f"No product found with ID {product_id}"}, 404
            
    except mysql.connector.Error as err:
        db.rollback()
        return {"error": str(err)}, 500
    finally:
        cursor.close()
        db.close()

def dal_get_products_by_category(category_id):
    db = get_db_connection()
    if not db:
        return {"error": "Database connection failed"}, 500
        
    cursor = db.cursor(dictionary=True)
    try:
        query = """
        SELECT 
            p.product_id,
            p.title,
            p.price,
            p.stock,
            p.rating,
            p.image
        FROM products p
        WHERE p.category_id = %s
        LIMIT 12
        """
        
        cursor.execute(query, (category_id,))
        products = cursor.fetchall()
        
        if not products:
            return {"message": f"No products found for category ID {category_id}"}, 404
            
        return products, 200
        
    except Exception as e:
        return {"error": str(e)}, 500
        
    finally:
        cursor.close()
        db.close()

def dal_get_products_from_different_categories(limit=4):
    db = get_db_connection()
    if not db:
        return {"error": "Database connection failed"}, 500
        
    cursor = db.cursor(dictionary=True)
    try:
        query = """
        SELECT p.product_id, p.title, p.price, p.image, p.rating, c.category_id, c.category_name
        FROM (
            SELECT DISTINCT category_id 
            FROM products 
            ORDER BY category_id DESC
            LIMIT %s
        ) as distinct_categories
        JOIN categories c ON distinct_categories.category_id = c.category_id
        JOIN products p ON c.category_id = p.category_id
        GROUP BY c.category_id
        LIMIT %s
        """
        
        cursor.execute(query, (limit, limit))
        products = cursor.fetchall()
        
        if not products:
            return {"message": "No products found"}, 404
            
        return products, 200
        
    except Exception as e:
        return {"error": str(e)}, 500
        
    finally:
        cursor.close()
        db.close()

def dal_get_product_categories():
    """
    Get all product categories from the database.
    
    Returns:
        tuple: (categories, status_code)
            categories: List of category dictionaries with id, name
            status_code: HTTP status code
    """
    db = get_db_connection()
    if not db:
        return {"error": "Database connection failed"}, 500
    
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT category_id, category_name 
            FROM categories
            ORDER BY category_name
        """)
        
        categories = cursor.fetchall()
        
        if not categories:
            return {"message": "No categories found"}, 404
            
        return categories, 200
        
    except Exception as e:
        return {"error": str(e)}, 500
        
    finally:
        cursor.close()
        db.close()

def dal_get_product_schema(category_name):
    """
    Get the schema (required fields) for a specific product type.
    
    Args:
        category_name (str): The name of the product category
        
    Returns:
        tuple: (schema, status_code)
            schema: Dict with field definitions
            status_code: HTTP status code
    """
    from config import DATABASE_CONFIG
    db = get_db_connection()
    if not db:
        return {"error": "Database connection failed"}, 500
    
    cursor = db.cursor()
    try:
        # First check if the category exists
        cursor.execute("""
            SELECT category_id, category_name 
            FROM categories 
            WHERE category_name = %s
        """, (category_name,))
        
        category = cursor.fetchone()
        if not category:
            return {"error": f"Category '{category_name}' not found"}, 404
        
        # Get products table structure for common fields
        cursor.execute("DESCRIBE products")
        products_structure = cursor.fetchall()
        
        # Initialize schema with common fields
        schema = {
            "common_fields": _format_field_info(products_structure),
            "specific_fields": {}
        }        # Get specific fields from product_attributes table
        # We'll use existing attribute names from product_attributes
        try:
            print(f"Using product_attributes table to define schema for {category_name}")
            # Use product_attributes to define fields
            # We'll use existing attribute names as a guide
            cursor.execute("""
                SELECT DISTINCT attribute_name
                FROM product_attributes
                JOIN products ON product_attributes.product_id = products.product_id
                JOIN categories ON products.category_id = categories.category_id
                WHERE categories.category_name = %s
            """, (category_name,))
            
            attributes = cursor.fetchall()
            
            # Create a basic schema for each attribute
            for attr in attributes:
                attr_name = attr[0]
                schema["specific_fields"][attr_name] = {
                    "type": "text",
                    "required": False,
                    "default": ""
                }
        except Exception as e:
            print(f"Error getting specific fields: {e}")
            # If there's an error, we'll still return the common fields
            pass
            
        return schema, 200
        
    except Exception as e:
        print(f"Error in dal_get_product_schema: {e}")
        return {"error": str(e)}, 500
        
    finally:
        cursor.close()
        db.close()

def _format_field_info(fields):
    """Helper to format database field information into a usable schema"""
    formatted_fields = OrderedDict()
    
    for field in fields:
        field_name = field[0]  # Field name is first element
        field_type = field[1]  # Type is second element
        nullable = field[2] == 'YES'  # YES if nullable
        default = field[4]  # Default value
        
        # Skip primary key, auto-increment or system fields
        if field_name in ['product_id', 'created_at', 'updated_at']:
            continue
        
        # Determine input type based on field type
        input_type = 'text'  # Default type
        if 'int' in field_type.lower():
            input_type = 'number'
        elif 'decimal' in field_type.lower() or 'float' in field_type.lower():
            input_type = 'number'
        elif 'date' in field_type.lower():
            input_type = 'date'
        elif 'text' in field_type.lower():
            input_type = 'textarea'
            
        formatted_fields[field_name] = {
            "type": input_type,
            "required": not nullable,
            "default": default
        }
    
    return formatted_fields

def dal_add_product(product_data):
    """
    Add a new product to the database.
    
    Args:
        product_data (dict): The product data including category, common fields and specific fields
        
    Returns:
        tuple: (result, status_code)
            result: Dict with success message and product_id or error
            status_code: HTTP status code
    """
    import json # Ensure json module is available
    db = get_db_connection()
    if not db:
        return {"error": "Database connection failed"}, 500
    
    cursor = db.cursor()
    try:
        category_name = product_data.get('category_name')
        if not category_name:
            return {"error": "Category name is required"}, 400
            
        # Get the category ID
        cursor.execute("SELECT category_id FROM categories WHERE category_name = %s", (category_name,))
        category_result = cursor.fetchone()
        if not category_result:
            return {"error": f"Category '{category_name}' not found"}, 404
        
        category_id = category_result[0]
        
        # Extract common fields for products table
        common_fields = product_data.get('common_fields', {})
        common_fields['category_id'] = category_id
        
        # Parse specific_fields if it's a string (JSON)
        specific_fields = product_data.get('specific_fields', {})
        if isinstance(specific_fields, str):
            try:
                specific_fields = json.loads(specific_fields)
            except Exception:
                specific_fields = {}

        # Parse attributes if it's a string (JSON)
        attributes = product_data.get('attributes', {})
        if isinstance(attributes, str):
            try:
                attributes = json.loads(attributes)
            except Exception:
                attributes = {}

        # Define columns and values for products table
        product_columns = ', '.join(common_fields.keys())
        product_placeholders = ', '.join(['%s'] * len(common_fields))
        product_values = list(common_fields.values())        # Fix image URLs if needed
        if 'image' in common_fields and common_fields['image']:
            # Debug URL value
            print(f"Original image URLs: {common_fields['image']}")
            # No need to modify URLs - they should already be in the correct format (/static/uploads/...)
            # This ensures consistency between the URLs stored and those used in the application
            
        # Insert into products table
        insert_product_query = f"INSERT INTO products ({product_columns}) VALUES ({product_placeholders})"
        cursor.execute(insert_product_query, product_values)
        product_id = cursor.lastrowid        # Extract specific fields for category-specific table
        specific_fields = product_data.get('specific_fields', {})
        if specific_fields:
            # We'll always store specific fields in the product_attributes table
            # This is more flexible than having separate tables for each category
            for field_name, field_value in specific_fields.items():
                if field_name != 'product_id' and field_value:  # Skip product_id and empty values
                    cursor.execute(
                        "INSERT INTO product_attributes (product_id, category_id, attribute_name, attribute_value) VALUES (%s, %s, %s, %s)",
                        (product_id, category_id, field_name, field_value)
                    )
            
        # Insert any product attributes
        attributes = product_data.get('attributes', {})
        if attributes:
            for attr_name, attr_value in attributes.items():
                if attr_value:  # Skip empty values
                    cursor.execute(
                        "INSERT INTO product_attributes (product_id, category_id, attribute_name, attribute_value) VALUES (%s, %s, %s, %s)",
                        (product_id, category_id, attr_name, attr_value)
                    )
        
        db.commit()
        return {"message": "Product added successfully", "product_id": product_id}, 201
        
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
        
    finally:
        cursor.close()
        db.close()



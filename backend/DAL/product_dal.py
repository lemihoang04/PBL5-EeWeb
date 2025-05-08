from config import get_db_connection
import pandas as pd
import json
import mysql.connector

def dal_get_all_products():
    db = get_db_connection()
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
        """
        df = pd.read_sql_query(query, db)
        return df.to_dict(orient="records"), 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

def dal_get_filters():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT DISTINCT screen_size FROM laptop ")
        screen_sizes = [row["screen_size"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT ram FROM laptop")
        ram_sizes = [row["ram"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT brand FROM laptop")
        brands = [row["brand"] for row in cursor.fetchall()]

        cursor.execute("SELECT DISTINCT operating_system FROM laptop")
        operating_systems = [row["operating_system"] for row in cursor.fetchall()]

        filters = {
            "Display Size": screen_sizes,
            "RAM Size": ram_sizes,
            "Brands": brands,
            "Operating System": operating_systems,
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
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT 
                p.product_id,
                p.title,
                p.price,
                p.image,
                p.rating,
                pa.attribute_name,
                pa.attribute_value
            FROM Products p
            LEFT JOIN Product_Attributes pa ON p.product_id = pa.product_id
            WHERE p.category_id = 4
        """)
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
                }

            attr_name = row['attribute_name']
            attr_value = row['attribute_value']
            if attr_name:
                products[product_id][attr_name] = attr_value  

        return list(products.values())
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
    valid_types = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case']
    if type not in valid_types:
        return {"error": "Invalid component type"}, 400
    
    print(f"Getting components of type: {type} with attributes: {attributes}")

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
                    # Thêm logic để lấy các giá trị tương tự
                    conditions += f" AND {alias}.attribute_name = %s AND {alias}.attribute_value IN ('AM4', 'AM5', 'LGA1150', 'LGA1151', 'LGA1155', 'LGA1156', 'LGA1200', 'LGA1700')"
                    params.append(attr_name)
                else:
                    conditions += f" AND {alias}.attribute_name = %s AND {alias}.attribute_value = %s"
                    params.extend([attr_name, attr_value])

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

        cursor.execute(query, params)
        components = cursor.fetchall()

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



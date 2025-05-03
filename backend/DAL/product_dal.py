from config import get_db_connection
import pandas as pd
import json
import mysql.connector

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

<<<<<<< HEAD
def dal_get_all_products():
=======
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

# def dal_get_components_by_attributes(type, attributes=None):
#     """
#     Get components by type and optionally filter by specific attributes.
    
#     Args:
#         type (str): The category name of the component (e.g., 'CPU', 'RAM')
#         attributes (dict, optional): Dictionary of attributes to filter by, where
#                                      keys are attribute names and values are attribute values.
#                                      Example: {'brand': 'AMD', 'Core Count': '6'}
    
#     Returns:
#         tuple: (components_data, status_code)
#             components_data: List of components or error message
#             status_code: HTTP status code
#     """
#     valid_types = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case']
#     if type not in valid_types:
#         return {"error": "Invalid component type"}, 400
    
#     print(f"Getting components of type: {type} with attributes: {attributes}")

#     db = get_db_connection()
#     if not db:
#         return {'error': 'Database connection failed'}, 500

#     cursor = db.cursor(dictionary=True)
#     try:
#         params = [type]
#         joins = ""
#         conditions = ""

#         if attributes:
#             for idx, (attr_name, attr_value) in enumerate(attributes.items()):
#                 alias = f"pa{idx}"
#                 joins += f" JOIN product_attributes {alias} ON p.product_id = {alias}.product_id"
#                 conditions += f" AND {alias}.attribute_name = %s AND {alias}.attribute_value = %s"
#                 params.extend([attr_name, attr_value])

#         query = f"""
#         SELECT 
#             p.product_id,
#             p.title,
#             p.price,
#             p.stock,
#             p.rating,
#             p.description,
#             p.image,
#             p.created_at,
#             p.updated_at,
#             c.category_name,
#             IFNULL(pa_group.attributes, '') AS attributes
#         FROM products p
#         JOIN categories c ON p.category_id = c.category_id
#         LEFT JOIN (
#             SELECT 
#                 product_id,
#                 GROUP_CONCAT(CONCAT(attribute_name, ':', attribute_value) SEPARATOR '; ') AS attributes
#             FROM 
#                 product_attributes
#             GROUP BY 
#                 product_id
#         ) pa_group ON p.product_id = pa_group.product_id
#         {joins}
#         WHERE c.category_name = %s
#         {conditions}
#         GROUP BY p.product_id
#         """

#         cursor.execute(query, params)
#         components = cursor.fetchall()

#         # Parse attributes string into dict
#         for component in components:
#             attrs = {}
#             if component.get('attributes'):
#                 for pair in component['attributes'].split('; '):
#                     if ':' in pair:
#                         key, value = pair.split(':', 1)
#                         attrs[key.strip()] = value.strip()
#             component['attributes'] = attrs

#         if not components:
#             return {"message": f"No components found for {type} with the specified attributes"}, 404
        
#         return components, 200
#     except mysql.connector.Error as err:
#         return {"error": str(err)}, 500
#     finally:
#         cursor.close()
#         db.close()



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



def dal_get_components_by_attributes(type, attributes=None):
    """
    Get components by type and optionally filter by specific attributes.
    Special handling for CPU Socket to include similar values.
    """
    valid_types = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case']
    if type not in valid_types:
        return {"error": "Invalid component type"}, 400
    
    print(f"Getting components of type: {type} with attributes: {attributes}")

>>>>>>> 0fc7324a961e590c11b1f487e1afd6a462b1ce34
    db = get_db_connection()
    if not db:
        return {'error': 'Database connection failed'}, 500

    cursor = db.cursor(dictionary=True)
    try:
<<<<<<< HEAD
        query = """
=======
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
>>>>>>> 0fc7324a961e590c11b1f487e1afd6a462b1ce34
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
<<<<<<< HEAD
            c.category_id
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        """
        cursor.execute(query)
        products = cursor.fetchall()
        return products
=======
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
>>>>>>> 0fc7324a961e590c11b1f487e1afd6a462b1ce34
    except mysql.connector.Error as err:
        return {"error": str(err)}, 500
    finally:
        cursor.close()
<<<<<<< HEAD
        db.close()
=======
        db.close()
def get_products_from_db_by_query(query=None):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    sql = """
        SELECT p.product_id, p.title AS product_name, c.category_name AS type, p.price, p.rating 
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
    """
    if query:
        sql += " WHERE p.title LIKE %s"
        cursor.execute(sql, (f"%{query}%",))
    else:
        cursor.execute(sql)
    products = cursor.fetchall()
    cursor.close()
    connection.close()
    return products
>>>>>>> 0fc7324a961e590c11b1f487e1afd6a462b1ce34

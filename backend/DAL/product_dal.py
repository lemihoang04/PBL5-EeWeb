from config import get_db_connection
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

def get_products_from_db_by_query(query=None):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    sql = """
        SELECT p.product_id, c.category_name, p.title, p.price, p.rating 
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
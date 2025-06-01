# Temporary patch for product_dal.py - copy all content from the original file except for the dal_get_components_by_attributes function

# Replacement function for dal_get_components_by_attributes
def dal_get_components_by_attributes(type, attributes=None):
    """
    Get components by type and optionally filter by specific attributes.
    Special handling for CPU Socket to include similar values.
    """
    print(f"Starting dal_get_components_by_attributes with type: {type}")
    
    # Standard type mapping
    valid_types = ['Storage', 'PSU', 'Mainboard', 'GPU', 'CPU', 'RAM', 'CPU Cooler', 'Case']
    
    # Check if type is valid (case-insensitive)
    type_match = None
    for valid_type in valid_types:
        if valid_type.lower() == type.lower():
            type_match = valid_type
            break
            
    # Use the standardized type if found
    if type_match:
        type = type_match
    
    from config import get_db_connection
    db = get_db_connection()
    if not db:
        return {'error': 'Database connection failed'}, 500
        
    cursor = db.cursor(dictionary=True)
    
    try:
        # First check if products with this category exist
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            WHERE LOWER(c.category_name) = LOWER(%s)
        """, (type,))
        
        result = cursor.fetchone()
        if not result or result['count'] == 0:
            return {"message": f"No products found for category '{type}'"}, 404
        
        # Build the query
        base_query = """
        SELECT 
            p.product_id,
            p.title,
            p.price,
            p.stock,
            p.rating,
            p.description,
            p.image,
            c.category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE LOWER(c.category_name) = LOWER(%s)
        """
        
        params = [type]
        
        # Add attribute filtering if specified
        if attributes and isinstance(attributes, dict) and len(attributes) > 0:
            joins = []
            conditions = []
            
            # Build joins and conditions for each attribute
            for idx, (attr_name, attr_value) in enumerate(attributes.items()):
                alias = f"pa{idx}"
                joins.append(f"JOIN product_attributes {alias} ON p.product_id = {alias}.product_id")
                
                if attr_name == "CPU Socket":
                    # Special handling for CPU Socket
                    conditions.append(f"{alias}.attribute_name = %s AND {alias}.attribute_value LIKE %s")
                    params.extend([attr_name, f"%{attr_value}%"])
                else:
                    # Standard attribute matching
                    conditions.append(f"{alias}.attribute_name = %s AND {alias}.attribute_value = %s")
                    params.extend([attr_name, attr_value])
            
            # Add all joins and conditions to base query
            if joins:
                base_query += " " + " ".join(joins)
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
        
        # Execute query
        print(f"Executing query with params: {params}")
        cursor.execute(base_query, params)
        components = cursor.fetchall()
        
        # Now fetch attributes for each component
        for component in components:
            cursor.execute("""
                SELECT attribute_name, attribute_value
                FROM product_attributes
                WHERE product_id = %s
            """, (component['product_id'],))
            
            attributes = cursor.fetchall()
            attr_dict = {}
            for attr in attributes:
                attr_dict[attr['attribute_name']] = attr['attribute_value']
            
            component['attributes'] = attr_dict
        
        return components, 200
        
    except Exception as e:
        import traceback
        print(f"Error in dal_get_components_by_attributes: {e}")
        # print(traceback.format_exc())
        return {"error": str(e)}, 500
        
    finally:
        cursor.close()
        db.close()

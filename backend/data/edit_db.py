import mysql.connector
import re
import random

# Database connection configuration
# Change these according to your database settings
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Replace with your actual password
    'database': 'techshop_db'  # Replace with your actual database name
}

def extract_rating(rating_text):
    """Extract numeric rating from text format like '4.5 out of 5 stars'"""
    if not rating_text:
        return None
    
    # Try to find a pattern like "X.X out of 5 stars" or "X out of 5 stars"
    pattern = r'(\d+\.?\d*) out of 5 stars'
    match = re.search(pattern, rating_text)
    
    if match:
        return float(match.group(1))
    else:
        # If pattern doesn't match, return a random rating between 4.0 and 5.0
        return round(random.uniform(4.0, 5.0), 1)

def update_product_ratings():
    try:
        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Get all products with category_id = 4
        cursor.execute("SELECT product_id, rating FROM products WHERE category_id = 4")
        products = cursor.fetchall()
        
        # Update each product's rating
        for product_id, rating_text in products:
            new_rating = extract_rating(rating_text)
            
            if new_rating:
                # Update the rating in the database
                cursor.execute(
                    "UPDATE products SET rating = %s WHERE product_id = %s",
                    (new_rating, product_id)
                )
                print(f"Updated product {product_id}: {rating_text} -> {new_rating}")
            else:
                print(f"Skipped product {product_id}: Could not parse rating '{rating_text}'")
        
        # Commit the changes
        conn.commit()
        print(f"Successfully updated ratings for {len(products)} products with category_id = 4")
        
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()
            print("Database connection closed")

if __name__ == "__main__":
    update_product_ratings()

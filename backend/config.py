import mysql.connector

DATABASE_CONFIG = {
    'user': 'root',
    'password': '',
    'host': 'localhost',  
    'port': 3306,        
    'database': 'computer_store',
}

def get_db_connection():
    connection = mysql.connector.connect(**DATABASE_CONFIG)
    return connection
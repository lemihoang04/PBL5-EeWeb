from config import get_db_connection

def log_chatbot_interaction(user_id, query, response):
    """Log chatbot interactions for future training and analysis"""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    sql = "INSERT INTO chatbot_logs (user_id, query, response, timestamp) VALUES (%s, %s, %s, NOW())"
    cursor.execute(sql, (user_id, query, response))
    connection.commit()
    
    cursor.close()
    connection.close()
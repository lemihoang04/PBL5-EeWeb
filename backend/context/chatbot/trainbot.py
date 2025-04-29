import re
import mysql.connector
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer, ListTrainer
import sys
import subprocess
import os

class ElectronicsStoreBot:
    def __init__(self, db_config):
        # Check if spacy model is installed
        try:
            # Initialize ChatBot with default settings
            self.chatbot = ChatBot(
                'ElectronicsStoreAssistant',
                storage_adapter='chatterbot.storage.SQLStorageAdapter',
                logic_adapters=[
                    'chatterbot.logic.BestMatch',
                    'chatterbot.logic.MathematicalEvaluation'
                ]
            )
        except Exception as e:
            # If spacy model is missing, install it or use a different tagger
            if "The Spacy model for \"English\" language is missing" in str(e):
                print("The required spaCy model is missing. Attempting to install it...")
                try:
                    # Try to install the model
                    subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
                    print("Installation successful!")
                    # Try initializing again
                    self.chatbot = ChatBot(
                        'ElectronicsStoreAssistant',
                        storage_adapter='chatterbot.storage.SQLStorageAdapter',
                        logic_adapters=[
                            'chatterbot.logic.BestMatch',
                            'chatterbot.logic.MathematicalEvaluation'
                        ]
                    )
                except Exception as install_error:
                    print(f"Couldn't automatically install the model: {install_error}")
                    print("Initializing ChatterBot with nltk tagger instead of spaCy...")
                    # Initialize with nltk tagger instead
                    self.chatbot = ChatBot(
                        'ElectronicsStoreAssistant',
                        tagger_language='en_core_web_sm',
                        storage_adapter='chatterbot.storage.SQLStorageAdapter',
                        tagger='chatterbot.taggers.PosLemmaTagger',
                        logic_adapters=[
                            'chatterbot.logic.BestMatch',
                            'chatterbot.logic.MathematicalEvaluation'
                        ]
                    )
            else:
                # For other errors, re-raise
                raise e
        
        # Database connection
        self.db_config = db_config
        self.db_connection = None
        self.last_recommendations = None  # Store last recommended products for selection

        # Xác định đường dẫn db.sqlite3 ở cùng thư mục với file trainbot.py
        db_path = os.path.join(os.path.dirname(__file__), "db.sqlite3")
        self.db_path = db_path
        # Chỉ train nếu database SQLite chưa tồn tại
        if not os.path.exists(db_path):
            self.train_chatbot()
        # Nếu đã tồn tại, không train lại
    
    def connect_to_database(self):
        """Connect to the MySQL database"""
        try:
            self.db_connection = mysql.connector.connect(**self.db_config)
            print("Database connection successful")
            return True
        except mysql.connector.Error as err:
            print(f"Database connection failed: {err}")
            return False
    
    def close_database_connection(self):
        """Close the database connection"""
        if self.db_connection and self.db_connection.is_connected():
            self.db_connection.close()
            print("Database connection closed")
    
    def train_chatbot(self):
        """Train the chatbot with general conversation and electronics knowledge"""
        # Train with pre-built corpus data
        trainer = ChatterBotCorpusTrainer(self.chatbot)
        trainer.train('chatterbot.corpus.english.greetings',
                      'chatterbot.corpus.english.conversations')
        
        # Train with custom electronics store conversations
        list_trainer = ListTrainer(self.chatbot)
        
        # Bổ sung nhiều mẫu hội thoại đa dạng cho các ý định phổ biến
        custom_conversations = [
            # General greetings
            ["hi", "Hello! Welcome to our electronics store. How can I help you today?"],
            ["hello", "Hi there! I'm your electronics assistant. What are you looking for today?"],
            ["hey", "Hello! How can I assist you with your electronics needs today?"],
            ["good morning", "Good morning! How can I help you with electronics today?"],
            ["good afternoon", "Good afternoon! How can I help you with electronics today?"],
            ["good evening", "Good evening! How can I help you with electronics today?"],
            # General product information
            ["What products do you offer?", "We offer various electronics including laptops, CPUs, GPUs, mainboards, RAM, storage, PSUs, cases, and CPU coolers."],
            ["what your shop have", "We offer a wide range of electronics: laptops, CPUs, GPUs, RAM, storage, and more. What are you interested in?"],
            ["what do you sell", "We sell electronics such as laptops, CPUs, GPUs, RAM, storage, and more. What are you looking for?"],
            ["show me all products", "We have laptops, CPUs, GPUs, RAM, storage, PSUs, cases, and CPU coolers. Which one do you want to know more about?"],
            ["do you sell computers", "Yes, we sell computers, laptops, and all computer components."],
            ["do you have electronics", "Yes, we have a wide range of electronics. What are you looking for?"],
            # Laptop
            ["laptop", "I can help with laptops. Are you looking for gaming, work, or general use laptops?"],
            ["what laptop your shop have", "We have many laptops for gaming, work, and general use. What is your budget or purpose?"],
            ["show me laptops", "Sure! We have a variety of laptops. Are you interested in gaming, work, or general use?"],
            ["list all laptops", "We have many laptops available. Do you want to filter by price or brand?"],
            ["do you have dell laptop", "Yes, we have Dell laptops. What is your budget or requirements?"],
            ["gaming laptop", "For gaming, you'll want a laptop with a dedicated GPU, at least 16GB RAM, and a good cooling system. What's your budget?"],
            ["work laptop", "For work laptops, I recommend models with good battery life, at least 8GB RAM, and an SSD. What's your budget range?"],
            ["general use laptop", "For general use, a laptop with an i5/Ryzen 5 processor, 8GB RAM and 256GB SSD should be sufficient. What's your budget?"],
            ["do you have macbook", "Yes, we have MacBook laptops. Are you looking for MacBook Air or Pro?"],
            # CPU
            ["cpu", "We have various CPUs from Intel and AMD. Are you building a gaming PC, workstation, or general use computer?"],
            ["show me cpu", "We have Intel and AMD CPUs. What is your budget or intended use?"],
            ["list all cpu", "We have a wide range of CPUs. Do you want to filter by brand or price?"],
            ["do you have intel cpu", "Yes, we have Intel CPUs. What model or price range are you interested in?"],
            ["do you have amd cpu", "Yes, we have AMD CPUs. What model or price range are you interested in?"],
            ["give me information about cpu", "CPUs (Central Processing Units) are the brain of your computer. We carry Intel processors (i3, i5, i7, i9) and AMD processors (Ryzen 3, 5, 7, 9). What kind of performance do you need?"],
            ["what is a cpu", "A CPU (Central Processing Unit) is the primary component of a computer that performs calculations and logic operations. The main CPU manufacturers are Intel and AMD."],
            ["which cpu is best", "The best CPU depends on your needs. For gaming, the AMD Ryzen 5/7 or Intel i5/i7 are popular. For professional workloads, consider AMD Ryzen 9 or Intel i9 processors."],
            # GPU
            ["gpu", "We have a range of GPUs from NVIDIA (RTX and GTX series) and AMD (Radeon RX series). Are you looking for gaming, video editing, or other specialized uses?"],
            ["show me gpu", "We have NVIDIA and AMD GPUs. What is your budget or intended use?"],
            ["list all gpu", "We have a wide range of GPUs. Do you want to filter by brand or price?"],
            ["do you have nvidia gpu", "Yes, we have NVIDIA GPUs. What model or price range are you interested in?"],
            ["do you have amd gpu", "Yes, we have AMD GPUs. What model or price range are you interested in?"],
            ["graphics card", "Our graphics cards include NVIDIA's RTX 3000/4000 series and AMD's Radeon RX 6000/7000 series. What will you be using the graphics card for?"],
            # RAM
            ["ram", "We offer RAM in various capacities (8GB to 128GB) and speeds. Are you looking for desktop or laptop memory, and what capacity do you need?"],
            ["show me ram", "We have many RAM options. What capacity or brand are you looking for?"],
            ["list all ram", "We have RAM from 8GB to 128GB. Do you want to filter by type or price?"],
            ["do you have ddr4 ram", "Yes, we have DDR4 RAM. What capacity do you need?"],
            ["do you have ddr5 ram", "Yes, we have DDR5 RAM. What capacity do you need?"],
            ["memory", "For computer memory, we have DDR4 and DDR5 RAM modules from brands like Corsair, G.Skill, and Kingston. What capacity and speed are you looking for?"],
            # Storage
            ["storage", "We offer SSDs (faster) and HDDs (more capacity per dollar). Do you need high speed or large capacity storage?"],
            ["show me storage", "We have SSDs and HDDs. What capacity or type are you looking for?"],
            ["list all storage", "We have many storage options. Do you want to filter by SSD or HDD?"],
            ["do you have ssd", "Yes, we have SSDs. What capacity do you need?"],
            ["do you have hdd", "Yes, we have HDDs. What capacity do you need?"],
            ["ssd", "Our SSDs include NVMe drives (fastest), SATA SSDs, and portable external SSDs. What capacity are you looking for?"],
            # Mainboard
            ["mainboard", "We have many mainboards for Intel and AMD CPUs. What CPU are you using or planning to buy?"],
            ["show me mainboard", "We have mainboards for different CPUs. What socket or brand do you need?"],
            ["do you have asus mainboard", "Yes, we have ASUS mainboards. What socket or chipset do you need?"],
            ["do you have msi mainboard", "Yes, we have MSI mainboards. What socket or chipset do you need?"],
            # PSU
            ["psu", "We have power supply units (PSUs) from 400W to 1000W. What wattage do you need?"],
            ["show me psu", "We have many PSUs. What wattage or brand are you looking for?"],
            # Case
            ["case", "We have computer cases in various sizes and styles. Do you prefer a specific brand or size?"],
            ["show me case", "We have many computer cases. What size or style do you want?"],
            # Cooling
            ["cooling", "We have CPU coolers, fans, and liquid cooling solutions. What do you need to cool?"],
            ["show me cooling", "We have many cooling options. Are you looking for air or liquid cooling?"],
            # Price
            ["price about 200$", "With a budget of $200, you could get entry-level components like an Intel i3 or AMD Ryzen 3 CPU, basic RAM, or a budget SSD. What component are you interested in?"],
            ["budget 500$", "With $500, you have good mid-range options. You could get a decent gaming CPU, a mid-range GPU, or a good quality 1TB SSD. What are you looking to purchase?"],
            ["under 1000$", "With a budget under $1000, you can get high-quality components like an Intel i7/AMD Ryzen 7 CPU, a good RTX series GPU, or a premium motherboard. What component are you interested in?"],
            ["how much is a laptop", "Laptop prices vary by model and specs. What is your budget or requirements?"],
            ["how much is a cpu", "CPU prices depend on brand and performance. What is your budget or intended use?"],
            ["how much is a gpu", "GPU prices vary by model and brand. What is your budget or intended use?"],
            # Stock/availability
            ["do you have this in stock", "Please tell me the product name or code, I'll check the stock for you."],
            ["is this available", "Please specify the product, I'll check its availability for you."],
            ["is laptop available", "Yes, we have laptops available. What type or brand are you looking for?"],
            # Brand
            ["do you have dell", "Yes, we have Dell products. Are you looking for laptops or monitors?"],
            ["do you have asus", "Yes, we have ASUS products. Are you looking for laptops, mainboards, or something else?"],
            ["do you have apple", "Yes, we have Apple products including MacBooks."],
            # Warranty
            ["how long is the warranty", "Most products come with a 12 to 36 month warranty depending on the brand and type."],
            ["warranty for laptop", "Laptops usually have a 12 to 24 month warranty. Do you want to know about a specific model?"],
            # Promotion
            ["any promotion", "We often have promotions on laptops and components. Do you want to know about current deals?"],
            ["is there any discount", "We have discounts on selected products. What are you interested in?"],
            # How to buy
            ["how to buy", "You can buy directly at our store or order online. Would you like instructions for online purchase?"],
            ["how to order", "To order, just add products to your cart and proceed to checkout. Need help with the process?"],
            ["can i buy online", "Yes, you can buy online through our website. Do you need help with the process?"],
            # Compatibility
            ["How do I know if parts are compatible?", "I can check hardware compatibility for you. The most important compatibility concerns are between CPUs and motherboards (socket type), RAM and motherboards (DDR generation and speed), and case and motherboard sizes."]
        ]
        for conv in custom_conversations:
            list_trainer.train(conv)
    
    def get_product_info(self, product_id):
        """Get information about a specific product"""
        if not self.db_connection:
            self.connect_to_database()
            
        cursor = self.db_connection.cursor(dictionary=True)
        query = """
        SELECT p.*, c.category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id = %s
        """
        cursor.execute(query, (product_id,))
        result = cursor.fetchone()
        cursor.close()
        return result
    
    def search_products(self, category=None, keyword=None, min_price=None, max_price=None):
        """Search products based on criteria"""
        if not self.db_connection:
            self.connect_to_database()
            
        cursor = self.db_connection.cursor(dictionary=True)
        query = """
        SELECT p.*, c.category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE 1=1
        """
        params = []
        
        if category:
            query += " AND c.category_name LIKE %s"
            params.append(f"%{category}%")
        
        if keyword:
            query += " AND (p.title LIKE %s OR p.description LIKE %s)"
            params.append(f"%{keyword}%")
            params.append(f"%{keyword}%")
        
        if min_price is not None:
            query += " AND p.price >= %s"
            params.append(min_price)
        
        if max_price is not None:
            query += " AND p.price <= %s"
            params.append(max_price)
            
        cursor.execute(query, tuple(params))
        results = cursor.fetchall()
        cursor.close()
        return results
    
    def check_compatibility(self, product1_id, product2_id):
        """Check if two products are compatible"""
        if not self.db_connection:
            self.connect_to_database()
            
        # Get product categories
        cursor = self.db_connection.cursor(dictionary=True)
        query = """
        SELECT p1.product_id, p1.title AS product1_title, c1.category_name AS product1_category,
               p2.product_id, p2.title AS product2_title, c2.category_name AS product2_category
        FROM products p1
        JOIN categories c1 ON p1.category_id = c1.category_id
        JOIN products p2 ON p2.product_id = %s
        JOIN categories c2 ON p2.category_id = c2.category_id
        WHERE p1.product_id = %s
        """
        cursor.execute(query, (product2_id, product1_id))
        result = cursor.fetchone()
        
        # Now check attributes for compatibility
        # This is a simplified logic - you might need more complex compatibility rules
        if result:
            # Example: Check if CPU socket matches motherboard socket
            if (result['product1_category'] == 'CPU' and result['product2_category'] == 'Mainboard') or \
               (result['product1_category'] == 'Mainboard' and result['product2_category'] == 'CPU'):
                
                # Get attributes for both products
                query = """
                SELECT pa.product_id, pa.attribute_name, pa.attribute_value
                FROM product_attributes pa
                WHERE pa.product_id IN (%s, %s) AND pa.attribute_name = 'Socket'
                """
                cursor.execute(query, (product1_id, product2_id))
                attributes = cursor.fetchall()
                
                # Check if socket values match
                sockets = {}
                for attr in attributes:
                    sockets[attr['product_id']] = attr['attribute_value']
                
                if len(sockets) == 2 and list(sockets.values())[0] == list(sockets.values())[1]:
                    return True, "These products are compatible."
                else:
                    return False, "These products are not compatible due to different socket types."
            
            # Add more compatibility rules for other component combinations
            
            return None, "I don't have enough information to determine compatibility."
        else:
            return None, "Could not find one or both products."
    
    def recommend_products(self, category, use_case=None, budget=None):
        """Recommend products based on category and optional criteria"""
        if not self.db_connection:
            self.connect_to_database()
            
        cursor = self.db_connection.cursor(dictionary=True)
        query = """
        SELECT p.*, c.category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE c.category_name LIKE %s
        """
        params = [f"%{category}%"]
        
        if budget:
            query += " AND p.price <= %s"
            params.append(budget)
        
        query += " ORDER BY p.rating DESC LIMIT 5"
        
        cursor.execute(query, tuple(params))
        results = cursor.fetchall()
        cursor.close()
        
        return results
    
    def extract_price(self, message):
        """Extract price information from user message"""
        # Look for patterns like "$200", "200$", "200 dollars", etc.
        price_patterns = [
            r'\$(\d+)',                  # $200
            r'(\d+)\$',                  # 200$
            r'(\d+)\s*dollars',          # 200 dollars
            r'budget\s*[\:\-]?\s*(\d+)', # budget: 200, budget - 200
            r'under\s*\$?(\d+)',         # under $200, under 200
            r'about\s*\$?(\d+)'          # about $200, about 200
        ]
        
        for pattern in price_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                return int(match.group(1))
        return None
    
    def extract_category(self, message):
        """Extract product category from user message"""
        categories = {
            'laptop': ['laptop', 'notebook', 'portable computer'],
            'cpu': ['cpu', 'processor', 'central processing unit'],
            'gpu': ['gpu', 'graphics card', 'video card', 'graphics processor'],
            'ram': ['ram', 'memory', 'ddr4', 'ddr5'],
            'storage': ['storage', 'ssd', 'hdd', 'hard drive', 'solid state'],
            'mainboard': ['mainboard', 'motherboard', 'mobo', 'main board'],
            'psu': ['psu', 'power supply'],
            'case': ['case', 'computer case', 'tower'],
            'cooling': ['cooling', 'cpu cooler', 'fan', 'heatsink', 'radiator']
        }
        
        message = message.lower()
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in message:
                    return category
        return None
    
    def extract_use_case(self, message):
        """Extract use case information from user message"""
        use_cases = {
            'gaming': ['gaming', 'game', 'gamer', 'play games'],
            'work': ['work', 'office', 'productivity', 'business'],
            'general': ['general', 'everyday', 'basic', 'browsing', 'web browsing']
        }
        
        message = message.lower()
        for use_case, keywords in use_cases.items():
            for keyword in keywords:
                if keyword in message:
                    return use_case
        return None
    
    def process_message(self, message):
        """Process user message and return appropriate response"""
        # Extract information from user message
        category = self.extract_category(message)
        use_case = self.extract_use_case(message)
        budget = self.extract_price(message)

        # Handle selection by number after recommendations
        if self.last_recommendations and message.strip().isdigit():
            idx = int(message.strip()) - 1
            if 0 <= idx < len(self.last_recommendations):
                product = self.last_recommendations[idx]
                self.last_selected_product = product  # Save for follow-up questions
                details = (
                    f"Product: {product['title']}\n"
                    f"Category: {product['category_name']}\n"
                    f"Price: ${product['price']}\n"
                    f"Rating: {product.get('rating', 'N/A')}\n"
                    f"Description: {product.get('description', 'No description')}\n"
                    "If you want to know which mainboard/motherboard is compatible, just ask!"
                )
                return details
            else:
                return "Please select a valid product number from the list above."

        # Handle follow-up compatibility question after product selection
        if hasattr(self, "last_selected_product") and self.last_selected_product:
            if re.search(r'(which|what|find|show).*(mainboard|motherboard|board).*compatible', message, re.IGNORECASE) or \
               re.search(r'(mainboard|motherboard|board).*install', message, re.IGNORECASE):
                cpu_product = self.last_selected_product
                # Only proceed if the selected product is a CPU
                if cpu_product['category_name'].lower() in ['cpu', 'processor']:
                    # Find compatible mainboards by socket
                    if not self.db_connection:
                        self.connect_to_database()
                    cursor = self.db_connection.cursor(dictionary=True)
                    # Get socket type of CPU
                    query = """
                        SELECT attribute_value FROM product_attributes
                        WHERE product_id = %s AND attribute_name = 'Socket'
                    """
                    cursor.execute(query, (cpu_product['product_id'],))
                    cpu_socket = cursor.fetchone()
                    if cpu_socket:
                        socket_value = cpu_socket['attribute_value']
                        # Find mainboards with the same socket
                        query = """
                            SELECT p.title, p.price, p.rating, p.product_id
                            FROM products p
                            JOIN product_attributes pa ON p.product_id = pa.product_id
                            JOIN categories c ON p.category_id = c.category_id
                            WHERE c.category_name LIKE 'Mainboard'
                              AND pa.attribute_name = 'Socket/CPU'
                              AND pa.attribute_value = %s
                            LIMIT 5
                        """
                        cursor.execute(query, (socket_value,))
                        boards = cursor.fetchall()
                        cursor.close()
                        if boards:
                            response = f"Here are some mainboards compatible with {cpu_product['title']} (Socket {socket_value}):\n"
                            for i, board in enumerate(boards, 1):
                                response += f"{i}. {board['title']} - ${board['price']} (Rating: {board.get('rating', 'N/A')})\n"
                            response += "\nReply with the number to get more details about a mainboard."
                            self.last_recommendations = boards
                            return response
                        else:
                            return f"Sorry, I couldn't find any mainboards with socket {socket_value} compatible with {cpu_product['title']}."
                    else:
                        return "Sorry, I couldn't determine the socket type for this CPU."
                else:
                    return "Please select a CPU first to find compatible mainboards."
        
        # Information request about specific category
        if re.search(r'(what is|information about|tell me about|info on)\s+(\w+)', message, re.IGNORECASE):
            category_match = re.search(r'(what is|information about|tell me about|info on)\s+(\w+)', message, re.IGNORECASE)
            topic = category_match.group(2).lower()
            
            if topic in ['cpu', 'processor']:
                return "CPUs (Central Processing Units) are the brain of your computer. We carry Intel processors (i3, i5, i7, i9) and AMD processors (Ryzen 3, 5, 7, 9). The CPU determines the overall performance of your system."
            elif topic in ['gpu', 'graphics card']:
                return "GPUs (Graphics Processing Units) handle graphics rendering. NVIDIA and AMD are the main manufacturers. GPUs are essential for gaming, video editing, and other graphics-intensive tasks."
            elif topic in ['ram', 'memory']:
                return "RAM (Random Access Memory) is temporary storage for actively running programs. More RAM generally means better multitasking performance. We offer various capacities from 8GB to 128GB."
            elif topic in ['ssd', 'storage']:
                return "Storage devices hold your data permanently. SSDs (Solid State Drives) are faster than traditional HDDs (Hard Disk Drives). NVMe SSDs offer the best performance for your system boot drive."
            elif topic in ['mainboard', 'motherboard']:
                return "Motherboards connect all your computer components together. They determine what CPU, RAM, and other components are compatible with your system. They come in different sizes like ATX, micro-ATX, and mini-ITX."
        
        # Product recommendation request based on extracted information
        if category and (re.search(r'recommend', message, re.IGNORECASE) or re.search(r'suggestion', message, re.IGNORECASE) or category == message.lower().strip()):
            recommendations = self.recommend_products(category, use_case, budget)
            if recommendations:
                self.last_recommendations = recommendations  # Save for selection
                response = f"Here are some recommended {category} products"
                if use_case:
                    response += f" for {use_case}"
                if budget:
                    response += f" under ${budget}"
                response += ":\n"
                for i, product in enumerate(recommendations, 1):
                    response += f"{i}. {product['title']} - ${product['price']} (Rating: {product['rating']})\n"
                response += "\nReply with the number to get more details about a product."
                return response
            else:
                self.last_recommendations = None
                response = f"I couldn't find any {category} products"
                if budget:
                    response += f" under ${budget}"
                return response + "."

        # Simple category mention without context
        if category and len(message.strip().split()) <= 2:
            if category == 'laptop':
                return "I can help with laptops. Are you looking for gaming, work, or general use laptops? What's your budget range?"
            elif category == 'cpu':
                return "We have various CPUs from Intel and AMD. Are you building a gaming PC, workstation, or general use computer? What's your price range?"
            elif category == 'gpu':
                return "We have GPUs from NVIDIA and AMD in various performance tiers. What will you be using it for, and what's your budget?"
            elif category == 'ram':
                return "We have RAM modules from 8GB to 128GB. Are you looking for desktop or laptop memory, and what capacity do you need?"
            elif category == 'storage':
                return "We have SSDs and HDDs available. Are you looking for speed (SSD) or large capacity storage (HDD)? What capacity do you need?"
            
        # Price query without specific product
        if budget and not category:
            return f"With a budget of ${budget}, you could consider various components. Are you interested in a specific type of product like CPUs, GPUs, or laptops?"
        
        # Use case without specific category
        if use_case and not category:
            if use_case == 'gaming':
                return "For gaming, you'll need a good CPU, GPU, and sufficient RAM. What specific component are you interested in?"
            elif use_case == 'work':
                return "For work purposes, reliable components with good warranty are important. What specific component are you looking for?"
            elif use_case == 'general':
                return "For general use, you don't need the highest-end components. What specific part are you interested in?"
        
        # Search request
        search_pattern = re.compile(r'search.*?(laptop|cpu|gpu|ram|storage|mainboard|psu|case)', re.IGNORECASE)
        match = search_pattern.search(message)
        if match:
            category = match.group(1)
            results = self.search_products(category=category)
            if results:
                response = f"Here are some {category} products:\n"
                for i, product in enumerate(results[:5], 1):
                    response += f"{i}. {product['title']} - ${product['price']}\n"
                return response
            else:
                return f"I couldn't find any {category} products."
        
        # Compatibility check request
        compatibility_pattern = re.compile(r'compatible.*?(\d+).*?(\d+)', re.IGNORECASE)
        match = compatibility_pattern.search(message)
        if match:
            product1_id = int(match.group(1))
            product2_id = int(match.group(2))
            compatible, reason = self.check_compatibility(product1_id, product2_id)
            return reason
        
        # Prevent math logic adapter from answering with "1 = 1" etc.
        if message.strip().isdigit():
            if self.last_recommendations:
                return "Please reply with a product number from the last list to get more details."
            return "Could you please clarify your question or specify what you want to know about this number?"

        # Use the chatbot for general responses
        response = str(self.chatbot.get_response(message))
        # Fallback for unclear or irrelevant responses
        if response.strip().lower() in [message.strip().lower(), "i don't know.", "i am not sure.", "that's good.", "ram", "cpu", "how do you do?"]:
            return "Sorry, I didn't understand that. You can ask about products, request recommendations, or check compatibility. For example, ask 'Which motherboard is suitable to install that CPU on?' after selecting a CPU."
        return response

# Example usage
if __name__ == "__main__":
    # Database configuration
    db_config = {
        'user': 'root',
        'password': '',
        'host': 'localhost',
        'database': 'techshop_train'  # Updated database name
    }
    
    # Create the chatbot
    try:
        bot = ElectronicsStoreBot(db_config)
        
        print("Electronics Store Assistant Bot (type 'exit' to quit)")
        print("---------------------------------------------------")
        print("You can ask about products, request recommendations, or check compatibility.")
        
        # Simple chat loop
        while True:
            user_input = input("You: ")
            if user_input.lower() == 'exit':
                bot.close_database_connection()
                print("Bot: Goodbye!")
                break
            
            response = bot.process_message(user_input)
            print(f"Bot: {response}")
    except Exception as e:
        print(f"Error: {e}")

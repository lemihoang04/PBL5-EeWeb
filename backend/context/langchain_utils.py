from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain_groq import ChatGroq 
import pandas as pd
from DAL.product_dal import get_products_from_db_by_query

def create_product_agent():
    products = get_products_from_db_by_query()
    df = pd.DataFrame(products)
    llm = ChatGroq(
        groq_api_key="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",  
        model_name="meta-llama/llama-4-scout-17b-16e-instruct",  
        temperature=0.1,
    )
    agent = create_pandas_dataframe_agent(
        llm, 
        df, 
        verbose=True, 
        allow_dangerous_code=True,
        prefix="""You are a helpful shopping assistant in Techshop that answers questions about products using a pandas dataframe.
For simple greetings like 'hi' or 'hello', respond politely and ask how you can help with finding products.
*General Query Handling:** If the user asks a general question about what the shop offers or sells, without mentioning a specific product type (e.g., 'What do you have?', 'What kinds of products do you sell?', 'What types of items are available?'), do *not* list individual products. Instead, list the **unique** product types available in the DataFrame. Extract the unique values from the 'type' column and present them as a simple list. Example response: "We offer the following types of products: Laptops, Smartphones, Keyboards, Mice."
When providing product information, format the output using Markdown, let its in Final answer.
For each product, list the details in a numbered list format where the product title is a clickable link to the product detail page.
Make sure to filter the products based on the 'type' column.
For example, if a product has id 3416 and title "Acer Aspire 3", its entry should be formatted as:
1. [Acer Aspire 3](/product-info/3416), Price: 179.99, Rating: 5.0
Ensure all product listings follow this format for easy interaction in the frontend..
        """
    )
    return agent
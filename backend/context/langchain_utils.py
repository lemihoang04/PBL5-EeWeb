from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain_groq import ChatGroq  # Thêm import này
import pandas as pd
from DAL.product_dal import get_products_from_db_by_query

def create_product_agent():
    products = get_products_from_db_by_query()
    df = pd.DataFrame(products)
    # Sử dụng Groq LLM thay vì HuggingFaceHub
    llm = ChatGroq(
        groq_api_key="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",  # Thay bằng API key của bạn hoặc lấy từ biến môi trường
        model_name="meta-llama/llama-4-scout-17b-16e-instruct",   # Hoặc model Groq khác bạn muốn dùng
        temperature=0.1,
    )
    agent = create_pandas_dataframe_agent(
        llm, 
        df, 
        verbose=True, 
        allow_dangerous_code=True,
        prefix="""You are a helpful shopping assistant that answers questions about products using a pandas dataframe.
        For simple greetings like 'hi' or 'hello', respond politely and ask how you can help with finding products.
        When providing product information, format it clearly with prices, specifications, and organize similar products together.
        """
    )
    return agent
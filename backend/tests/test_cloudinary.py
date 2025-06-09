import sys
import os
import logging

# Add the parent directory to the module search path
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from DAL.cloudinary_utils import upload_image_to_cloudinary, create_thumbnail_url
import base64

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    logger.info("Testing Cloudinary integration")
    
    # Test 1: Create a test image and upload it
    test_image_path = create_test_image()
    if not test_image_path:
        logger.error("Failed to create test image")
        return
    
    logger.info(f"Created test image at: {test_image_path}")
    
    # Upload the test image to Cloudinary
    result = upload_image_to_cloudinary(test_image_path)
    
    if not result:
        logger.error("Failed to upload test image to Cloudinary")
        return
    
    logger.info(f"Successfully uploaded to Cloudinary: {result}")
    
    # Test 2: Create a thumbnail URL
    if result:
        thumbnail_url = create_thumbnail_url(result, width=100, height=100)
        logger.info(f"Thumbnail URL: {thumbnail_url}")
    
    # Clean up the test image
    try:
        os.remove(test_image_path)
        logger.info(f"Removed test image: {test_image_path}")
    except Exception as e:
        logger.error(f"Failed to remove test image: {str(e)}")

def create_test_image():
    """
    Create a simple test image for uploading
    
    Returns:
        str: Path to the created image file or None if failure
    """
    try:
        # Create a very simple 1x1 pixel white PNG image
        from PIL import Image
        
        # Create a directory for test files if it doesn't exist
        test_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "test_files"))
        os.makedirs(test_dir, exist_ok=True)
        
        # Create a test image
        test_image_path = os.path.join(test_dir, "test_image.png")
        
        # Create a small white image
        img = Image.new('RGB', (100, 100), color=(255, 255, 255))
        img.save(test_image_path)
        
        return test_image_path
    except Exception as e:
        logger.error(f"Error creating test image: {str(e)}")
        return None

if __name__ == "__main__":
    main()

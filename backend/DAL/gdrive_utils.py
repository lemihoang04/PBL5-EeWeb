"""
Google Drive utilities for uploading images.
"""
import os
import json
import logging
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google.oauth2 import service_account
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.errors import HttpError
from flask import current_app

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Google Drive API scopes
SCOPES = ['https://www.googleapis.com/auth/drive.file']

# Drive folder ID for product images (modify as needed)
# Bạn cần tạo một thư mục trên Google Drive và lấy ID của nó
# ID thư mục sẽ có định dạng như: 1a2b3c4d5e6f7g8h9i
# Bạn có thể lấy ID thư mục từ URL khi mở thư mục đó trên trình duyệt
PRODUCT_IMAGES_FOLDER_ID = '1vsyx9__iZVy-h1As06XVLifooPujAxdY'  # Replace with your actual folder ID

def authenticate():
    """
    Authenticates with Google Drive API using OAuth or service account.
    
    Returns:
        googleapiclient.discovery.Resource: Authorized Google Drive API service.
    """
    creds = None
    
    try:
        # Get paths for credentials files
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        token_path = os.path.join(base_path, 'credentials', 'token.json')
        credentials_path = os.path.join(base_path, 'credentials', 'credentials.json')
        service_account_path = os.path.join(base_path, 'credentials', 'service_account.json')
          # First try service account (preferred for server deployments)
        if os.path.exists(service_account_path):
            logger.info("Using service account authentication")
            # Verify if the service account file is properly configured
            try:
                with open(service_account_path, 'r') as f:
                    sa_data = json.load(f)
                    if sa_data.get('private_key') == '-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n':
                        logger.error("Service account file is not configured. Please replace placeholder values.")
                        return None
                
                creds = service_account.Credentials.from_service_account_file(
                    service_account_path, scopes=SCOPES)
                return build('drive', 'v3', credentials=creds)
            except json.JSONDecodeError:
                logger.error("Service account file contains invalid JSON")
                return None
        
        # Then try OAuth flow
        if os.path.exists(token_path):
            logger.info("Loading existing token")
            with open(token_path, 'r') as token_file:
                creds = Credentials.from_authorized_user_info(json.loads(token_file.read()), SCOPES)
        
        # If no valid credentials are available, let user log in
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                logger.info("Refreshing expired token")
                creds.refresh(Request())
            elif os.path.exists(credentials_path):
                logger.info("Starting OAuth flow")
                flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
                creds = flow.run_local_server(port=0)
                
                # Save the credentials for next run
                logger.info("Saving new token")
                with open(token_path, 'w') as token:
                    token.write(creds.to_json())
            else:
                logger.error("No credentials file found")
                return None
                
        return build('drive', 'v3', credentials=creds)
    
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return None

def upload_image_to_drive(file_path, file_object=None):
    try:
        # Get Google Drive service
        service = authenticate()
        if not service:
            logger.error("Failed to authenticate with Google Drive")
            return None
            
        # Determine file name and prepare metadata
        if file_object:
            file_name = os.path.basename(file_path) if file_path else file_object.filename
        else:
            # Check if file exists
            if not os.path.exists(file_path):
                logger.error(f"File does not exist: {file_path}")
                return None
                
            file_name = os.path.basename(file_path)
            file_size = os.path.getsize(file_path) / 1024  # kB
            logger.info(f"Uploading file from disk: {file_name} ({file_size:.2f} kB)")
              # Determine mimetype based on file extension or directly from file_object
        mimetype = 'image/jpeg'  # Default
        if file_object and hasattr(file_object, 'content_type') and file_object.content_type:
            mimetype = file_object.content_type
        elif file_name.lower().endswith('.png'):
            mimetype = 'image/png'
        elif file_name.lower().endswith('.gif'):
            mimetype = 'image/gif'
            
        # File metadata
        file_metadata = {
            'name': file_name,
        }
        
        # Add to folder if specified
        if PRODUCT_IMAGES_FOLDER_ID != 'your_folder_id_here':
            file_metadata['parents'] = [PRODUCT_IMAGES_FOLDER_ID]
            logger.info(f"Uploading to folder: {PRODUCT_IMAGES_FOLDER_ID}")
        else:
            logger.info("Uploading to Drive root folder")
        
        # Upload the file
        if file_object:            # Create temporary file for direct upload from file_object
            import tempfile
            temp_path = None
            try:
                # Create a temporary file and write to it properly
                temp_path = tempfile.mktemp(suffix=os.path.splitext(file_name)[1])
                
                # Save properly, ensuring file pointer is at correct position
                file_object.stream.seek(0)  # Reset file pointer to beginning
                file_object.save(temp_path)
                
                logger.info(f"Saved file to temp path: {temp_path}, size: {os.path.getsize(temp_path)} bytes")
                
                # Upload from temp file
                media = MediaFileUpload(temp_path, mimetype=mimetype, resumable=True)
                file = service.files().create(
                    body=file_metadata, 
                    media_body=media,
                    fields='id'
                ).execute()
            finally:
                # Clean up temp file
                if temp_path and os.path.exists(temp_path):
                    os.unlink(temp_path)
        else:
            # Normal upload from disk
            media = MediaFileUpload(file_path, mimetype=mimetype, resumable=True)
            file = service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
        
        file_id = file.get('id')
        if not file_id:
            logger.error("Failed to get file ID after upload")
            return None
            
        logger.info(f"File uploaded with ID: {file_id}")
          # Make the file publicly accessible
        service.permissions().create(
            fileId=file_id,
            body={'role': 'reader', 'type': 'anyone'}
        ).execute()        # Trả về URL trực tiếp từ Google Drive để tương thích với frontend
        # URL này sẽ hoạt động như các URL hình ảnh thông thường từ các CDN khác
        direct_view_url = f"https://drive.google.com/thumbnail?id={file_id}&sz=w1000"
        logger.info(f"Direct thumbnail URL created: {direct_view_url}")
        
        # URL dự phòng nếu thumbnail không hoạt động
        original_url = f"https://drive.google.com/uc?export=view&id={file_id}"
        logger.info(f"Original URL created: {original_url}")
        
        # Sử dụng URL thumbnail vì thường ổn định hơn cho hiển thị
        return direct_view_url
        
    except Exception as e:
        logger.error(f"Error uploading to Google Drive: {str(e)}")
        return None

# Không cần local fallback - đã xóa hàm create_local_file_url

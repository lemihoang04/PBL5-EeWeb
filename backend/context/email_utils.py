import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Email configuration
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USER = os.getenv('EMAIL_USER', '')  # Your Gmail address
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')  # Your app password
print(EMAIL_USER, EMAIL_PASSWORD)
def send_email(recipient_email, subject, message, html_message=None):
    """
    Send an email using Gmail SMTP
    """
    if not EMAIL_USER or not EMAIL_PASSWORD:
        raise ValueError("Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.")
        
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = EMAIL_USER
        msg['To'] = recipient_email
        msg['Subject'] = subject
        
        # Plain text version
        msg.attach(MIMEText(message, 'plain'))
        
        # HTML version (if provided)
        if html_message:
            msg.attach(MIMEText(html_message, 'html'))
        
        # Connect to SMTP server
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        
        # Send email
        server.sendmail(EMAIL_USER, recipient_email, msg.as_string())
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def send_otp_email(recipient_email, otp_code):
    """
    Send an email with OTP for password reset
    """
    subject = "Password Reset OTP - Your TechShop Account"
    
    # Plain text message
    message = f"""
Hello,

You have requested to reset your password for your TechShop account.

Your OTP code is: {otp_code}

This code will expire in 5 minutes. If you did not request this password reset, please ignore this email.

Best regards,
The TechShop Team
"""
    
    # HTML message for better formatting
    html_message = f"""
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #3182ce; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; }}
        .otp-code {{ font-size: 24px; font-weight: bold; text-align: center; 
                    padding: 15px; margin: 20px 0; background-color: #f0f4f8; 
                    border-radius: 5px; letter-spacing: 3px; }}
        .footer {{ font-size: 12px; color: #666; text-align: center; margin-top: 30px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Password Reset Request</h2>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password for your TechShop account.</p>
            <p>Please use the following OTP code to complete your password reset:</p>
            <div class="otp-code">{otp_code}</div>
            <p>This code will expire in <strong>5 minutes</strong>.</p>
            <p>If you did not request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The TechShop Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
"""
    
    return send_email(recipient_email, subject, message, html_message)
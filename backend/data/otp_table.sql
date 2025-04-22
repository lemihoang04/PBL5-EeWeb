-- Create otp_codes table for password reset functionality
CREATE TABLE IF NOT EXISTS otp_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    created_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    INDEX email_idx (email),
    INDEX otp_idx (otp_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Tạo database
CREATE DATABASE IF NOT EXISTS computer_store CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE computer_store;

-- Bảng admin
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng user
CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng laptop
CREATE TABLE laptop (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT,
    price DOUBLE,
    rating TEXT,
    image TEXT,
    screen_size TEXT,
    screen_resolution TEXT,
    max_screen_resolution TEXT,
    processor TEXT,
    num_processors DOUBLE,
    ram TEXT,
    memory_type TEXT,
    graphics_coprocessor TEXT,
    chipset_brand TEXT,
    hard_drive TEXT,
    flash_memory_size TEXT,
    hard_drive_interface TEXT,
    wireless_type TEXT,
    num_usb_3_ports DOUBLE,
    operating_system TEXT,
    item_weight TEXT,
    product_dimensions TEXT,
    brand TEXT,
    series TEXT,
    model_number TEXT
);

-- Linh kiện
CREATE TABLE component (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM(
        'storage', 
        'psu',            
        'mainboard', 
        'gpu',            
        'cpu',            
        'ram',            
        'cpu_cooler',     
        'case'             
    ) NOT NULL,
    title TEXT,
    price DOUBLE,
    image TEXT,
    brand VARCHAR(100),
    series VARCHAR(100),
    model_number VARCHAR(255),
    specs JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng product
CREATE TABLE product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('laptop', 'component') NOT NULL,
    reference_id INT NOT NULL
    -- Tham chiếu đến bảng laptop (nếu là laptop) hoặc product_detail (nếu là linh kiện)
);

-- Bảng booking
CREATE TABLE order (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- Bảng payment
CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    user_id INT,
    amount DOUBLE,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);



-- Lấy sản phẩm ra từ booking 
SELECT 
    b.booking_id,
    b.booking_date,
    b.quantity,
    u.name AS user_name,
    p.category,

    -- Laptop
    l.title AS laptop_title,
    l.price AS laptop_price,

    -- Component
    c.title AS component_title,
    c.price AS component_price,
    c.type AS component_type,
    --3 dòng dưới thì phải có json trong csdl mới truy vấn được nếu chưa có thì đừng thêm vào
    c.specs->>'$.capacity' AS component_capacity,
    c.specs->>'$.speed' AS component_speed,
    c.specs->>'$.type' AS memory_type

FROM booking b
JOIN user u ON b.user_id = u.user_id
JOIN product p ON b.product_id = p.product_id

LEFT JOIN laptop l ON p.category = 'laptop' AND p.reference_id = l.id
LEFT JOIN component c ON p.category = 'component' AND p.reference_id = c.id

LIMIT 0, 25;

-- Truy vấn specs(là các thông số linh kiện)
SELECT
  title,
  specs->>'$.capacity' AS capacity,
  specs->>'$.speed' AS speed
FROM component
WHERE type = 'ram';



-- Ví dụ cho json
INSERT INTO component (
    type, title, price, rating, image, brand, series, model_number, specs
) VALUES (
    'ram',
    'Kingston 16GB DDR4 3200MHz',
    55.99,
    '4.8 out of 5 stars',
    'https://example.com/ram-image.jpg',
    'Kingston',
    'HyperX Fury',
    'HX432C16FB3/16',
    JSON_OBJECT(
        'capacity', '16GB',
        'speed', '3200MHz',
        'type', 'DDR4',
        'voltage', '1.35V'
    )
);

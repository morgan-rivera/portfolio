-- users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    bio VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Plants database (master list) -- must come before user_plants
CREATE TABLE IF NOT EXISTS plants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100),
    watering_frequency INT NOT NULL,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
    sunlight VARCHAR(100),
    size ENUM('Small', 'Medium', 'Large'),
    description TEXT,
    image_url VARCHAR(255),
    is_public BOOLEAN DEFAULT FALSE
);

-- user plants (junction table - depends on both users and plants)
CREATE TABLE IF NOT EXISTS user_plants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plant_id INT NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_plant (user_id, plant_id)
);

-- users plant's tasks
CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_plant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    frequency VARCHAR(50),
    description TEXT,
    is_complete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_plant_id) REFERENCES user_plants(id) ON DELETE CASCADE
);

-- users plant's photos
CREATE TABLE IF NOT EXISTS photos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_plant_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_plant_id) REFERENCES user_plants(id) ON DELETE CASCADE
);

-- schedule table
CREATE TABLE IF NOT EXISTS schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plant_id INT NOT NULL,
    plant_name VARCHAR(100) NOT NULL,
    task VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);
create database myntra;
use myntra;
create table products
(product_id int auto_increment primary key,
start_price float,
end_price float,
name varchar(100),
image_URL VARCHAR(255),
description varchar(50),
rating float(50),
type enum('men','women'),
is_active BOOLEAN DEFAULT 1,
created_at datetime default current_timestamp,
updated_at datetime on update current_timestamp,
size_id int,
foreign key(size_id) references sizes(size_id)
);


create table users
(user_id int auto_increment primary key,
name varchar(50),
email varchar(50) not null,
password varchar(50) not null,
gender enum('men','women'),
is_active boolean default(1),
created_at datetime default current_timestamp,
updated_at datetime on update current_timestamp
);

create table sizes (
  size_id int auto_increment primary key,
  size_name varchar(50),
  is_active BOOLEAN DEFAULT 1
);
create table wishlists
(wishlists_id int auto_increment primary key,
quantity INT,
user_id int,
foreign key (user_id) references users(user_id),
product_id int,
foreign key (product_id) references products(product_id),
is_active BOOLEAN DEFAULT 1,
created_at datetime DEFAULT CURRENT_TIMESTAMP,
updated_at datetime ON UPDATE CURRENT_TIMESTAMP
);



-- Insert data into sizes table
use myntra;
INSERT INTO sizes (size_name) VALUES
('Small'),
('Medium'),
('Large'),
('XL'),
('XXL');
select * from sizes;

-- Insert data into users table
use myntra;
INSERT INTO users (name, email, password, gender) VALUES
('John Doe', 'john@example.com', 'password123', 'men'),
('Jane Doe', 'jane@example.com', 'securepass', 'women'),
('Alice Smith', 'alice@example.com', 'pass123', 'women'),
('Bob Johnson', 'bob@example.com', 'testpass', 'men');
select * from users;


use myntra;
INSERT INTO products (start_price, end_price, name, image_URL, description, rating, type, size_id)
VALUES
(29.99, 59.99, 'Men\'s T-Shirt', 'tshirt_image.jpg', 'Comfortable cotton T-shirt', 4.5, 'men', 1),
(39.99, 79.99, 'Women\'s Jeans', 'jeans_image.jpg', 'Stretchable denim jeans', 4.2, 'women', 3),
(49.99, 99.99, 'Men\'s Sneakers', 'sneakers_image.jpg', 'Stylish casual sneakers', 4.0, 'men', 2),
(59.99, 119.99, 'Women\'s Dress', 'dress_image.jpg', 'Elegant evening dress', 4.8, 'women', 4);
select * from products;

-- Insert data into wishlists table
use myntra;
INSERT INTO wishlists (quantity, user_id, product_id) VALUES
(2, 1, 1), -- John Doe added 2 Men's T-Shirts to wishlist
(1, 2, 2), -- Jane Doe added 1 Women's Jeans to wishlist
(3, 3, 3), -- Alice Smith added 3 Men's Sneakers to wishlist
(1, 4, 4); -- Bob Johnson added 1 Women's Dress to wishlist
select * from wishlists;


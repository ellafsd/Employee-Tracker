-- Use the database created
\c employee_db;

-- Insert data into department table
INSERT INTO department (name) VALUES 
('Sales'), 
('Engineering'), 
('Finance'),
('Legal');

-- Insert data into role table
INSERT INTO role (title, salary, department_id) VALUES 
('Sales Lead', 75000, 1),
('Salesperson', 60000, 1),
('Lead Engineer', 150000, 2),
('Engineer', 120000, 2),
('Accountant Lead', 85000, 3), 
('Accountant', 80000, 3), 
('Legal Team Lead', 250000, 4),
('Lawyer', 120000, 4);

-- Insert data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Mila', 'Oz', 1, NULL),   --Sales Lead
('John', 'Doe', 2, 1),     --Salesperson
('Jane', 'Wu', 3, NULL),   --Lead Engineer
('Mike', 'Chan', 4, 3),    --Engineer
('Alice', 'Xiu', 5, NULL),   --Accountant Lead
('Bob', 'Dwyer', 6, 5),       --Accountant
('Melanie', 'Doe', 7, NULL),  --Legal Team Lead
('Sarah', 'Byran', 8, 7)      --Lawyer

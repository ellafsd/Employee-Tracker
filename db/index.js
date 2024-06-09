const pool = require('./connection');

class DB {
    constructor() {}

    async query(sql, args = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, args);
            return result;
        }   finally {
            client.release();
        }
    }
    //Find all employees, join with roles and departments to display their roles, salaries, department and ID
    findAllEmployees() {
        return this.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS departments");
    
    }
    // Find all employees except the given employee id
    findAllEmployeesNoID() {
        return this.query(
            "SELECT FROM employees WHERE id IS NULL OR id =''"
        )
    }


//displays all departments
    viewAllDepartments() {
        return this.query(
            "SELECT * FROM department;"
        )
    }
//displays all roles
    viewAllRoles() {
        return this.query(
            "SELECT * FROM role;"
        )
    }
//displays all employees
    viewAllEmployees() {
        return this.query(
            "SELECT * FROM employees;"
        )
    }
//adds a new department into the tracker
    addDepartment(department_name) {
        return this.query(
            "INSERT INTO department (department_name) VALUES ($1);",[department_name]
        )
    }
    //adds a new role into the tracker
    addRole(role, salary, department_id) {
        return this.query(
            "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);",[role, salary, department_id]
        )
        
    }
//adds a new employee into the tracker
    addEmployee(first_name, last_name, role_id, manager_id) {
        return this.query(
            "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);",[first_name, last_name, role_id, manager_id]
        );
    }
//updates the employee's role to another
    updateEmployeeRole(update, role) {
        return this.query(
            "UPDATE employees SET role_id = $2 WHERE id = $1;",[update, role]
        )
    }
//updates the employee to another manager
    updateEmployeeManager(employee, manager) {
        return this.query(
            "UPDATE employees SET manager_id = $2 WHERE id = $1;",[employee, manager]
        )
    }
//views the managers for each employee
    viewEmployeeManager(manager_id) {
        return this.query(
            "SELECT first_name, last_name, manager_id FROM employees WHERE manager_id = $1;",[manager_id]
        )
    }
//views the departments for each employee
    viewEmployeeDepartment(department_id) {
        return this.query(
            "SELECT first_name, last_name, department_name FROM employees JOIN role ON employees.id = role.id JOIN department ON role.department_id = department.department_id WHERE department.department_id = $1;",[department_id]
        )
    }
//deletes an employee from the tracker
    removeEmployees(employee) {
        return this.query(
            "DELETE FROM employees WHERE id = $1;",[employee]
        )
    }
//deletes a role from the tracker
    removeRole(role) {
        return this.query(
            "DELETE FROM role WHERE id = $1;",[role]
        )
    }    
//deletes a department from the tracker
    removeDepartment(department) {
        return this.query(
            "DELETE FROM department WHERE department_id =$1;",[department]
        )
    }
//views the total budget in each department
    viewBudget() {
        return this.query(
            "SELECT department.department_id, department.department_name, SUM(role.salary) AS utilized_budget FROM employees JOIN role ON employees.role_id = role.id JOIN department on role.department_id = department.department_id GROUP BY department.department_id, department.department_name;"
        )
    }

}

module.exports = new DB();
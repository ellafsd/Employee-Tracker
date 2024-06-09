const inquirer = require("inquirer");
const db = require("./db");
const pool = require("./db/connection");
const { Pool } = require("pg");

const dbConnection = new Pool({
  // TODO: Enter PostgreSQL username
  user: "postgres", // TODO: Enter PostgreSQL password
  password: "rootroot",
  host: "localhost",
  database: "employee_db",
});

dbConnection.connect();

const questions = [
  {
    type: "list",
    name: "options",
    message: "What would you like to do:",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
];

function mainQuestion() {
  inquirer.prompt(questions).then((answers) => {
    switch (answers.options) {
      case "View All Employees":
        let employeeQuery =
        ` SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title AS role_title, 
        department.name AS department_name, 
        employee.manager_id 
      FROM employee 
      LEFT JOIN role ON employee.role_id = role.id 
      LEFT JOIN department ON role.department_id = department.id`;
        dbConnection.query(employeeQuery, (err, { rows }) => {
          if (err) {
            console.log(err);
          }
          console.table(rows);
          mainQuestion();
        });
        break;

        
      case "Add Employee":
        let addEmployeeQuery = "SELECT * FROM employee";
        dbConnection.query(addEmployeeQuery, (err, { rows }) => {
          if (err) {
            console.log(err);
          }
          let employeeArray=rows.map(employee => 
            ({name: employee.first_name + " " + employee.last_name, value: employee.id}));
            if (err) {
              console.log(err);
            }   let roleQuery = "SELECT * FROM role";
            dbConnection.query(roleQuery, (err, {rows}) => {
              if (err) {
                console.log(err);
              }
            
             let roleArray = rows.map(role => 
              ({name: role.title, value: role.id}));
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "Enter the employee's first name:",
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the employee's last name:",
            },
            {
              type: "list",
              name: "roleId",
              message: "What is the employee's role:",
              choices: roleArray,
            },
            {
              type: "list",
              name: "managerId",
              message: "Who is the employee's manager:",
              choices: employeeArray,
            },
          ])
          .then((answers) => {
            let addEmployeeQuery =
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)";
            dbConnection.query(
              addEmployeeQuery,
              [
                answers.firstName,
                answers.lastName,
                answers.roleId,
                answers.managerId,
              ],
              (err, result) => {  // Adjusted error handling
                if (err) {
                  console.log(err);
                } else {
                  console.log("Employee created");
                }
                mainQuestion();
              }
            );
          });
        })
      })
        break;

      case "Update Employee Role":
        let updateEmployeeQuery = "SELECT * FROM employee";
        dbConnection.query(updateEmployeeQuery, (err, { rows }) => {
          if (err) {
            console.log(err);
          }
          let employeeArray=rows.map(employee => 
            ({name: employee.first_name + " " + employee.last_name, value: employee.id}));
            if (err) {
              console.log(err);
            }   let roleQuery = "SELECT * FROM role";
            dbConnection.query(roleQuery, (err, {rows}) => {
              if (err) {
                console.log(err);
              }
            
             let roleArray = rows.map(role => 
              ({name: role.title, value: role.id}));
        inquirer
          .prompt([
            {
              type: "list",
              name: "managerId",
              message: "What is the employee's name?:",
              choices: employeeArray,
            },
            {
              type: "list",
              name: "roleId",
              message: "What is the employee's new role:",
              choices: roleArray,
            },
          ])
          .then((answers) => {
            let addEmployeeQuery =
              "UPDATE employee SET role_id = $1 WHERE id = $2";
            dbConnection.query(
              addEmployeeQuery,
              [
                answers.roleId,
                answers.managerId,
              ],
              (err, result) => {  // Adjusted error handling
                if (err) {
                  console.log(err);
                } else {
                  console.log("Employee updated");
                }
                mainQuestion();
              }
            );
          });
        })
      })
        break;

      case "View All Roles":
        let roleQuery = "SELECT * FROM role";
        dbConnection.query(roleQuery, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const { rows } = result;  
            console.table(rows);
          }
          mainQuestion();
        });
        break;


      case "Add Role":
        dbConnection.query("SELECT name FROM department", (err, { rows }) => {
          if (err) {
            console.log(err);
            return;
          }
          const departmentChoices = rows.map(department => department.name);
        inquirer
          .prompt([
            {
              type: "input",
              name: "title",
              message: "What is the name of the new role:",
            },
            {
              type: "input",
              name: "salary",
              message: "Enter the salary for the new role:",
              validate: input => !isNaN(input) || "Salary must be a number"
            },
            {
              type: "list",
              name: "departmentName",
              message: "Which department does the role belong to?:",
              choices: departmentChoices,
            }
          ])
          .then((answers) => {
            // Use a subquery to find the department ID based on the selected name
            let addRoleQuery = `
              INSERT INTO role (title, salary, department_id)
              VALUES ($1, $2, (SELECT id FROM department WHERE name = $3))
            `;
            dbConnection.query(addRoleQuery, [answers.title, answers.salary, answers.departmentName], (err, result) => {
              if (err) {
                console.error("Error adding role:", err);
              } else {
                console.log("Role added successfully.");
                mainQuestion();
                }
              });
           });
         });
        break;



      case "View All Departments":
        let departmentsQuery = "SELECT * FROM department";
        dbConnection.query(departmentsQuery, (err, { rows }) => {
          if (err) {
            console.log(err);
          } else {
            console.table(rows);
            mainQuestion();
          }
        });
        break;

      case "Add Department":
        inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "Enter the name for the new department:",
            },
          ])
          .then((answers) => {
            const addDepartmentQuery =
              "INSERT INTO department (name) VALUES ($1)";
            dbConnection.query(addDepartmentQuery, [answers.name], (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Department added");
                mainQuestion();
              }
            });
          });
        break;

        case "Quit":
          console.log("Goodbye!");  // Print goodbye message
          process.exit();  // Exit the process
          break;
      

      default:
        console.error("Invalid choice");
        return;
    }
  });
}

mainQuestion();

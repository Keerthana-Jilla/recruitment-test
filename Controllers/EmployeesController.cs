using InterviewTest.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public EmployeesController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        [HttpGet]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();
            try
            {
                //  var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
                using (var connection = new SqliteConnection(_configuration.GetConnectionString("EmployeeAppCon")))
                {
                    connection.Open();
                    var queryCmd = connection.CreateCommand();
                    queryCmd.CommandText = @"SELECT ID, Name, Value FROM Employees";
                    using (var reader = queryCmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            employees.Add(new Employee
                            {
                                ID = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                Value = reader.GetInt32(2)
                            }); ;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return new List<Employee>();
            }

            return employees;
        }


        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            try
            {
                using (var connection = new SqliteConnection(_configuration.GetConnectionString("EmployeeAppCon")))
                {
                    connection.Open();
                    var deleteEmployeeCmd = connection.CreateCommand();
                    deleteEmployeeCmd.CommandText = "DELETE FROM Employees WHERE ID=" + id + "";
                    deleteEmployeeCmd.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                return new JsonResult("There is some issue with the server. Please try again");
            }
            return new JsonResult("Deleted Employee Successfully");
        }

        [HttpPost]
        public JsonResult Insert(Employee emp)
        {
            int rowCount = 0;
            string responseMessage = string.Empty;
            try
            {
                using (var connection = new SqliteConnection(_configuration.GetConnectionString("EmployeeAppCon")))
                {
                    connection.Open();
                    var insertEmployeeCmd = connection.CreateCommand();
                    string query = @"INSERT INTO Employees (Name,Value)
                    VALUES('" + emp.Name + "'," + emp.Value + ")";
                    insertEmployeeCmd.CommandText = query;
                    insertEmployeeCmd.ExecuteNonQuery();

                    string updValQuery = @"UPDATE Employees SET Value= CASE WHEN UPPER(Name) LIKE 'E%' THEN (Value + 1) WHEN UPPER(Name)" +
                        " LIKE 'G%' THEN(Value + 10) ELSE (Value + 100) END WHERE UPPER(Name) LIKE @nameBeginsWith";
                    insertEmployeeCmd.Parameters.AddWithValue("@nameBeginsWith", emp.Name.Substring(0, 1) + "%");
                    insertEmployeeCmd.CommandText = updValQuery;
                    rowCount = Convert.ToInt32(insertEmployeeCmd.ExecuteNonQuery());
                }
                if (rowCount > 0)
                {
                    switch (emp.Name.Substring(0, 1).ToUpper())
                    {
                        case "K":
                            responseMessage = "Total number of records incremented by 1 are " + rowCount;
                            break;
                        case "A":
                            responseMessage = "Total number of records incremented by 10 are " + rowCount;
                            break;
                        default:
                            responseMessage = "Total number of records incremented by 100 are " + rowCount;
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult("There is some issue with the server. Please try again");
            }
            return new JsonResult(responseMessage);

        }

        [HttpPut]
        public JsonResult Update(Employee emp)
        {
            int rowCount = 0;
            string responseMessage = string.Empty;
            try
            {
                using (var connection = new SqliteConnection(_configuration.GetConnectionString("EmployeeAppCon")))
                {
                    connection.Open();
                    var updateEmployeeCmd = connection.CreateCommand();
                    string query = @"
                    UPDATE Employees SET 
                    Name = '" + emp.Name + @"',
                    Value = '" + emp.Value + @"'
                    WHERE ID = " + emp.ID + @"";
                    updateEmployeeCmd.CommandText = query;
                    updateEmployeeCmd.ExecuteNonQuery();

                    string updValQuery = @"UPDATE Employees SET Value= CASE WHEN UPPER(Name) LIKE 'E%' THEN (Value + 1) WHEN UPPER(Name)" +
                        " LIKE 'G%' THEN(Value + 10) ELSE (Value + 100) END WHERE UPPER(Name) LIKE @nameBeginsWith";
                    updateEmployeeCmd.Parameters.AddWithValue("@nameBeginsWith", emp.Name.Substring(0, 1) + "%");
                    updateEmployeeCmd.CommandText = updValQuery;
                    rowCount = Convert.ToInt32(updateEmployeeCmd.ExecuteNonQuery());
                }
                if (rowCount > 0)
                {
                    switch (emp.Name.Substring(0, 1).ToUpper())
                    {
                        case "K":
                            responseMessage = "Total number of records incremented by 1 are " + rowCount;
                            break;
                        case "A":
                            responseMessage = "Total number of records incremented by 10 are " + rowCount;
                            break;
                        default:
                            responseMessage = "Total number of records incremented by 100 are " + rowCount;
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult("There is some issue with the server. Please try again");
            }
            return new JsonResult(responseMessage);
        }


    }
}

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Data;
using InterviewTest.Model;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        public ListController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        [HttpGet]
        public List<SumList> GetSumData()
        {
            var lst = new List<SumList>();
            using (var connection = new SqliteConnection(_configuration.GetConnectionString("EmployeeAppCon")))
            {
                connection.Open();
                var queryCmd = connection.CreateCommand();
                string query = @"
                               SELECT NameBeginsWith,SUM(Value) AS Sum, 
                               'Sum of all the Values that Name begins with '||NameBeginsWith ||': '||SUM(Value) AS SumText
                               FROM (SELECT SUBSTR(UPPER(Name),1,1) AS NameBeginsWith ,Value
                               FROM Employees WHERE UPPER(Name) LIKE 'A%' OR UPPER(NAME) LIKE 'B%' OR UPPER(NAME) LIKE 'C%'
                               OR UPPER(NAME) LIKE 'K%' OR UPPER(NAME) LIKE 'Y%' ) t
                               GROUP BY NameBeginsWith";
                queryCmd.CommandText = query;
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        lst.Add(new SumList
                        {
                            SumText = reader.GetString(2)
                        }); ;
                    }
                }
            }
            return lst;
        }
    }
}

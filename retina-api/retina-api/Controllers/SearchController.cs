using retina_api.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace retina_api.Controllers
{
    public class SearchController : ApiController
    {
        [HttpGet]
        public IHttpActionResult search(string status, int userID, string type, string searchType)
        {
            if (status == "") { status = null; }
            if (type == "") { status = null; }
            if (searchType == "") { searchType = null; }

            SqlConnection myConnection = new DBConnector().newConnection;
            myConnection.Open();

            SqlCommand cmd;
            if (searchType == "toolboxsearch")
            {
                cmd = new SqlCommand("?????", myConnection);
            }
            else
            {
                cmd = new SqlCommand("??????", myConnection);
            }

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Status", status);
            cmd.Parameters.AddWithValue("@UserID", userID);
            cmd.Parameters.AddWithValue("@Type", type);

            SqlDataReader myReader = cmd.ExecuteReader();

            List<Tool> toolList = new List<Tool>();

            while (myReader.Read())
            {
                toolList.Add(new Tool(myReader));
            }

            myConnection.Close();

            return Ok(new { data = toolList });
            
    
        }
    }
}

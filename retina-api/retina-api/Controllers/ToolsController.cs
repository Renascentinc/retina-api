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

    public class ToolsController : ApiController
    {
        
      
        [HttpGet]
        public IHttpActionResult GetbyID(int id)
        {
            try
            {
                SqlConnection myConnection = new DBConnector().newConnection;
                myConnection.Open();

                SqlCommand cmd = new SqlCommand("testproc", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ToolID", id);

                SqlDataReader myReader = cmd.ExecuteReader();

                Tool tool = null;
                while (myReader.Read())
                {
                    tool = new Tool((IDataRecord)myReader);
                }

                myConnection.Close();
                    
                return Ok( new { data = tool } );

            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }

        [HttpPost]
        public IHttpActionResult addTool(Tool tool)
        {
            return Ok();
        }

    }
}

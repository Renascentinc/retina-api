using Newtonsoft.Json.Linq;
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

                SqlCommand cmd = new SqlCommand("tool_details", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ToolID", id);

                SqlDataReader myReader = cmd.ExecuteReader();

                Tool tool = null;
                while (myReader.Read())
                {
                    tool = new Tool(myReader);
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
        public IHttpActionResult addTool(JObject toolData)
        {
            
            try
            {
                SqlConnection myConnection = new DBConnector().newConnection;
                myConnection.Open();

                SqlCommand cmd = new SqlCommand("add_tool", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Type", (string)toolData["type"]);
                cmd.Parameters.AddWithValue("@Brand", (string)toolData["brand"]);
                cmd.Parameters.AddWithValue("@PurchasedFrom", ((string)toolData["purchasedfrom"] != "") ? (string)toolData["purchasedfrom"] : null );
                cmd.Parameters.AddWithValue("@Price", ((string)toolData["price"] != "") ? (string)toolData["price"] : null);
                cmd.Parameters.AddWithValue("@ModelNumber", (string)toolData["modelnumber"]);
                cmd.Parameters.AddWithValue("@Status", (string)toolData["status"]);
                cmd.Parameters.AddWithValue("@SerialNumber", (string)toolData["serialnumber"]);
                cmd.Parameters.AddWithValue("@Date", ((string)toolData["purchasedate"] != "") ? (string)toolData["purchasedate"] : null );
                cmd.Parameters.AddWithValue("@UserID", (int)toolData["userid"]);
               

                SqlDataReader toolReader = cmd.ExecuteReader();

                Tool tool = null;
                while (toolReader.Read())
                {
                    tool = new Tool(toolReader);
                }

                myConnection.Close();
               
                return Ok(tool);
            }
            catch (Exception e)
            {
                return Ok(e);
            }
            

        }

    }
}

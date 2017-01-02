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
            {/*
                SqlConnection myConnection = new DBConnector().newConnection;
                myConnection.Open();

                SqlCommand cmd = new SqlCommand("???", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Type", (string)toolData.type);
                cmd.Parameters.AddWithValue("@Brand", (string)toolData.brand);
                cmd.Parameters.AddWithValue("@PurchasedFrom", (string)toolData.purchasedfrom);
                cmd.Parameters.AddWithValue("@Price", (string)toolData.price);
                cmd.Parameters.AddWithValue("@ModelNumber", (string)toolData.modelnumber);
                cmd.Parameters.AddWithValue("@Status", (string)toolData.status);

                cmd.ExecuteNonQuery();
                myConnection.Close();
               */
                return Ok(toolData);
            }
            catch (Exception e)
            {
                return Ok(e);
            }

        }

    }
}

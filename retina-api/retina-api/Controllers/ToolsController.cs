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

        public dynamic getToolByID(int toolID)
        {
            try
            {

                DBConnector myConnector = new DBConnector();
                SqlCommand getToolCommand = myConnector.newProcedure("tool_details");

                getToolCommand.Parameters.AddWithValue("@ToolID", toolID);

                SqlDataReader myReader = getToolCommand.ExecuteReader();

                Tool tool = null;
                while (myReader.Read())
                {
                    tool = new Tool(myReader);
                }

                myConnector.closeConnection();

                return (new { data = tool });

            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }


        [HttpGet]
        public IHttpActionResult GetbyID(int id)
        {
            try
            {

                DBConnector myConnector = new DBConnector();
                SqlCommand getToolCommand = myConnector.newProcedure("tool_details");

                getToolCommand.Parameters.AddWithValue("@ToolID", id);

                SqlDataReader myReader = getToolCommand.ExecuteReader();

                Tool tool = null;
                while (myReader.Read())
                {
                    tool = new Tool(myReader);
                }

                myConnector.closeConnection();

                return Ok(new { data = tool });

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

                DBConnector myConnector = new DBConnector();

                SqlCommand addToolCommand = myConnector.newProcedure("add_tool");

                JObject attributes = (JObject)toolData["data"]["attributes"];

                addToolCommand.Parameters.AddWithValue("@Type", (string)attributes["type"]);
                addToolCommand.Parameters.AddWithValue("@Brand", (string)attributes["brand"]);
                addToolCommand.Parameters.AddWithValue("@ModelNumber", (string)attributes["modelnumber"]);
                addToolCommand.Parameters.AddWithValue("@Status", (string)attributes["status"]);
                addToolCommand.Parameters.AddWithValue("@SerialNumber", (string)attributes["serialnumber"]);
                addToolCommand.Parameters.AddWithValue("@UserID", (int)attributes["userid"]);

                //The following adds optional values to the query. If the value given is null or "", convert it to
                //DBNull.Value. Else, insert it into query.
                JToken purchasedfrom = attributes["purchasedfrom"];
                if ((string)purchasedfrom == "" || purchasedfrom == null)
                {
                    addToolCommand.Parameters.AddWithValue("@PurchasedFrom", DBNull.Value);
                }
                else
                {
                    addToolCommand.Parameters.AddWithValue("@PurchasedFrom", (string)purchasedfrom);
                }

                JToken price = attributes["price"];
                if ((string)price == "" || price == null)
                {
                    addToolCommand.Parameters.AddWithValue("@Price", DBNull.Value);
                }
                else
                {
                    addToolCommand.Parameters.AddWithValue("@Price", (float)price);
                }


                JToken purchasedate = attributes["purchasedate"];
                if ((string)purchasedate == "" || purchasedate == null)
                {
                    addToolCommand.Parameters.AddWithValue("@Date", DBNull.Value);
                }
                else
                {
                    addToolCommand.Parameters.AddWithValue("@Date", (string)purchasedate);
                }

                JToken year = attributes["year"];
                if ((string)year == "" || (string)year == null)
                {
                    addToolCommand.Parameters.AddWithValue("@Year", DBNull.Value);
                }
                else
                {
                    addToolCommand.Parameters.AddWithValue("@Year", (int)year);
                }


                SqlDataReader toolReader = addToolCommand.ExecuteReader();

                Tool tool = null;
                while (toolReader.Read())
                {
                    tool = new Tool(toolReader);
                }

                myConnector.closeConnection();

                return Ok(new { data = tool });

            }
            catch (Exception e)
            {
                return Ok(e);
            }


        }

        [HttpPatch]
        public IHttpActionResult updateStatus(JObject statusInfo, int id)
        {
            //The commented out code here is template code for token verification that i didn't want to delete
            //even though it isn't actively being used

            //int? userID = new TokenController().verifyToken((string)(statusInfo["authentication"]));

            // if (userID != null)
            // {
            try
            {
                DBConnector myConnector = new DBConnector();

                SqlCommand statusCommand = myConnector.newProcedure("change_status");
                statusCommand.Parameters.AddWithValue("@Status", (string)statusInfo["data"]["attributes"]["status"]);
                statusCommand.Parameters.AddWithValue("@ToolID", (int)statusInfo["data"]["id"]);

                SqlDataReader statusReader = statusCommand.ExecuteReader();

                Tool tool = null;
                while (statusReader.Read())
                {
                    tool = new Tool(statusReader);
                }

                myConnector.closeConnection();

                return Ok(new { data = tool });
            }
            catch (Exception e)
            {
                return Ok(e);
            }
            //}else
            //{
            //      return Unauthorized();
            // }
        }
    }
}

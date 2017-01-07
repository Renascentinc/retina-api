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

                DBConnector myConnector = new DBConnector();


                //Begin Add tool
                SqlCommand addToolCommand = myConnector.newProcedure("add_tool");

                JObject attributes = (JObject)toolData["data"]["attributes"];

                addToolCommand.Parameters.AddWithValue("@Type", (string)attributes["type"]);
                addToolCommand.Parameters.AddWithValue("@Brand", (string)attributes["brand"]);
                addToolCommand.Parameters.AddWithValue("@ModelNumber", (string)attributes["modelnumber"]);
                addToolCommand.Parameters.AddWithValue("@Status", (string)attributes["status"]);
                addToolCommand.Parameters.AddWithValue("@SerialNumber", (string)attributes["serialnumber"]);
                addToolCommand.Parameters.AddWithValue("@UserID", (int)attributes["userid"]);

                JToken purchasedfrom = attributes["purchasedfrom"];
                if ((string)purchasedfrom == "" || purchasedfrom == null)
                {
                    addToolCommand.Parameters.AddWithValue("@PurchasedFrom", DBNull.Value);
                }else
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
                }else
                {
                    addToolCommand.Parameters.AddWithValue("@Date", (string)purchasedate);
                }
                            
                SqlDataReader toolReader = addToolCommand.ExecuteReader();
                
                Tool tool = null;
                while (toolReader.Read())
                {
                    tool = new Tool(toolReader);
                }
                
                myConnector.closeConnection();
                //End add tool


                //Begin create transaction
                myConnector = new DBConnector();

                SqlCommand transactionCommand = myConnector.newProcedure("add_transaction");
                transactionCommand.Parameters.AddWithValue("@UserID", (int)attributes["userid"]);

                SqlDataReader transactionIDReader = transactionCommand.ExecuteReader();

                int transactionID = 0;
                while (transactionIDReader.Read())
                {
                    transactionID = (int)(((IDataRecord)transactionIDReader)["TransactionID"]);
                }

                myConnector.closeConnection();
                //End create transaction


                //Begin give transaction a tool
                myConnector = new DBConnector();

                SqlCommand toolTransactionCommand = myConnector.newProcedure("add_tool_transaction");
                toolTransactionCommand.Parameters.AddWithValue("@TransactionID", transactionID);
                toolTransactionCommand.Parameters.AddWithValue("@ToolID", tool.id);
                toolTransactionCommand.Parameters.AddWithValue("@Status", tool.attributes.status);
                toolTransactionCommand.ExecuteNonQuery();

                myConnector.closeConnection();
                //End give transaction a tool

                return Ok(new { data = tool });
            }
            catch (Exception e)
            {
                return Ok(e);
            }
            

        }

    }
}

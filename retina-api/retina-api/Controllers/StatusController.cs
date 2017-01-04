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
    public class StatusController : ApiController
    {
        [HttpGet]
        public IHttpActionResult getStatus()
        {

            try
            {

                List<string> uniqueStrings = new UniqueNames("select_status").getUniqueStrings("Status");
                return Ok(new { status = uniqueStrings });

            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }

        [HttpPut]
        public IHttpActionResult updateStatus(JObject statusInfo)
        {
            int? userID = new TokenController().verifyToken((string)(statusInfo["authentication"]));

            if (userID != null)
            {
                try
                {
                    DBConnector myConnector = new DBConnector();

                    SqlCommand statusCommand = myConnector.newProcedure("update_tool_status");
                    statusCommand.Parameters.AddWithValue("@Status", (string)statusInfo["data"]["status"]);
                    statusCommand.Parameters.AddWithValue("@ToolID", (int)statusInfo["data"]["toolid"]);
                    statusCommand.ExecuteNonQuery();

                    myConnector.closeConnection();

                    myConnector = new DBConnector();

                    SqlCommand transactionCommand = myConnector.newProcedure("add_transaction");
                    transactionCommand.Parameters.AddWithValue("@UserID", userID);

                    SqlDataReader transactionIDReader = transactionCommand.ExecuteReader();

                    int transactionID = 0;
                    while (transactionIDReader.Read())
                    {
                        transactionID = (int)(((IDataRecord)transactionIDReader)["TransactionID"]);
                    }

                    myConnector.closeConnection();

                    myConnector = new DBConnector();

                    SqlCommand toolTransactionCommand = myConnector.newProcedure("add_tool_transaction");
                    toolTransactionCommand.Parameters.AddWithValue("@TransactionID", transactionID);
                    toolTransactionCommand.Parameters.AddWithValue("@ToolID", (int)statusInfo["data"]["toolid"]);
                    toolTransactionCommand.ExecuteNonQuery();

                    myConnector.closeConnection();

                    return Ok();
                }catch(Exception e)
                {
                    return Ok(e);
                }
            }else
            {
                return Unauthorized();
            }


            
        }
    }
}

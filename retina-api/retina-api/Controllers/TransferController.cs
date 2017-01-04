using Newtonsoft.Json.Linq;
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
    public class TransferController : ApiController
    {
        
        [HttpPut]
        public IHttpActionResult transfer(JObject toolTransferInfo)
        {
            try
            {
                DBConnector myConnector = new DBConnector();

                SqlCommand transactionIDCmd = myConnector.newProcedure("add_transaction");
                transactionIDCmd.Parameters.AddWithValue("@UserID", (string)toolTransferInfo["data"]["userid"]);

                SqlDataReader transactionIDReader = transactionIDCmd.ExecuteReader();
                int transactionID = 0;
                while (transactionIDReader.Read())
                {
                    transactionID = (int)(((IDataRecord)transactionIDReader)["TransactionID"]);
                }

                myConnector.closeConnection();

                
                using (SqlConnection connection = new DBConnector().newConnection)
                {
                    connection.Open();

                    foreach (int toolID in toolTransferInfo["data"]["toolids"])
                    {

                        SqlCommand toolTransactionCommand = new SqlCommand("add_tool_transaction", connection);
                        toolTransactionCommand.CommandType = CommandType.StoredProcedure;

                        toolTransactionCommand.Parameters.AddWithValue("@TransactionID", transactionID);
                        toolTransactionCommand.Parameters.AddWithValue("@ToolID", toolID);

                        string status = new ToolsController().getToolByID(toolID).data.attributes.status;
                        toolTransactionCommand.Parameters.AddWithValue("@Status", status);
                        toolTransactionCommand.ExecuteNonQuery();


                    }
                    connection.Close();
                }
                

                myConnector = new DBConnector();

                foreach (int toolID in toolTransferInfo["data"]["toolids"]) {
                    SqlCommand updateToolCommand = myConnector.newProcedure("update_tool");
                    updateToolCommand.Parameters.AddWithValue("@UserID", (string)toolTransferInfo["data"]["userid"]);
                    updateToolCommand.Parameters.AddWithValue("@ToolID", toolID);
                    updateToolCommand.ExecuteNonQuery();
                }

                myConnector.closeConnection();

                return Ok();
            }catch (Exception e)

            {
                return Ok(e); 
            }
        }


    }
}

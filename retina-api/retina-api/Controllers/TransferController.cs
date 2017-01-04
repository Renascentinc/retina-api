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

                myConnector = new DBConnector();

                foreach (int toolID in toolTransferInfo["data"]["toolids"])
                {
                    SqlCommand toolTransactionCommand = myConnector.newProcedure("add_tool_transaction");
                    toolTransactionCommand.Parameters.AddWithValue("@TransactionID", transactionID);
                    toolTransactionCommand.Parameters.AddWithValue("@ToolID", toolID);
                    toolTransactionCommand.ExecuteNonQuery();
                }

                myConnector.closeConnection();

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

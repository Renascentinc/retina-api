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
        public IHttpActionResult transfer(dynamic toolTransferInfo)
        {
            try
            {
                SqlConnection myConnection = new DBConnector().newConnection;
                myConnection.Open();

                SqlCommand transactionIDCmd = new SqlCommand("??????", myConnection);
                transactionIDCmd.CommandType = CommandType.StoredProcedure;

                transactionIDCmd.Parameters.AddWithValue("@UserID", (string)toolTransferInfo.userid);

                SqlDataReader transactionIDReader = transactionIDCmd.ExecuteReader();
                int transactionID = 0;
                while (transactionIDReader.Read())
                {
                    transactionID = (int)(((IDataRecord)transactionIDReader)["@TransactionID"]);
                }

                foreach (int toolID in toolTransferInfo.toolids)
                {
                    SqlCommand cmd = new SqlCommand("??????", myConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@TransactionID", transactionID );
                    cmd.Parameters.AddWithValue("@ToolID", toolID);
                    cmd.ExecuteNonQuery();
                }
               
                myConnection.Close();

                return Ok();
            }catch (Exception e)

            {
                return Ok(e); 
            }
        }


    }
}

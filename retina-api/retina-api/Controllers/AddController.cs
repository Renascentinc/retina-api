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
    public class AddController : ApiController
    {
        [HttpPost]
        public IHttpActionResult addTool(dynamic toolData)
        {

            try
            {
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

                return Ok();
            }
            catch (Exception e)
            {
                return Ok(e);
            }

        }
    }
}

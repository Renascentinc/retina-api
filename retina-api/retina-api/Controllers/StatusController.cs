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

        [HttpPatch]
        public IHttpActionResult updateStatus(JObject statusInfo)
        {
            //The commented out code here is template code for token verification that i didn't want to delete,
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

                    SqlDataReader statusReader =  statusCommand.ExecuteReader();

                    Tool tool = null;
                    while (statusReader.Read())
                    {
                        tool = new Tool(statusReader);
                    }

                    myConnector.closeConnection();

                    return Ok(new { data = tool });
                }catch(Exception e)
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

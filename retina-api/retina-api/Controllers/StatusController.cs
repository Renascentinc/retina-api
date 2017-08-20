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

        [HttpDelete]
        public IHttpActionResult DeleteStatus(JObject status_obj){
            try
            {
                DBConnector db_connector = new DBConnector();
                SqlCommand delete_status_command = db_connector.newProcedure("delete_status");

                delete_status_command.Parameters.AddWithValue("@Status", (string)status_obj["status"]);

                delete_status_command.ExecuteNonQuery();
                db_connector.closeConnection();
                return Ok();
            }
            catch (Exception e)
            {
                return Ok(e);   
            }
        }

		[HttpPatch]
		public IHttpActionResult UpdateStatus(JObject status_obj)
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand update_status_command = db_connector.newProcedure("update_status");

				update_status_command.Parameters.AddWithValue("@OldStatus", (string)status_obj["oldstatus"]);
                update_status_command.Parameters.AddWithValue("@NewStatus", (string)status_obj["newstatus"]);

				update_status_command.ExecuteNonQuery();
				db_connector.closeConnection();
				return Ok();
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}

		[HttpPost]
		public IHttpActionResult AddStatus(JObject status_obj)
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand add_status_command = db_connector.newProcedure("add_status");

				add_status_command.Parameters.AddWithValue("@Status", (string)status_obj["status"]);

                add_status_command.ExecuteNonQuery();
                db_connector.closeConnection();

                return Ok();
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}
    }
}

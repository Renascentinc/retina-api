using retina_api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;

namespace retina_api.Controllers
{
    public class TypesController : ApiController
    {
        [HttpGet]
        public IHttpActionResult getTypes()
        {
            try
            {
                List<string> uniqueStrings = new UniqueNames("select_type").getUniqueStrings("Type");
                return Ok(new { types = uniqueStrings });

            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }


		[HttpDelete]
		public IHttpActionResult DeleteType(JObject type_obj)
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand delete_type_command = db_connector.newProcedure("delete_type");

				delete_type_command.Parameters.AddWithValue("@Type", (string)type_obj["type"]);

				delete_type_command.ExecuteNonQuery();
				db_connector.closeConnection();
				return Ok();
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}

		[HttpPatch]
		public IHttpActionResult UpdateType(JObject type_obj)
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand update_type_command = db_connector.newProcedure("update_type");

				update_type_command.Parameters.AddWithValue("@OldType", (string)type_obj["oldtype"]);
				update_type_command.Parameters.AddWithValue("@NewType", (string)type_obj["newtype"]);

				update_type_command.ExecuteNonQuery();
				db_connector.closeConnection();
				return Ok();
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}

		[HttpPost]
		public IHttpActionResult AddType(JObject type_obj)
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand add_type_command = db_connector.newProcedure("add_type");

                add_type_command.Parameters.AddWithValue("@Type", (string)type_obj["type"]);

				add_type_command.ExecuteNonQuery();
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

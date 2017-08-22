using retina_api.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json.Linq;

namespace retina_api.Controllers
{
    public class UsersController : ApiController
    {
        [HttpGet]
        public IHttpActionResult GetUsers()
        {
            try
            {
                List<dynamic> uniqueDynamics = new UniqueNames("select_user").getUniqueDynamics();
                return Ok(new { users = uniqueDynamics });
            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }

        [HttpGet]
        public IHttpActionResult GetLimitedUsers(int currentUser)
        {
            try
            {
                UniqueNames limitedUnique = new UniqueNames("select_limited_user");
                limitedUnique.cmd.Parameters.AddWithValue("@CurrentUser", currentUser);

                List<dynamic> limitedUniqueDynamics = limitedUnique.getUniqueDynamics();

                return Ok(new { users = limitedUniqueDynamics });
            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }

        [HttpGet]
        public IHttpActionResult GetUserById(int id)
        {
            try
            {
				DBConnector db_connector = new DBConnector();
				SqlCommand get_user_by_id_command = db_connector.newProcedure("user_details");
				get_user_by_id_command.Parameters.AddWithValue("@UserID", id);

                SqlDataReader user_reader = get_user_by_id_command.ExecuteReader();

                User user = null;
				while (user_reader.Read())
				{
				  user = new User(user_reader);
				}
				
                db_connector.closeConnection();

				return Ok(new { data = user });
			}
            catch (Exception e)
            {
                return Ok(e);
            }
           
        }

        [HttpGet]
        public IHttpActionResult FuzzySearchForUsers(string parameter)
        {
            try 
            {
                DBConnector db_connector = new DBConnector();
                SqlCommand fuzzy_search_command = db_connector.newProcedure("fuzzy_user_search");

				if (parameter != null)
				{
					fuzzy_search_command.Parameters.AddWithValue("@UserName", parameter);
				}
				else
				{
					fuzzy_search_command.Parameters.AddWithValue("@UserName", DBNull.Value);
				}

				SqlDataReader search_reader = fuzzy_search_command.ExecuteReader();

                List<User> user_list = new List<User>();

				while (search_reader.Read())
				{
					user_list.Add(new User(search_reader));
				}

				db_connector.closeConnection();

                return Ok(new { data = user_list });
            } 
            catch (Exception e)
            {
                return Ok(e);
            }
        }

		[HttpPost]
		public IHttpActionResult AddUser(JObject user_data)
		{
			try
			{
				DBConnector db_connector = new DBConnector();

				SqlCommand add_user_command = db_connector.newProcedure("add_user");

				JObject attributes = (JObject)user_data["data"]["attributes"];

				add_user_command.Parameters.AddWithValue("@UserName", (string)attributes["username"]);
				add_user_command.Parameters.AddWithValue("@Password", (string)attributes["password"]);
				add_user_command.Parameters.AddWithValue("@Role", (string)attributes["role"]);
				add_user_command.Parameters.AddWithValue("@PhoneNumber", (string)attributes["phonenumber"]);
				add_user_command.Parameters.AddWithValue("@Email", (string)attributes["email"]);

				SqlDataReader user_reader = add_user_command.ExecuteReader();

				User user = null;
				while (user_reader.Read())
				{
					user = new User(user_reader);
				}

				db_connector.closeConnection();

				return Ok(new { data = user });
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}


		[HttpPatch]
		public IHttpActionResult UpdateUser(JObject user_data)
		{
			try
			{
				DBConnector db_connector = new DBConnector();

				SqlCommand update_user_command = db_connector.newProcedure("update_user");

				JObject attributes = (JObject)user_data["data"]["attributes"];

				update_user_command.Parameters.AddWithValue("@UserID", (int)user_data["data"]["id"]);
				update_user_command.Parameters.AddWithValue("@UserName", (string)attributes["username"]);
				update_user_command.Parameters.AddWithValue("@Password", (string)attributes["password"]);
				update_user_command.Parameters.AddWithValue("@Role", (string)attributes["role"]);
				update_user_command.Parameters.AddWithValue("@PhoneNumber", (string)attributes["phonenumber"]);
				update_user_command.Parameters.AddWithValue("@Email", (string)attributes["email"]);
	
				SqlDataReader user_reader = update_user_command.ExecuteReader();

				User user = null;
				while (user_reader.Read())
				{
					user = new User(user_reader);
				}

				db_connector.closeConnection();

				return Ok(new { data = user });
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}
    }
}

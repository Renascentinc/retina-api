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
    public class TokenController : ApiController
    {

        private string generateToken()
        {
            
            return "blah";
        }

        [HttpPost]
        public IHttpActionResult login(dynamic requestBody)
        {
            SqlConnection myConnection = new DBConnector().newConnection;
            myConnection.Open();

            SqlCommand cmd = new SqlCommand("authenticate_user", myConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@UserName", requestBody.identification);
            cmd.Parameters.AddWithValue("@Password", requestBody.password);

            SqlDataReader myReader = cmd.ExecuteReader();

            while (myReader.Read())
            {
                
                string userID = ((string)((IDataRecord)myReader)["UserID"]).TrimEnd(' ');

                string token = generateToken();

                SqlCommand addTokenCmd = new SqlCommand("add_token", myConnection);
                addTokenCmd.CommandType = CommandType.StoredProcedure;

                addTokenCmd.Parameters.AddWithValue("@TokenID", token);
                addTokenCmd.Parameters.AddWithValue("@UserID", userID);

                addTokenCmd.ExecuteNonQuery();

                return Ok( new { accesstoken = token, userid = userID } );
            }

            myConnection.Close();
            return Unauthorized();    
        }

        [HttpDelete]
        public IHttpActionResult deleteToken(string token)
        {
            SqlConnection myConnection = new DBConnector().newConnection;
            myConnection.Open();

            SqlCommand cmd = new SqlCommand("delete_token", myConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@TokenID", token);
            cmd.ExecuteNonQuery();

            myConnection.Close();

            return Ok();
        }

       
    }
}

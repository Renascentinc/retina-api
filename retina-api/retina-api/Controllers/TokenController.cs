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

            SqlCommand cmd = new SqlCommand("????????????", myConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@UserName", requestBody.identification);
            cmd.Parameters.AddWithValue("@Password", requestBody.password);

            SqlDataReader myReader = cmd.ExecuteReader();

            myConnection.Close();

            if (myReader.Read())
            {
                string token = generateToken();

                SqlCommand addTokenCmd = new SqlCommand("????????????", myConnection);
                addTokenCmd.CommandType = CommandType.StoredProcedure;

                addTokenCmd.Parameters.AddWithValue("@TokenID", token);
                SqlDataReader tokenReader = addTokenCmd.ExecuteReader();

                string userID = "";
                while (tokenReader.Read())
                {
                     userID = ((string)((IDataRecord)tokenReader)["UserID"]).TrimEnd(' ');
                }

                return Ok( new { accesstoken = token, userid = userID } );
            }
            else
            {
                return Unauthorized();
            }       
        }

        [HttpDelete]
        public IHttpActionResult deleteToken(string token)
        {
            SqlConnection myConnection = new DBConnector().newConnection;
            myConnection.Open();

            SqlCommand cmd = new SqlCommand("????????????", myConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@TokenID", token);
            cmd.ExecuteNonQuery();

            myConnection.Close();

            return Ok();
        }

       
    }
}

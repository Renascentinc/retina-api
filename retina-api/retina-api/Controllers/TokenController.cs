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
    public class TokenController : ApiController
    {

        private string generateToken()
        {
            string token = "";
            Random randTypeChooser = new Random();
            Random randBase = new Random();
            for (int i = 0; i < 19; i++)
            {
                int typeChooser = randTypeChooser.Next(0, 3);

                if (typeChooser == 0)
                {
                    token += randBase.Next(0, 10).ToString();
                }else if( typeChooser == 1)
                {
                    char upperCase = (char)(randBase.Next(65, 91));
                    token += upperCase.ToString();
                }
                else
                {
                    char lowerCase = (char)(randBase.Next(97, 123));
                    token += lowerCase.ToString();
                }
            }

            return token;
        }

        [HttpPost]
        public IHttpActionResult login( JObject requestBody)
        {
            try
            {
                SqlConnection myConnection = new DBConnector().newConnection;
                myConnection.Open();

                SqlCommand cmd = new SqlCommand("authenticate_user", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@UserName", (string)requestBody["username"]);
                cmd.Parameters.AddWithValue("@Password", (string)requestBody["password"]);

                SqlDataReader myReader = cmd.ExecuteReader();

                if (myReader.Read())
                {

                    int userID = (int)(((IDataRecord)myReader)["UserID"]);
                    string userRole = ((string)(((IDataRecord)myReader)["Role"])).TrimEnd(' ');
                    myConnection.Close(); // done with this connection

                    string token = generateToken();

                    SqlConnection myTokenConnection = new DBConnector().newConnection;
                    myTokenConnection.Open();

                    SqlCommand addTokenCmd = new SqlCommand("add_token", myTokenConnection);
                    addTokenCmd.CommandType = CommandType.StoredProcedure;

                    addTokenCmd.Parameters.AddWithValue("@TokenID", token);
                    addTokenCmd.Parameters.AddWithValue("@UserID", userID);

                    addTokenCmd.ExecuteNonQuery();

                    myTokenConnection.Close();
                    return Ok(new { access_token = token, userid = userID, role = userRole  });
                }
                else
                {
                    myConnection.Close();
                    return Ok();
                }
            }catch (Exception e)
            {
                return Ok(e);
            }
        }

        [HttpDelete]
        public IHttpActionResult deleteToken(JObject token)
        {
            try
            {
                string accessToken = (string)token["access_token"];
                SqlConnection myConnection = new DBConnector().newConnection;
                myConnection.Open();

                SqlCommand cmd = new SqlCommand("delete_token", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@TokenID", accessToken);
                cmd.ExecuteNonQuery();

                myConnection.Close();

                return Ok();
            }
            catch(Exception e)
            {
                return Ok(e);
            }
        }

        public int? verifyToken(string token)
        {
            DBConnector myConnector = new DBConnector();

            SqlCommand tokenCommand = myConnector.newProcedure("validate_token");
            tokenCommand.Parameters.AddWithValue("@TokenID", token);
            SqlDataReader tokenReader = tokenCommand.ExecuteReader();

            int? userID = null;
            while (tokenReader.Read())
            {
                userID = (int)(((IDataRecord)tokenReader)["UserID"]);
            }

            myConnector.closeConnection();

            return userID;
        }

}
}

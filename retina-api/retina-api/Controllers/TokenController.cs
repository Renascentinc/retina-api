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
        [HttpPost]
        public IHttpActionResult Login(dynamic requestBody)
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
                return Ok( new { access_token = token } );
            }
            else
            {
                return Unauthorized();
            }       
        }

        private string generateToken()
        {
            return "blah";
        }
    }
}

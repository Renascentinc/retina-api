using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;

namespace retina_api.Controllers
{
    public class TestController : ApiController
    {
        [HttpGet]
        public IHttpActionResult Get()
        {

            return Ok(new List<int>() { 1, 2, 3 });
        }
        public dynamic getJSONTool(string id)
        {
            dynamic JSONTool = new { id = id };
            return JSONTool;
        }

        [HttpPost]
        public IHttpActionResult Post(dynamic tool)
        {
            try
            {
                using
                (
                    SqlConnection myConnection = new SqlConnection(
                        "user id = renascentinc;" +
                        "password = Skylark777!;" +
                        "server=retinadbserver.database.windows.net;" +
                        "database = retina_develop_db;" +
                        "connection timeout = 30")
                )
                {
                    myConnection.Open();
                    SqlCommand cmd = new SqlCommand("testproc", myConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ToolID", 222222);

                    SqlDataReader myReader = cmd.ExecuteReader();

                    List<dynamic> myList = new List<dynamic>();
                    while (myReader.Read())
                    {
                        myList.Add(getJSONTool((string)myReader["type"]));
                    }

                    myConnection.Close();
                    return Ok(tool);
                    //return Ok( new { data = myList } );
                }
            }
            catch (Exception e)
            {
                return Ok(e);
            }

        }
    }
}

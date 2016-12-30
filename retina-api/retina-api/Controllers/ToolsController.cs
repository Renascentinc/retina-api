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

    public class ToolsController : ApiController
    {
        
        //This function takes a db record and converts it into Ember.js combatable JSON
        private dynamic getJSONTool(IDataRecord record)
        {
            dynamic JSONTool = new
            {

                type = "tool",
                id = record["ToolID"],
                attribute = new
                {
                        toolClass = ((string) record["Class"]).TrimEnd(' '),
                             type = ((string) record["Type"]).TrimEnd(' '),
                            brand = ((string) record["Brand"]).TrimEnd(' '),
                    datePurchased =           record["DatePurchased"],
                    purchasedFrom = ((string) record["PurchasedFrom"]).TrimEnd(' '),
                            price =           record["Price"],
                      modelNumber = ((string) record["ModelNumber"]).TrimEnd(' '),
                           status = ((string) record["Status"]).TrimEnd(' '),
                            photo = ((string) record["Photo"]).TrimEnd(' ')
                }
            };

            return JSONTool;
        }

        [HttpGet]
        public IHttpActionResult GetbyID(int id)
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

                    cmd.Parameters.AddWithValue("@ToolID", id);

                    SqlDataReader myReader = cmd.ExecuteReader();

                    dynamic tool = new { };
                    while (myReader.Read())
                    {
                        tool = getJSONTool((IDataRecord)myReader);
                    }

                    myConnection.Close();
                    
                    return Ok( new { data = tool } );
                }
            }
            catch (Exception e)
            {
                return Ok(e);
            }

        }
        
        [HttpPost]
        public IHttpActionResult PostImage(dynamic data)
        {
            try
            {
                return Ok(data.hair);
            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }
    }
}

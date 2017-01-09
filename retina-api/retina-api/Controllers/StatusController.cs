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
            {//

                List<string> uniqueStrings = new UniqueNames("select_status").getUniqueStrings("Status");
                return Ok(new { status = uniqueStrings });

            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }
    }
}

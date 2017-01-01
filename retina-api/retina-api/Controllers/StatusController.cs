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

                List<string> uniqueNames = new UniqueNames("?????").uniqueNames;
                return Ok(new { status = uniqueNames });

            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }
    }
}

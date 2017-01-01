using retina_api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace retina_api.Controllers
{
    public class TypesController : ApiController
    {
        [HttpGet]
        public IHttpActionResult getTypes()
        {

            try
            {

                List<string> uniqueNames = new UniqueNames("?????").uniqueNames;
                return Ok(new { types = uniqueNames });

            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }
    }
}

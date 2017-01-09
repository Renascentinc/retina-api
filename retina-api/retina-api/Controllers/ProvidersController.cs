using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace retina_api.Controllers
{
    public class ProvidersController : ApiController
    {
        [HttpGet]
        public IHttpActionResult getOwners()
        {

            try
            {

                List<string> uniqueStrings = new Models.UniqueNames("select_purchased_from").getUniqueStrings("PurchasedFrom");
                return Ok(new { providers = uniqueStrings });

            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }
    }
}

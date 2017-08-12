using retina_api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace retina_api.Controllers
{
    public class BrandsController : ApiController
    {
        [HttpGet]
        public IHttpActionResult getBrands()
        {
            try
            {
                List<string> uniqueStrings = new UniqueNames("select_brand").getUniqueStrings("Brand");
                return Ok(new { brands = uniqueStrings });
            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }
    }
}

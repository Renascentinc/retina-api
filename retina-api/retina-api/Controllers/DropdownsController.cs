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
    public class DropdownsController : ApiController
    {
        [HttpGet]
        public IHttpActionResult getDropdowns(int? currentUser, 
                                              bool? user, 
                                              bool? brand, 
                                              bool? provider, 
                                              bool? status, 
                                              bool? type, 
                                              bool? restricteduser,
                                              bool? role)
        {

            try
            {
                Dropdown d = new Dropdown();

                if (brand == true)
                {
                    d.attributes.brand = new UniqueNames("select_brand").getUniqueStrings("Brand");
                }
             
                if (provider == true)
                {
                    d.attributes.provider = new UniqueNames("select_purchased_from").getUniqueStrings("PurchasedFrom");
                }

                if (status == true)
                {
                    d.attributes.status = new UniqueNames("select_status").getUniqueStrings("Status");
                }

                if (type == true)
                {
                    d.attributes.type = new UniqueNames("select_type").getUniqueStrings("Type");
                }
             
                if (user == true)
                {
                    d.attributes.user = new UniqueNames("select_user").getUniqueDynamics();
                }

                if (role == true)
                {
                    d.attributes.role = new UniqueNames("select_role").getUniqueStrings("Role");
                }

                if (currentUser != null && restricteduser == true)
                {
                    UniqueNames limitedUnique = new UniqueNames("select_limited_user");
                    limitedUnique.cmd.Parameters.AddWithValue("@CurrentUser", currentUser);
                    d.attributes.restricteduser = limitedUnique.getUniqueDynamics();
                }

                return Ok(new { data = d });
            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }
    }
}

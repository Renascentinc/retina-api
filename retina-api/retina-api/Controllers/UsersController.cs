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
    public class UsersController : ApiController
    {
        [HttpGet]
        public IHttpActionResult getUser()
        {
            try
            {
                List<dynamic> uniqueDynamics = new UniqueNames("select_user").getUniqueDynamics();
                return Ok(new { users = uniqueDynamics });

            } catch (Exception e)
            {
                return Ok(e);
            }
        }

        [HttpGet]
        public IHttpActionResult getLimitedUsers(int currentUser)
        {
            try
            {
                UniqueNames limitedUnique = new UniqueNames("select_limited_user");
                limitedUnique.cmd.Parameters.AddWithValue("@CurrentUser", currentUser);

                List<dynamic> limitedUniqueDynamics = limitedUnique.getUniqueDynamics();

                return Ok(new { users = limitedUniqueDynamics });
            }catch (Exception e)
            {
                return Ok(e);
            }
        }
       
    }
}

﻿using retina_api.Models;
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

            }catch (Exception e)
            {
                return Ok(e);
            }
        }
       
    }
}

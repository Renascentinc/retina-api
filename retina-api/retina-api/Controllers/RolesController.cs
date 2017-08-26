using retina_api.Models;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace retina_api.Controllers
{
	public class RolesController : ApiController
	{
		[HttpGet]
		public IHttpActionResult GetRoles()
		{
			try
			{
				List<string> uniqueStrings = new UniqueNames("select_role").getUniqueStrings("Role");
				return Ok(new { roles = uniqueStrings });

			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}
	}
}

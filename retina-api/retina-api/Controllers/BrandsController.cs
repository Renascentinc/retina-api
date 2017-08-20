using retina_api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using System.Data.SqlClient;

namespace retina_api.Controllers
{
    public class BrandsController : ApiController
    {   
        //Deprecated. Use this.GetBrands(bool? userEnteredBrands) instead so
        //that you can use the query parameter
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

        [HttpGet]
        public IHttpActionResult GetBrands(bool? userEnteredBrands)
        {
            try
            {
                List<string> brands;

                if (userEnteredBrands == true)
                {
                    brands = new UniqueNames("user_input_brand").getUniqueStrings("Brand");    
                } 
                else 
                {
                    brands = new UniqueNames("select_brand").getUniqueStrings("Brand");
				}
				
				return Ok(new { brands = brands });
            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }

		[HttpDelete]
		public IHttpActionResult DeleteBrand(JObject brand_obj)
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand delete_brand_command = db_connector.newProcedure("delete_brand");

				delete_brand_command.Parameters.AddWithValue("@Brand", (string)brand_obj["brand"]);

				delete_brand_command.ExecuteNonQuery();
				db_connector.closeConnection();
				return Ok();
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}

		[HttpPatch]
		public IHttpActionResult UpdateBrand(JObject brand_obj)
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand update_brand_command = db_connector.newProcedure("update_brand");

				update_brand_command.Parameters.AddWithValue("@OldBrand", (string)brand_obj["oldbrand"]);
				update_brand_command.Parameters.AddWithValue("@NewBrand", (string)brand_obj["newbrand"]);

				update_brand_command.ExecuteNonQuery();
				db_connector.closeConnection();
				return Ok();
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}

		[HttpPost]
		public IHttpActionResult AddBrand(JObject brand_obj)
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand add_brand_command = db_connector.newProcedure("add_brand");

				add_brand_command.Parameters.AddWithValue("@Brand", (string)brand_obj["brand"]);

				add_brand_command.ExecuteNonQuery();
				db_connector.closeConnection();

				return Ok();
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}
    }
}

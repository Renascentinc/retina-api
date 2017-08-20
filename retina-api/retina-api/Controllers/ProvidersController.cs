using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using retina_api.Models;

namespace retina_api.Controllers
{
    public class ProvidersController : ApiController
    {
		//Deprecated. Use this.GetProviders(bool? userEnteredProviders) instead so
		//that you can use the query parameter
		[HttpGet]
        public IHttpActionResult getProviders()
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


    	[HttpGet]
    	public IHttpActionResult GetProviders(bool? userEnteredProviders)
    	{
    		try
    		{
    			List<string> providers;

    			if (userEnteredProviders == true)
    			{
    				providers = new UniqueNames("user_input_purchasedfrom").getUniqueStrings("PurchasedFrom");
    			}
    			else
    			{
    				providers = new UniqueNames("select_purchased_from").getUniqueStrings("PurchasedFrom");
    			}

    			return Ok(new { providers = providers });
    		}
    		catch (Exception e)
    		{
    			return Ok(e);
    		}
    	}

    	[HttpDelete]
    	public IHttpActionResult DeleteProvider(JObject provider_obj)
    	{
    		try
    		{
    			DBConnector db_connector = new DBConnector();
    			SqlCommand delete_provider_command = db_connector.newProcedure("delete_purchasedfrom");

    			delete_provider_command.Parameters.AddWithValue("@PurchasedFrom", (string)provider_obj["provider"]);

    			delete_provider_command.ExecuteNonQuery();
    			db_connector.closeConnection();
    			return Ok();
    		}
    		catch (Exception e)
    		{
    			return Ok(e);
    		}
    	}

    	[HttpPatch]
    	public IHttpActionResult UpdateProvider(JObject provider_obj)
    	{
    		try
    		{
    			DBConnector db_connector = new DBConnector();
    			SqlCommand update_provider_command = db_connector.newProcedure("update_purchasedfrom");

    			update_provider_command.Parameters.AddWithValue("@OldPurchasedFrom", (string)provider_obj["oldprovider"]);
    			update_provider_command.Parameters.AddWithValue("@NewPurchasedFrom", (string)provider_obj["newprovider"]);

    			update_provider_command.ExecuteNonQuery();
    			db_connector.closeConnection();
    			return Ok();
    		}
    		catch (Exception e)
    		{
    			return Ok(e);
    		}
    	}

    	[HttpPost]
    	public IHttpActionResult AddProvider(JObject provider_obj)
    	{
    		try
    		{
    			DBConnector db_connector = new DBConnector();
    			SqlCommand add_provider_command = db_connector.newProcedure("add_purchasedfrom");

    			add_provider_command.Parameters.AddWithValue("@PurchasedFrom", (string)provider_obj["provider"]);

    			add_provider_command.ExecuteNonQuery();
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

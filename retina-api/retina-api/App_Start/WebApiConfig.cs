using System.Web.Http;
using System.Web.Http.Cors;

namespace retina_api.App_Start
{
    public class WebApiConfig
    {
        public static void Configure(HttpConfiguration config)
        {
			config.EnableCors(new EnableCorsAttribute("*", "*", "*"));

			config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
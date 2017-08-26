using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Web.Http;
using retina_api.Models;

namespace retina_api.Controllers
{
	public class ReportsController : ApiController
	{
		[HttpGet]
		public IHttpActionResult GetMaintenenceReport()
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand get_report_command = db_connector.newProcedure("report_maintenance");

				SqlDataReader tool_reader = get_report_command.ExecuteReader();

				List<Tool> tools = new List<Tool>(); ;
				while (tool_reader.Read())
				{
					tools.Add(new Tool(tool_reader));
				}

				db_connector.closeConnection();

				return Ok(new { data = tools });
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}

        [HttpGet]
        public IHttpActionResult GetReportByToolId(int toolId){
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand get_report_command = db_connector.newProcedure("report_tool_transactions");
                get_report_command.Parameters.AddWithValue("@ToolID", toolId);

				SqlDataReader tool_reader = get_report_command.ExecuteReader();

				List<Transaction> transactions = new List<Transaction>(); ;
				while (tool_reader.Read())
				{
					transactions.Add(new Transaction(tool_reader));
				}

				db_connector.closeConnection();

				return Ok(new { data = transactions });
			}
			catch (Exception e)
			{
				return Ok(e);
			}
        }

        /// Require a date span to make this endpoint unique and open up
        /// the possibility of picking a custom date 
		[HttpGet]
		public IHttpActionResult GetReportByDate(string dateSpan)
		{
			try
			{
				DBConnector db_connector = new DBConnector();
				SqlCommand get_report_command = db_connector.newProcedure("report_week_transactions");

				SqlDataReader tool_reader = get_report_command.ExecuteReader();

				List<Transaction> transactions = new List<Transaction>(); ;
				while (tool_reader.Read())
				{
					transactions.Add(new Transaction(tool_reader));
				}

				db_connector.closeConnection();

				return Ok(new { data = transactions });
			}
			catch (Exception e)
			{
				return Ok(e);
			}
		}


	}

}
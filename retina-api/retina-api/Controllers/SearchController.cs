using retina_api.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
//
namespace retina_api.Controllers
{
    public class SearchController : ApiController
    {
        
        [HttpGet]
        public IHttpActionResult toolAutocompleteSearch(string parameter)
        {
            SqlConnection myConnection = new DBConnector().newConnection;
            myConnection.Open();

            SqlCommand cmd = new SqlCommand("search_single_tool", myConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            if (parameter != null)
            {
                cmd.Parameters.AddWithValue("@Number", parameter);
            }else
            {
                cmd.Parameters.AddWithValue("@Number", DBNull.Value);
            }

            SqlDataReader searchReader = cmd.ExecuteReader();

            List<Tool> toolList = new List<Tool>();

            while (searchReader.Read())
            {
                toolList.Add(new Tool(searchReader));
            }

            myConnection.Close();

            return Ok(new { data = toolList });
        }
        

        [HttpGet]
        public IHttpActionResult toolboxAutocompleteSearch(int? currentUser, string parameter)
        {
            try
            {

                SqlConnection myConnection = new DBConnector().newConnection;
                myConnection.Open();

                SqlCommand cmd = new SqlCommand("transfer_single_tool", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                if (currentUser != null)
                {
                    cmd.Parameters.AddWithValue("@CurrentUser", currentUser);
                }else
                {
                    cmd.Parameters.AddWithValue("@CurrentUser", DBNull.Value);
                }

                if (parameter != null)
                {
                    cmd.Parameters.AddWithValue("@Number", parameter);
                }else
                {
                    cmd.Parameters.AddWithValue("@Number", DBNull.Value);
                }
                
                SqlDataReader searchReader = cmd.ExecuteReader();

                List<Tool> toolList = new List<Tool>();

                while (searchReader.Read())
                {
                    toolList.Add(new Tool(searchReader));
                }

                myConnection.Close();

                return Ok(new { data = toolList });
            }catch(Exception e)
            {
                return Ok(e);
            }
        }

        [HttpGet]
        public IHttpActionResult toolboxSearch(int? currentUser, int? userID, string status, string type, string brand)
        {
            try
            {

                SqlConnection myConnection = new DBConnector().newConnection;
                myConnection.Open();

                SqlCommand cmd = new SqlCommand("transfer_tools", myConnection);

                cmd.CommandType = CommandType.StoredProcedure;

                if (status != null)
                {
                    cmd.Parameters.AddWithValue("@Status", status);
                }
                else
                {
                    cmd.Parameters.AddWithValue("@Status", DBNull.Value);
                }

                if (type != null)
                {
                    cmd.Parameters.AddWithValue("@Type", type);
                }
                else
                {
                    cmd.Parameters.AddWithValue("@Type", DBNull.Value);
                }

                if (brand != null)
                {
                    cmd.Parameters.AddWithValue("@Brand", brand);
                }
                else
                {
                    cmd.Parameters.AddWithValue("@Brand", DBNull.Value);
                }

                if (userID != null)
                {
                    cmd.Parameters.AddWithValue("@UserID", userID);
                }
                else
                {
                    cmd.Parameters.AddWithValue("@UserID", DBNull.Value);
                }

                if (currentUser != null)
                {
                    cmd.Parameters.AddWithValue("@CurrentUser", currentUser);
                }
                else
                {
                    cmd.Parameters.AddWithValue("@CurrentUser", DBNull.Value);
                }

                SqlDataReader myReader = cmd.ExecuteReader();

                List<Tool> toolList = new List<Tool>();

                while (myReader.Read())
                {
                    toolList.Add(new Tool(myReader));
                }

                myConnection.Close();

                return Ok(new { data = toolList });
            }
            catch (Exception e)
            {
                return Ok(e);
            }

        }


        [HttpGet]
        public IHttpActionResult search(string status, int? userID, string type, string brand)
        {
            try
            {

                SqlConnection myConnection = new DBConnector().newConnection;
                myConnection.Open();

                SqlCommand cmd = new SqlCommand("search_tools", myConnection);

                cmd.CommandType = CommandType.StoredProcedure;

                if (status != null)
                {
                    cmd.Parameters.AddWithValue("@Status", status);
                }else
                {
                    cmd.Parameters.AddWithValue("@Status", DBNull.Value);
                }

                if (type != null)
                {
                    cmd.Parameters.AddWithValue("@Type", type);
                }
                else
                {
                    cmd.Parameters.AddWithValue("@Type", DBNull.Value);
                }

                if (brand != null)
                {
                    cmd.Parameters.AddWithValue("@Brand", brand);
                }
                else
                {
                    cmd.Parameters.AddWithValue("@Brand", DBNull.Value);
                }

                if (userID != null)
                {
                    cmd.Parameters.AddWithValue("@UserID", userID);
                }
                else
                {
                    cmd.Parameters.AddWithValue("@UserID", DBNull.Value);
                }

                SqlDataReader myReader = cmd.ExecuteReader();

                List<Tool> toolList = new List<Tool>();

                while (myReader.Read())
                {
                    toolList.Add(new Tool(myReader));
                }

                myConnection.Close();

                return Ok(new { data = toolList });
            }
            catch (Exception e)
            {
                return Ok(e);
            }        
    
        }
    }
}

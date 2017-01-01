using retina_api.Controllers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace retina_api.Models
{
    public class UniqueNames
    {
        public List<string> uniqueNames { get; }

        public UniqueNames(string testProc)
        {
            
            //Connect to DB with given testProc
            SqlConnection myConnection = new DBConnector().newConnection;
            myConnection.Open();

            SqlCommand cmd = new SqlCommand(testProc, myConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            SqlDataReader uniqueNameReader = cmd.ExecuteReader();
            myConnection.Close();

            uniqueNames = new List<string>();
            
            while (uniqueNameReader.Read())
            {
                uniqueNames.Add(((string)((IDataRecord)uniqueNameReader)["UserID"]).TrimEnd(' '));

            }         

        }
    }
}
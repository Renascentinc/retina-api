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
        private SqlDataReader uniqueReader;
        private SqlConnection myConnection;
        private SqlCommand cmd;

        public UniqueNames(string testProc)
        {
            myConnection = new DBConnector().newConnection;
            //the testProcs called here are assumed to require no parameters
            cmd = new SqlCommand(testProc, myConnection);
            cmd.CommandType = CommandType.StoredProcedure;
        }

        public List<string> getUniqueStrings(string queryParam) {

            myConnection.Open();
            uniqueReader = cmd.ExecuteReader();

            List<string> uniqueStrings = new List<string>();
            while (uniqueReader.Read())
            {
                uniqueStrings.Add(((string)((IDataRecord)uniqueReader)[queryParam]).TrimEnd(' '));
            }

            myConnection.Close();

            return uniqueStrings;

        }

        public List<dynamic> getUniqueDynamics()
        {

            myConnection.Open();
            uniqueReader = cmd.ExecuteReader();

            List<dynamic> uniqueDynamics = new List<dynamic>();
            dynamic idAndName = new { };
            while (uniqueReader.Read())
            {
                idAndName = new
                {
                    userid = ((int)((IDataRecord)uniqueReader)["UserID"]),
                    username = ((string)((IDataRecord)uniqueReader)["UserName"]).TrimEnd(' ')
                };
                uniqueDynamics.Add(idAndName);
            }

            myConnection.Close();

            return uniqueDynamics;

        }

    }
}
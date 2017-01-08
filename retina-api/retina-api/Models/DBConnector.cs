using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace retina_api.Controllers
{
    public class DBConnector
    {
        public SqlConnection newConnection { get; }

        public DBConnector()
        {
            ConnectionStringSettings retinaConnectionString = ConfigurationManager.ConnectionStrings["RetinaDBConnection"];
            newConnection = new SqlConnection(retinaConnectionString.ConnectionString);
        }
        //
        public SqlCommand newProcedure(string procedure)
        {
            newConnection.Open();

            SqlCommand cmd = new SqlCommand(procedure, newConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            return cmd;

        }

        public void closeConnection()
        {
            newConnection.Close();
        }
    }
}
using System;
using System.Collections.Generic;
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
            newConnection = new SqlConnection(
                            "user id = renascentinc;" +
                            "password = Skylark777!;" +
                            "server=retinadbserver.database.windows.net;" +
                            "database = retina_develop_db;" +
                            "connection timeout = 30");
        }
        
    }
}
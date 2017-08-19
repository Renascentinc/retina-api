using System;
using System.Data;

namespace retina_api.Models
{
    /**
     * @class User
     * 
     * A model to represent a User
     */
    public class User
    {
        /// What type of model this is
		public string type { get; }

        /// The id of the user
		public int id { get; }

        /// User attributes
		public dynamic attributes { get; }

        /**
         * constructor
         * 
         * Set the type of model and the id of the user. Also set user attributes. If
         * any attribute is null, set the attribute to the empty string
         */
		public User(IDataRecord record)
        {
            type = "user";
            id = (int)record["UserID"];
            attributes = new
            {
                username = (record["UserName"] != DBNull.Value) ? ((string)record["UserName"]).TrimEnd(' ') : "",
                password = (record["Password"] != DBNull.Value) ? ((string)record["Password"]).TrimEnd(' ') : "",
                role = (record["Role"] != DBNull.Value) ? ((string)record["Role"]).TrimEnd(' ') : "",
				phonenumber = (record["PhoneNumber"] != DBNull.Value) ? record["PhoneNumber"] : "",
				email = (record["Email"] != DBNull.Value) ? ((string)record["Email"]).TrimEnd(' ') : "",
			};
        }
    }
}

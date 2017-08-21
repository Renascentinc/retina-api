using System;
using System.Data;

namespace retina_api.Models
{

   // .TransactionID, .ToolID, .Status, dbo.Transactions.Date, dbo.Transactions.UserID, dbo.Users.UserName
	public class Transaction
    {
		public string type { get; }
		public int id { get; }
		public dynamic attributes { get; }

		public Transaction(IDataRecord record)
		{
			type = "transaction";
			id = (int)record["TransactionID"];
			attributes = new
			{
				toolid = (int)record["ToolID"],
				userid = (int)record["UserID"],
                status = (record["Status"] != DBNull.Value) ? ((string)record["Status"]).TrimEnd(' ') : "",
                transactiondate = (record["Date"] != DBNull.Value) ? record["Date"] : "",
                username = (record["UserName"] != DBNull.Value) ? ((string)record["UserName"]).TrimEnd(' ') : "",
                email = (record["Email"] != DBNull.Value) ? ((string)record["Email"]).TrimEnd(' ') : "",
                phonenumber = (record["PhoneNumber"] != DBNull.Value) ? ((string)record["PhoneNumber"]).TrimEnd(' ') : "",
                type = (record["Type"] != DBNull.Value) ? ((string)record["Type"]).TrimEnd(' ') : "",
            };
        }
    }
}

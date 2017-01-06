using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;

namespace retina_api.Models
{
    public class Tool
    {

        public string type { get; }
        public int id { get; }
        public dynamic attributes { get; }

        public Tool(IDataRecord record, bool search = false)            
        {
            string emailVar = "";
            dynamic phonenumberVar = "";

            if (search == false)
            {
                emailVar = (record["Email"] != DBNull.Value) ? ((string)record["Email"]).TrimEnd(' ') : "--";
                phonenumberVar = (record["PhoneNumber"] != DBNull.Value) ? record["PhoneNumber"] : "--";
            }

            type = "tool";
            id = (int)record["ToolID"];
            attributes = new
            {
                toolclass = (record["Class"] != DBNull.Value) ? ((string)record["Class"]).TrimEnd(' ') : "",
                type = ((string)record["Type"]).TrimEnd(' '),
                brand = ((string)record["Brand"]).TrimEnd(' '),
                purchasedate = (record["DatePurchased"] != DBNull.Value) ? record["DatePurchased"] : "--",
                purchasedfrom = (record["PurchasedFrom"] != DBNull.Value) ? ((string)record["PurchasedFrom"]).TrimEnd(' ') : "--",
                price = (record["Price"] != DBNull.Value) ? (record["Price"]) : "--",
                modelnumber = ((string)record["ModelNumber"]).TrimEnd(' '),
                status = ((string)record["Status"]).TrimEnd(' '),
                serialnumber = ((string)record["SerialNumber"]).TrimEnd(' '),
                userid = record["UserID"],
                username = (record["UserName"] != DBNull.Value) ? ((string)record["UserName"]).TrimEnd(' ') : "--",
                email = emailVar, // (record["Email"] != DBNull.Value) ? ((string)record["Email"]).TrimEnd(' ') : "--",
                phonenumber = phonenumberVar //(record["PhoneNumber"] != DBNull.Value) ? record["PhoneNumber"] : "--"

            };
        }
    }
}
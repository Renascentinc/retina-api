using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace retina_api.Models
{
    public class Tool
    {

        public string type { get; }
        public int id { get; }
        public dynamic attributes { get; }

        public Tool(IDataRecord record)            
        {
            type = "tool";
            id = (int)record["ToolID"];
            attributes = new
            {
                toolclass = ((string)record["Class"]).TrimEnd(' '),
                type = ((string)record["Type"]).TrimEnd(' '),
                brand = ((string)record["Brand"]).TrimEnd(' '),
                datepurchased = record["DatePurchased"],
                purchasedfrom = ((string)record["PurchasedFrom"]).TrimEnd(' '),
                price = record["Price"],
                modelnumber = ((string)record["ModelNumber"]).TrimEnd(' '),
                status = ((string)record["Status"]).TrimEnd(' '),
 
            };
        }
    }
}
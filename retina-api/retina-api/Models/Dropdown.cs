using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace retina_api.Models
{
    public class Dropdown
    {

        public string type { get; }
        public int id { get; }
        public attributes attributes { get; set; }

        public Dropdown()
        {

            type = "dropdown";
            id = 1;
            attributes = new attributes();
        }
    }
}
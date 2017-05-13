using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace retina_api.Models
{
    public class attributes
    {

        public List<dynamic> user { get; set; }
        public List<dynamic> restricteduser { get; set; }
        public List<string> brand { get; set; }
        public List<string> type { get; set; }
        public List<string> status { get; set; }
        public List<string> provider { get; set; }

        public attributes()
        {

        }
    }
}
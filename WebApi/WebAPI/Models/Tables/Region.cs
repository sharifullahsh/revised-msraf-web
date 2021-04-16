using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models.Tables
{
    public class Region
    {
        public string RegionID { get; set; }
        public string EnName { get; set; }
        public string DrName { get; set; }
        public string PaName { get; set; }
        public bool IsActive { get; set; }
    }
}

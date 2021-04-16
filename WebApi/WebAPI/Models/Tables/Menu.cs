using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models.Tables
{
    public class Menu
    {
        public int MenuID { get; set; }
        public string Controller { get; set; }     
    }
    public class RoleAccess
    {
        public int RoleAccessID { get; set; }
        public string RoleID { get; set; }
        public int MenuID { get; set; }
        public string Permission { get; set; }

    }
}

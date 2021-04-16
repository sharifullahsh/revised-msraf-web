using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class RoleAccessDto
    {
        public string Controller { get; set; }
        public string Permission { get; set; }
    }
}

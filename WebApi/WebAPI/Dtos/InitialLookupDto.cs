using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models.Tables;

namespace WebAPI.Dtos
{
    public class InitialLookupDto
    {
        public List<LookupDto> regions { get; set; }
        public List<LookupDto> provinces { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class LookupValueDto
    {
        public int ValueId { get; set; }
        public string LookupCode { get; set; }
        public string ValueCode { get; set; }
        public string EnName { get; set; }
        public string DrName { get; set; }
        public string PaName { get; set; }
    }
}

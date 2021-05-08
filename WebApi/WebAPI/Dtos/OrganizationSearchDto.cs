using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class OrganizationSearchDto
    {
        public string OrganizationCategory { get; set; }

        public string OrganizationName { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public int Length { get; set; }
    }
}

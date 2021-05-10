using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class ProvinceSearchDto
    {
        public string RegionId { get; set; }

        public string ProvinceName { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public int Length { get; set; }
    }
}

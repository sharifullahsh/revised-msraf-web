﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class LookupDto
    {
        public string LookupCode { get; set; }
        public string LookupName { get; set; }
        public string metaData { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class UserForUpdateDto
    {
        public string ID { get; set; }
        public string DisplayName { get; set; }
        public string[] Roles { get; set; }

    }
}

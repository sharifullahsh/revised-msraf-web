using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class AdminChangeUserPasswordDto
    {
        public string Id { get; set; }
        public string Password { get; set; }
    }
}

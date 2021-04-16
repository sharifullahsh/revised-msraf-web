using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class UserForLoginDto
    {
        [Required]
        public string username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}

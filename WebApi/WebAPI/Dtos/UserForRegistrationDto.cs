using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class UserForRegistrationDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string DisplayName { get; set; }
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        public string Region { get; set; }
        public string Province { get; set; }

        public string[] Roles { get; set; }

    }
    public class RoleForRegistrationDto
    {
        public string RoleID { get; set; }
        [Required]
        public string RoleName { get; set; }      
        public List<Rights> RoleAccess { get; set; }
    }
    public class Rights
    {
        public string Controller { get; set; }
        public string[] Permission { get; set; }
    }
}

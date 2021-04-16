using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models.Tables;

namespace WebAPI.Dtos
{
    public class UserForListDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Region { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Province { get; set; }
        public List<string> Roles { get; set; }
        public List<RoleAccessDto> RoleAccess { get; set; }
        public List<Menu> Menu { get; set; }
    }
}

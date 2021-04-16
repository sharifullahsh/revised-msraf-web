using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Helpers
{

    public enum Permission
    {
        Add,
        Edit,
        View,
        Delete,
        Search,        
        Download
    }
    
    public class AuthorizeAttribute : TypeFilterAttribute
    {
        public AuthorizeAttribute(Permission permission)
        : base(typeof(AuthorizeActionFilter))
        {
            Arguments = new object[] { permission};
        }
    }

    public class AuthorizeActionFilter : IAuthorizationFilter
    {
        private readonly Permission _permission;
        private UserManager<ApplicationUser> _userManager = null;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly DbContext _db = null;
        public AuthorizeActionFilter(Permission permission, DbContext dbcontext,
               UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> rolMgr)
        {
            _permission = permission;
            _db = dbcontext;
            _userManager = userManager;
            _roleManager = rolMgr;

        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            bool isAuthorized = IsAuthorizedAsync(context.HttpContext.User.Identity.Name, context.RouteData.Values["controller"].ToString(), _permission); // :)
            if (!isAuthorized)
            {
                context.Result = new ForbidResult();
            }
        }
        private bool IsAuthorizedAsync(string userName, string controller, Permission permission)
        {
            var user = _db.Users.Where(x => x.UserName == userName).FirstOrDefault();
            var roleIds = _db.UserRoles.Where(x => x.UserId == user.Id).Select(y => y.RoleId).ToList();
            var menus = _db.RoleAccess.Where(item => roleIds.Contains(item.RoleID)).ToList();
            int menuId = _db.Menus.Where(x => x.Controller == controller).Select(i => i.MenuID).FirstOrDefault();
            bool authorized = false;
            foreach (var menu in menus)
            {
                if (menu.MenuID == menuId && menu.Permission == permission.ToString())
                {
                    authorized = true;
                    break;
                }
            }
            return authorized;
        }
    }
}

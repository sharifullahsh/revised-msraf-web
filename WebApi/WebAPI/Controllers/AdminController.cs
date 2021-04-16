using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Dtos;
using WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models.Tables;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly Models.DbContext db;
        private UserManager<ApplicationUser> _userManager = null;
        private SignInManager<ApplicationUser> _signInManager = null;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AdminController(Models.DbContext cotext, UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> rolMgr,
        SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = rolMgr;
            db = cotext;
        }

        [Authorize]
        [HttpGet("userWithRoles/{id}")]
        public async Task<IActionResult> GetUserWithRoles(string id)
        {
            var userList = await (from user in db.Users
                                  orderby user.CreatedDate descending
                                  where user.IsDeleted == false && user.Id == id
                                  select new
                                  {
                                      user.Id,
                                      user.UserName,
                                      user.DisplayName,
                                      user.Region,
                                      user.Email,
                                      user.Province,
                                      Roles = (from userRole in db.UserRoles
                                               join role in db.Roles
                                               on userRole.RoleId
                                               equals role.Id
                                               where userRole.UserId == user.Id
                                               select role.Name).ToList()

                                  }).FirstOrDefaultAsync();
            return Ok(userList);

        }
        [Authorize(Roles = "Admin")]
        [HttpGet("getRoles")]
        public async Task<IActionResult> GetRoles()
        {
            List<RoleForRegistrationDto> roleList = new List<RoleForRegistrationDto>();
            var roleaccesid = await db.RoleAccess.Where(r=>r.RoleID!="1").Select(r => r.RoleID).Distinct().ToListAsync();
            foreach (var item in roleaccesid)
            {
                RoleForRegistrationDto rfr = new RoleForRegistrationDto();
                List<Rights> rightsList = new List<Rights>();
                rfr.RoleID = item;
                rfr.RoleName = db.Roles.Where(x=>x.Id==item).FirstOrDefault().Name;
                var rolaaitem = db.RoleAccess.Where(a=>a.RoleID==item).GroupBy(ax => new { ax.RoleID, ax.MenuID })
                    .Select(a => new {  a.Key.RoleID, a.Key.MenuID });
                foreach (var ra in rolaaitem)
                {
                    Rights rt = new Rights();
                    rt.Controller =db.Menus.Where(x=>x.MenuID== ra.MenuID).FirstOrDefault().Controller;
                    rt.Permission = db.RoleAccess.Where(x => x.MenuID == ra.MenuID && x.RoleID == item)
                        .Select(p => p.Permission).ToArray();
                    rightsList.Add(rt);
                }              
            rfr.RoleAccess = rightsList;
            roleList.Add(rfr);              
            }
            return Ok(roleList);

        }
        [Authorize(Roles = "Admin")]
        [HttpGet("allUserWithRoles")]
        public async Task<IActionResult> GetAllUserWithRoles()
        {
            var userList = await (from user in db.Users
                                  orderby user.CreatedDate descending
                                  where user.IsDeleted == false && user.UserName != "admin"
                                  select new
                                  {
                                      user.Id,
                                      user.UserName,
                                      user.DisplayName,
                                      user.Region,
                                      user.Email,
                                      user.Province,
                                      Roles = (from userRole in db.UserRoles
                                               join role in db.Roles
                                               on userRole.RoleId
                                               equals role.Id
                                               where userRole.UserId == user.Id
                                               select role.Name).ToList()

                                  }).ToListAsync();
            return Ok(userList);

        }

        [Authorize]
        [HttpGet("availableRoles")]
        public async Task<IActionResult> GetAvailableRoles()
        {
            var roles = await _roleManager.Roles.Select(r => r.Name).ToListAsync();
            return Ok(roles);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("editRole")]
        public async Task<IActionResult> EditRole([FromBody] RoleForRegistrationDto model)
        {
            try
            {
                var role = db.Roles.Where(x => x.Id == model.RoleID).FirstOrDefault();
                role.Name = model.RoleName;
                await db.SaveChangesAsync();
                var roleList = db.RoleAccess.Where(x => x.RoleID == model.RoleID).ToList();
                db.RoleAccess.RemoveRange(roleList);
                await db.SaveChangesAsync();

                _roleManager.Roles.Where(x => x.Name == model.RoleName).Select(r => r.Id).FirstOrDefault();
                foreach (var roleAccess in model.RoleAccess)
                {
                    if (roleAccess.Permission != null)
                    {
                        foreach (var permission in roleAccess.Permission)
                        {
                            var access = new RoleAccess
                            {
                                Permission = permission,
                                MenuID = db.Menus.Where(x => x.Controller == roleAccess.Controller).Select(x => x.MenuID).FirstOrDefault(),
                                RoleID = _roleManager.Roles.Where(x => x.Name == model.RoleName).Select(r => r.Id).FirstOrDefault()
                            };
                            await db.RoleAccess.AddAsync(access);
                            await db.SaveChangesAsync();
                        }
                    }
                }
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("Failed to edit the role"+e.Message);
            }
            
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("addRole")]
        public async Task<IActionResult> CreateRole([FromBody] RoleForRegistrationDto model)
        {
            var result = await _roleManager.CreateAsync(new IdentityRole(model.RoleName));
            if (result.Succeeded)
            {
                _roleManager.Roles.Where(x => x.Name == model.RoleName).Select(r => r.Id).FirstOrDefault();
                foreach (var roleAccess in model.RoleAccess)
                {
                    if (roleAccess.Permission != null)
                    {
                        foreach (var permission in roleAccess.Permission)
                        {
                            var access = new RoleAccess
                            {
                                Permission = permission,
                                MenuID = db.Menus.Where(x => x.Controller == roleAccess.Controller).Select(x => x.MenuID).FirstOrDefault(),
                                RoleID = _roleManager.Roles.Where(x => x.Name == model.RoleName).Select(r => r.Id).FirstOrDefault()
                            };
                            await db.RoleAccess.AddAsync(access);
                            await db.SaveChangesAsync();
                        }
                    }
                }
                return Ok();
            }
            return BadRequest("Failed to create the role");
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Createuser([FromBody] UserForRegistrationDto model)
        {
            var result = await _userManager.CreateAsync(
            new ApplicationUser()
            {
                UserName = model.UserName,
                DisplayName = model.DisplayName,
                Region = model.Region,
                Province=model.Province,
                CreatedDate = DateTime.Now,
                Email=model.Email,
                IsDeleted = false
            }, model.Password
            );
            if (result.Succeeded)
            {
                var user = _userManager.FindByNameAsync(model.UserName).Result;
                var selectedRoles = model.Roles;
                selectedRoles = selectedRoles ?? new string[] { };
                result = _userManager.AddToRolesAsync(user, selectedRoles).Result;
                if (result.Succeeded)
                {
                    return Ok();
                }
                return BadRequest("Failed to add roles");
            }
            return BadRequest("Failed to register user");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("editUser/{userName}")]
        public async Task<IActionResult> EditUser(string userName, [FromBody] UserForUpdateDto model)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userRoles = await _userManager.GetRolesAsync(user);

            var selectedRoles = model.Roles;
            selectedRoles = selectedRoles ?? new string[] { };

            var result = _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles)).Result;
            if (!result.Succeeded)
            {
                return BadRequest("Failed to add to roles");
            }

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            var test = await _userManager.GetRolesAsync(user);
            if (!result.Succeeded)
            {

                return BadRequest("Failed to remove the roles");
            }
            return Ok();
        }

        [HttpGet("isUserNameAvailable/{userName}")]
        [Authorize]
        public async Task<bool> IsUserNameAvailable(string userName)
        {
            var isTaken = false;
            var result = await _userManager.FindByNameAsync(userName);
            if (result != null)
            {
                isTaken = true;
                return isTaken; ;
            }
            return isTaken;
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            user.IsDeleted = true;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors.ToString());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("adminChangeUserPassword/{id}")]
        public async Task<IActionResult> AdminChangeUserPassword(AdminChangeUserPasswordDto model)
        {
            var user = await _userManager.FindByIdAsync(model.Id);
            if (user == null)
            {
                return NotFound();
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var result = await _userManager.ResetPasswordAsync(user, token, model.Password);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors.ToString());
        }
        [Authorize]
        [HttpPost("userChangePassword")]
        public async Task<IActionResult> UserChangePassword(UserPasswordChangeDto userPassChangeDto)
        {
            var currentUser = HttpContext.User;
            var user = await _userManager.FindByIdAsync(userPassChangeDto.Id.ToString());
            if (currentUser.Identity.Name != user.UserName)
            {
                return BadRequest("User is not the logged in user");
            }

            var result = await _userManager.ChangePasswordAsync(user, userPassChangeDto.CurrentPassword, userPassChangeDto.NewPassword);

            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors.ToString());
        }
        [AllowAnonymous]
        [HttpPost("isOnline")]
        public async Task<IActionResult> IsOnline()
        {
            return Ok(true);
        }
    }
}
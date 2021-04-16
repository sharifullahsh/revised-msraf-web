using AutoMapper;
using WebAPI.Dtos;
using WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _config;
        private UserManager<ApplicationUser> _userManager = null;
        private SignInManager<ApplicationUser> _signInManager = null;
        private readonly IMapper _mapper;

        //private readonly RoleManager<IdentityRole> _roleManager;
        Models.DbContext db = null;

        public LoginController(IConfiguration config, UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager, 
        IMapper mapper,
        //RoleManager<IdentityRole> rolMgr,
        Models.DbContext context)
        {
            _config = config;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            //_roleManager = rolMgr;
            db = context;
        }

        public IMapper Mapper { get; }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserForLoginDto model)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(model.username);
                if (user == null)
                {
                    return BadRequest("Invalid user name.");
                }
                if (user.IsDeleted == true)
                {
                    return Unauthorized();
                }
                var result = await _signInManager
                    .CheckPasswordSignInAsync(user, model.Password, false);

                if (result.Succeeded)
                {
                    var appUser = await _userManager.Users
                        .FirstOrDefaultAsync(u => u.NormalizedUserName == model.username.ToUpper());
                    var userToReturn = _mapper.Map<UserForListDto>(user);
                    var roleIds = db.UserRoles.Where(x => x.UserId == user.Id).Select(y => y.RoleId).ToList();
                    userToReturn.Menu = db.Menus.ToList();
                    userToReturn.RoleAccess = db.RoleAccess.Join(db.Menus, r => r.MenuID, m => m.MenuID,
                         (r, m) => new { roleAccess = r, menu = m })
                         .Where(l => roleIds.Contains(l.roleAccess.RoleID))
                        .Select(l => new RoleAccessDto { Controller = l.menu.Controller, Permission = l.roleAccess.Permission }).ToList();
                    return Ok(new
                    {
                        token = GenerateJwtToken(appUser).Result,
                        user = userToReturn,
                    });
                }
                return Unauthorized();
            }
            catch (Exception e) { 
            return Unauthorized();
            }
        }


        [NonAction]
        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                 new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName.ToString()),
            };
            if (!string.IsNullOrEmpty(user.Region)){
                claims.Add(new Claim(ClaimTypes.StateOrProvince, user.Region.ToString()));
            }
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.GetSection("Jwt:Key").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(30),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }


       
     
    }
}
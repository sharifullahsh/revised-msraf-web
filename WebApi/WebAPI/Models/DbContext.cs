
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models.Tables;

namespace WebAPI.Models
{
    public class DbContext: IdentityDbContext<ApplicationUser>
    {
        public DbContext(DbContextOptions<DbContext> options) : base(options)
        {
        }
        public virtual DbSet<District> Districts { get; set; }
        public virtual DbSet<LookupType> LookupTypes { get; set; }
        public virtual DbSet<LookupValue> LookupValues { get; set; }
        public virtual DbSet<Province> Provinces { get; set; }
        
        //newly added
        public virtual DbSet<Menu> Menus { get; set; }
        public virtual DbSet<RoleAccess> RoleAccess { get; set; }
        public virtual DbSet<EditLog> EditLogs { get; set; }
        public virtual DbSet<Region> Regions { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models.Tables
{
    public class Organization
    {
        [Key]
        public int OrganizationId { get; set; }

        [Required]
        public string OrganizationCode { get; set; }
        [Required]
        public string EnName { get; set; }
    
        [Required]
        public string OrganizationCategory { get; set; }

        public bool IsActive { get; set; }
    }
}

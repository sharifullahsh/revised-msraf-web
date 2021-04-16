using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Dtos;
using WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Helpers;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class LookupController : ControllerBase
    {
        private readonly DbContext db = null;
        public LookupController(DbContext context)
        {
            db = context;
        }
        [HttpGet("initialLookups")]
        public async Task<IActionResult> GetInitialLookups()
        {
            try
            {

                var lookups = new InitialLookupDto
                {
                    regions = db.Regions.Select(r => new LookupDto { LookupCode = r.RegionID, LookupName = r.EnName }).ToList(),
                    provinces = db.Provinces.Select(p => new LookupDto { LookupCode = p.ProvinceId, LookupName = p.EnName, metaData= p.RegionId }).ToList(),
               
                };
                return Ok(lookups);

            }
            catch (Exception e)
            {
                return BadRequest("Could not get the lookups");
            }

        }

        [HttpGet("districtLookups/{provinceCode}")]
        public async Task<IActionResult> GetDistrictLookups(string provinceCode)
        {
            var districts = db.Districts.Where(d => d.ProvinceCode == provinceCode && d.IsActive == true)
                .Select(d => new LookupDto { LookupCode = d.DistrictCode, LookupName = d.EnName }).ToList();
            return Ok(districts);
        }


    }
}
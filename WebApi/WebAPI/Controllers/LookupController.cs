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
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using WebAPI.Models.Tables;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class LookupController : ControllerBase
    {
        private readonly Models.DbContext db = null;
        private readonly IMapper _mapper;

        public LookupController(Models.DbContext context, IMapper mapper)
        {
            db = context;
            _mapper = mapper;
        }
    #region general lookup
        [HttpPost("saveLookupValue")]
        public async Task<ActionResult> SaveLookupValue([FromBody] LookupValue model)
        {
            if (model.ValueId != 0)
            {
                ModelState.Remove("ValueCode");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (model.ValueId == 0)
                {
                    model.IsActive = true;
                    await db.LookupValues.AddAsync(model);
                }
                else
                {
                    db.Entry(model).State = EntityState.Modified;
                    db.Entry(model).Property(x => x.IsActive).IsModified = false;
                    db.Entry(model).Property(x => x.ValueCode).IsModified = false;
                }
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
             
            }
            return BadRequest();
        }


        [HttpDelete("deleteLookupValue/{valueId}")]
        public async Task<IActionResult> DeleteLookupValue(int valueId)
        {
            if (valueId <= 0) { return BadRequest("Not a valid Id"); }
            var lookupValue = await db.LookupValues.FindAsync(valueId);
            if(lookupValue == null)
            {
                return NotFound();
            }
            lookupValue.IsActive = false;
            db.SaveChanges();
            return Ok();
        }
        
        [HttpGet("makeActiveLookupValue/{valueId}")]
        public async Task<IActionResult> MakeActiveLookupValue(int valueId)
        {
            if (valueId <= 0) { return BadRequest("Not a valid Id"); }
            var lookupValue = await db.LookupValues.FindAsync(valueId);
            if (lookupValue == null)
            {
                return NotFound();
            }
            lookupValue.IsActive = true;
            db.SaveChanges();
            return Ok();
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

        [HttpGet("LookupTypes")]
        public async Task<IActionResult> GetLookupTypes()
        {
            var lookupTypes = db.LookupTypes.Where(l => l.IsActive == true).Select(l=>
            new LookupTypesDto{
                LookupCode = l.LookupCode,
                LookupName = l.EnName
            }).ToList();
            return Ok(lookupTypes);
        }
       
        [HttpGet("lookupValues/{lookupCode}")]
        public async Task<IActionResult> GetLookupValues(string lookupCode)
        {
            var query = db.LookupValues.ToList();
            if (!string.IsNullOrWhiteSpace(lookupCode))
            {
                query = query.Where(l => l.LookupCode == lookupCode).ToList();
            }
            var _lookups = query.OrderByDescending(l => l.ValueId).ToList();
            return Ok(_lookups);
        }

        [HttpGet("isValueCodeAvailable/{valueCode}")]
        public async Task<bool> IsValueCodeAvailable(string valueCode)
        {
            var isTaken = false;
            var result = await db.LookupValues.Where(l=>l.ValueCode == valueCode).FirstOrDefaultAsync();
            if (result != null)
            {
                isTaken = true;
                return isTaken; ;
            }
            return isTaken;
        }
    #endregion

    #region Organization
        [HttpPost("organizations")]
        public async Task<IActionResult> OrganizationPartialList([FromBody] OrganizationSearchDto model)
        {
            var organizations = await (from o in db.Organizations
                                     join l in db.LookupValues on o.OrganizationCategory equals l.ValueCode
                                     where l.IsActive == true
                                     select new 
                                     {
                                         o.OrganizationId,
                                         o.OrganizationCode,
                                         o.OrganizationCategory,
                                         o.EnName,
                                         organizationCategoryName = l.EnName,
                                         o.IsActive
                                     }
                      ).OrderByDescending(o=>o.OrganizationId).ToListAsync();

            if (!string.IsNullOrEmpty(model.OrganizationCategory))
            {
                organizations = organizations.Where(b => b.OrganizationCategory == model.OrganizationCategory).ToList();
            }
            if (!string.IsNullOrWhiteSpace(model.OrganizationName))
            {
                organizations = organizations.Where(b => b.EnName.ToUpper().Contains(model.OrganizationName.ToUpper())).ToList();
            }
            
            var orgsToReturn = organizations.Select(o =>
            new 
            {
                o.OrganizationId,
                o.OrganizationCode,
                o.EnName,
                o.organizationCategoryName,
                o.OrganizationCategory,
                o.IsActive,
            }
            ).ToList();
            var valueToReturn = new
            {
                total = orgsToReturn.Count,
                data = orgsToReturn.Skip(model.PageIndex * model.PageSize).Take(model.PageSize).ToList()
            };
            return Ok(valueToReturn);

        }

        [HttpDelete("deleteOrganization/{organizationId}")]
        public async Task<IActionResult> DeleteOrganization(int organizationId)
        {
            if (organizationId <= 0) { return BadRequest("Not a valid Id"); }
            var organization = await db.Organizations.FindAsync(organizationId);
            if (organization == null)
            {
                return NotFound();
            }
            organization.IsActive = false;
            db.SaveChanges();
            return Ok();
        }

        [HttpGet("makeActiveOrganization/{organizationId}")]
        public async Task<IActionResult> MakeActiveOrganization(int organizationId)
        {
            if (organizationId <= 0) { return BadRequest("Not a valid Id"); }
            var organization = await db.Organizations.FindAsync(organizationId);
            if (organization == null)
            {
                return NotFound();
            }
            organization.IsActive = true;
            db.SaveChanges();
            return Ok();
        }

        [HttpPost("saveOrganization")]
        public async Task<ActionResult> SaveOrganization([FromBody] Organization model)
        {
            if (model.OrganizationId != 0)
            {
                ModelState.Remove("OrganizationCode");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (model.OrganizationId == 0)
                {
                    model.IsActive = true;
                    await db.Organizations.AddAsync(model);
                }
                else
                {
                    db.Entry(model).State = EntityState.Modified;
                    db.Entry(model).Property(x => x.IsActive).IsModified = false;
                    db.Entry(model).Property(x => x.OrganizationCode).IsModified = false;
                }
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {

            }
            return BadRequest();
        }

        [HttpGet("isOrgCodeAvailable/{valueCode}")]
        public async Task<bool> IsOrgCodeAvailable(string orgCode)
        {
            var isTaken = false;
            var result = await db.Organizations.Where(o => o.OrganizationCode == orgCode).FirstOrDefaultAsync();
            if (result != null)
            {
                isTaken = true;
                return isTaken; ;
            }
            return isTaken;
        }

        #endregion
        #region province
        [HttpPost("provinces")]
        public async Task<IActionResult> GetProvincePartialList([FromBody] ProvinceSearchDto model)
        {
            var provinces = await (from p in db.Provinces
                                   join l in db.LookupValues on p.RegionId equals l.ValueCode
                                   where l.IsActive == true
                                   select new
                                   {
                                       p.ProvinceId,
                                       p.RegionId,
                                       p.EnName,
                                       p.DrName,
                                       p.PaName,
                                       p.IsActive,
                                       RegionName = l.EnName
                                   }
                      ).ToListAsync();

            if (!string.IsNullOrEmpty(model.RegionId))
            {
                provinces = provinces.Where(p => p.RegionId == model.RegionId).ToList();
            }
            if (!string.IsNullOrWhiteSpace(model.ProvinceName))
            {
                provinces = provinces.Where(p =>
                p.EnName.ToUpper().Contains(model.ProvinceName.ToUpper()) ||
                p.DrName.ToUpper().Contains(model.ProvinceName.ToUpper()) ||
                p.PaName.ToUpper().Contains(model.ProvinceName.ToUpper())
                ).ToList();
            }

            var provincesToReturn = provinces.Select(p =>
            new
            {
                p.ProvinceId,
                p.RegionName,
                p.RegionId,
                p.EnName,
                p.DrName,
                p.PaName,
                p.IsActive

            }
            ).ToList();
            var valueToReturn = new
            {
                total = provincesToReturn.Count,
                data = provincesToReturn.Skip(model.PageIndex * model.PageSize).Take(model.PageSize).ToList()
            };
            return Ok(valueToReturn);

        }

        //regions
        [HttpGet("regions")]
        public async Task<IActionResult> GetRegionList()
        {
            var regions = await db.Regions.ToListAsync();
            return Ok(regions);

        }

        [HttpDelete("deleteProvince/{provinceId}")]
        public async Task<IActionResult> DeleteProvince(string provinceId)
        {
            if (string.IsNullOrWhiteSpace(provinceId)) { return BadRequest("Not a valid Id"); }
            var provicne = await db.Provinces.FindAsync(provinceId);
            if (provicne == null)
            {
                return NotFound();
            }
            provicne.IsActive = false;
            db.SaveChanges();
            return Ok();
        }
        [HttpGet("makeActiveProvince/{provinceId}")]
        public async Task<IActionResult> MakeActiveProvince(string provinceId)
        {
            if (string.IsNullOrWhiteSpace(provinceId)) { return BadRequest("Not a valid Id"); }
            var province = await db.Provinces.FindAsync(provinceId);
            if (province == null)
            {
                return NotFound();
            }
            province.IsActive = true;
            db.SaveChanges();
            return Ok();
        }
        
        [HttpPost("saveProvince")]
        public async Task<ActionResult> SaveProvince([FromBody] Province model)
        {

            if (string.IsNullOrWhiteSpace(model.ProvinceId))
            {
                return BadRequest();
            }
            var provinceInDb = db.Provinces.FirstOrDefault(p => p.ProvinceId == model.ProvinceId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (provinceInDb == null)
                {
                    model.IsActive = true;
                    await db.Provinces.AddAsync(model);
                }
                else
                {
                    provinceInDb.RegionId = model.RegionId;
                    provinceInDb.EnName = model.EnName;
                    provinceInDb.DrName = model.DrName;
                    provinceInDb.PaName = model.PaName;
            }
            db.SaveChanges();
            return Ok();
            }
            catch (Exception e)
            {

            }
            return BadRequest();
        }

        [HttpGet("isProvinceIdAvailable/{provinceId}")]
        public async Task<bool> IsProvinceIdAvailable(string provinceId)
        {
            var isTaken = false;
            var result = await db.Provinces.Where(p => p.ProvinceId == provinceId).FirstOrDefaultAsync();
            if (result != null)
            {
                isTaken = true;
                return isTaken; ;
            }
            return isTaken;
        }

        #endregion

    }
}
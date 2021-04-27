using AutoMapper;
using WebAPI.Dtos;
using WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models.Tables;

namespace WebAPI.Helpers
{
    public class AutoMapperProfile: Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, UserForListDto>();
            //CreateMap<LookupValue,LookupDto>()
            //    .ForMember(dest=>dest.LookupName,opt=> {
            //        opt.MapFrom(src => src.EnName.FirstOrDefault());
            //    });
            CreateMap<LookupValue,LookupValueDto>();
            CreateMap<LookupValueDto,LookupValue>();
            
        }
    }
}

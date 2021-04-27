using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models.Tables;

namespace WebAPI.Data
{
    interface ILookupValueRepository
    {
        void Add<T>(T entity) where T : class;
        void Remove<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<IEnumerable<LookupValue>> GetLookupValues();
        Task<LookupValue> GetLookupValue();

    }

}

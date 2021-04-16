using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models.Tables
{
    public class EditLog
    {
        public int EditLogID { get; set; }
        public string Data { get; set; }
        public string TableName { get; set; }
        public string RowID { get; set; }
    }
}

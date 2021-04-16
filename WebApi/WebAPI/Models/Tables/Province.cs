namespace WebAPI.Models.Tables
{

    public class Province
    {
        public string ProvinceId { get; set; }

        public string RegionId { get; set; }

        public string EnName { get; set; }

        public string DrName { get; set; }

        public string PaName { get; set; }

        public bool IsActive { get; set; }
    }
}

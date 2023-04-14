using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.Models
{
    public class DaniVoznje
    {
        [Key]
        public int Id { get; set; }
        public bool Ponedjeljak { get; set; }
        public bool Utorak { get; set; }
        public bool Srijeda { get; set; }
        public bool Cetvrtak { get; set; }
        public bool Petak { get; set; }
        public bool Subota { get; set; }
        public bool Nedjelja { get; set; }
    }
}

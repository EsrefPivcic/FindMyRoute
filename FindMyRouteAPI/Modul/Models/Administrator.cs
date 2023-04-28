using FIT_Api_Examples.Modul0_Autentifikacija.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.Models
{
    [Table("Administrator")]
    public class Administrator : KorisnickiNalog
    {
        public string PIN { get; set; }
    }
}

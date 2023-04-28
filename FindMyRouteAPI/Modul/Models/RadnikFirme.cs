using FIT_Api_Examples.Modul0_Autentifikacija.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.Models
{
    [Table("RadnikFirme")]
    public class RadnikFirme : KorisnickiNalog
    {
        public string Pozicija { get; set; }
        public int RadniStaz { get; set; }
    }
}

using FIT_Api_Examples.Modul0_Autentifikacija.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.Models
{
    [Table("Korisnik")]
    public class Korisnik : KorisnickiNalog
    {
        public int BrojKupljenihKarata { get; set; }
    }
}

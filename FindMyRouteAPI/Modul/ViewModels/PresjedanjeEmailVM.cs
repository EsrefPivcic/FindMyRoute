using FindMyRouteAPI.Modul.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.ViewModels
{
    public class PresjedanjeEmailVM
    {
        public int Linija1_id { get; set; }
        public int Linija2_id { get; set; }
        public int Korisnik_id { get; set; }
        public int? Kreditna_id { get; set; }
        public string? TipKartice { get; set; }
        public int Kolicina { get; set; }
        public DateTime DatumVoznje { get; set; }
        public string? PayPalEmail { get; set; }
    }
}

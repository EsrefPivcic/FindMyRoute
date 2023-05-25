using FindMyRouteAPI.Modul.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.ViewModels
{
    public class KupovinaAddVM
    {
        public int Linija_id { get; set; }
        public int Korisnik_id { get; set; }
        public int? Kreditna_id { get; set; } 
        public int Kolicina { get; set; }
        public DateTime DatumVoznje { get; set; }
        public string? PayPalEmail { get; set; }
        public string? SigurnosniBroj { get; set; }
    }
}

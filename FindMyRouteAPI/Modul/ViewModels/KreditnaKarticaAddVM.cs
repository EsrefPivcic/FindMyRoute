using FindMyRouteAPI.Modul.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.ViewModels
{
    public class KreditnaKarticaAddVM
    {
        public int? Korisnik_id { get; set; }
        public string BrojKartice { get; set; }
        public DateTime DatumIsteka { get; set; }
        public string SigurnosniBroj { get; set; }
    }
}

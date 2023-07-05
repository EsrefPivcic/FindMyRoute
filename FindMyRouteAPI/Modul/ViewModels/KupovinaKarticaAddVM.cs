using FindMyRouteAPI.Modul.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.ViewModels
{
    public class KupovinaKarticaAddVM
    {
        public int Linija_id { get; set; }
        public int Korisnik_id { get; set; }
        public int Kolicina { get; set; }
        public DateTime DatumVoznje { get; set; }
        public string TipKartice { get; set; }
        public string BrojKartice { get; set; }
        public string DatumIsteka { get; set; }
        public string SigurnosniBroj { get; set; }
        public bool PoveziKarticu { get; set; }
        public bool Presjedanje { get; set; }
    }
}


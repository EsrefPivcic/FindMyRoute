using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.Models
{
    public class KreditnaKartica
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Korisnik))]
        public int? Korisnik_id { get; set; }
        public Korisnik Korisnik { get; set; }
        public string BrojKartice { get; set; }
        public DateTime DatumIsteka { get; set; }
        public string SigurnosniBroj { get; set; }
    }
}

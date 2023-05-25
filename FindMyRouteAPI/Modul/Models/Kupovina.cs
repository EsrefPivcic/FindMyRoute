using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.Models
{
    [Table("Kupovina")]
    public class Kupovina
    {
        public int Id { get; set; }
        [ForeignKey(nameof(Linija))]
        public int? Linija_id { get; set; }
        public Linija Linija { get; set; }
        [ForeignKey(nameof(Korisnik))]
        public int? Korisnik_id { get; set; }
        public Korisnik Korisnik { get; set; }
        [ForeignKey(nameof(KreditnaKartica))]
        public int? KreditnaKartica_id { get; set; }
        public KreditnaKartica? KreditnaKartica { get; set; }
        public DateTime DatumKupovine { get; set; }
        public DateTime DatumVoznje { get; set; }
        public int Kolicina { get; set; }
        public int UkupnaCijena { get; set; }
        public string? PayPalEmail { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FindMyRouteAPI.Modul.Models
{
    public class KreditnaKartica
    {
        public int Id { get; set; }
        [ForeignKey(nameof(Korisnik))]
        public int? Korisnik_id { get; set; }
        public Korisnik? Korisnik { get; set; }
        public string TipKartice { get; set; }
        [JsonIgnore]
        public string BrojKartice { get; set; }
        [JsonIgnore]
        public string DatumIsteka { get; set; }
        [JsonIgnore]
        public string SigurnosniBroj { get; set; }
    }
}

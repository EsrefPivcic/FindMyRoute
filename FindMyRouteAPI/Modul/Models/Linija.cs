using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.Models
{
    public class Linija
    {
        public int Id { get; set; }
        public string Grad1 { get; set; }
        public string Presjedanje { get; set; }
        public string Grad2 { get; set; }

        [ForeignKey(nameof(Prevoznik))]
        public int? Prevoznik_id { get; set; }
        public Prevoznik Prevoznik { get; set; }
        public DateTime DatumVrijeme { get; set; }
        public int Kilometraza { get; set; }
        public int Trajanje { get; set; }
        public int Cijena { get; set; }
    }
}

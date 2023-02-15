using FindMyRouteAPI.Modul.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.ViewModels
{
    public class LinijaAddVM
    {
        public string Grad1 { get; set; }
        public string Grad2 { get; set; }
        public int? Prevoznik_id { get; set; }
        public DateTime DatumVrijeme { get; set; }
        public int Kilometraza { get; set; }
        public int Trajanje { get; set; }
        public int Cijena { get; set; }
    }
}

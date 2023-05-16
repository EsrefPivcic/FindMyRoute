using FindMyRouteAPI.Modul.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.ViewModels

{
    public class LinijeRezultatiVM
    {
        public int Id1 { get; set; }
        public int Id2 { get; set; }
        public string Grad1 { get; set; }
        public string Presjedanje { get; set; }
        public string Grad2 { get; set; }
        public string Prevoznik { get; set; }
        //public DateTime DatumVrijeme { get; set; }
        //public TimeOnly VrijemePolaska { get; set; }
        //public TimeOnly VrijemeDolaska { get; set; }
        public int PolazakSati { get; set; }
        public int PolazakMinute { get; set; }
        public int DolazakSati { get; set; }
        public int DolazakMinute { get; set; }
        public int Kilometraza { get; set; }
        public int Trajanje { get; set; }
        public int Cijena { get; set; }
        public int Cekanje { get; set; }
    }
}

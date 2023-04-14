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
        public string PolazakSati { get; set; }
        public string PolazakMinute { get; set; }
        public string DolazakSati { get; set; }
        public string DolazakMinute { get; set; }
        public int Kilometraza { get; set; }
        public int Trajanje { get; set; }
        public int Cijena { get; set; }
    }
}

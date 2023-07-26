using FindMyRouteAPI.Modul.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.ViewModels
{
    public class LinijaAddByRadnikVM
    {
        public string Grad1 { get; set; }
        public string Grad2 { get; set; }
        public int Prevoznik_id { get; set; }

        public int PolazakSati { get; set; }
        public int PolazakMinute { get; set; }
        public int DolazakSati { get; set; }
        public int DolazakMinute { get; set; }
        public bool PonedjeljakVoznja { get; set; }
        public bool UtorakVoznja { get; set; }
        public bool SrijedaVoznja { get; set; }
        public bool CetvrtakVoznja { get; set; }
        public bool PetakVoznja { get; set; }
        public bool SubotaVoznja { get; set; }
        public bool NedjeljaVoznja { get; set; }
        public int Kilometraza { get; set; }
        public int Cijena { get; set; }
    }
}

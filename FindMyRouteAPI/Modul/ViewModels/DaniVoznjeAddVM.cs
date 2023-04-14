using FindMyRouteAPI.Modul.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Modul.ViewModels
{
    public class DaniVoznjeAddVM
    {
        public bool Ponedjeljak { get; set; }
        public bool Utorak { get; set; }
        public bool Srijeda { get; set; }
        public bool Cetvrtak { get; set; }
        public bool Petak { get; set; }
        public bool Subota { get; set; }
        public bool Nedjelja { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Autentifikacija.ViewModels
{
    public class RegistracijaVM
    {
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string korisnickoIme { get; set; }
        public string lozinka { get; set; }
    }
}

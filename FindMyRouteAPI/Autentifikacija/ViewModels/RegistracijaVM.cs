using System.ComponentModel.DataAnnotations.Schema;

namespace FindMyRouteAPI.Autentifikacija.ViewModels
{
    public class RegistracijaVM
    {
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public string korisnickoIme { get; set; }
        public string lozinka { get; set; }
        public string Adresa { get; set; }
        public string BrojTelefona { get; set; }
        public string? Slika { get; set; }
    }
}

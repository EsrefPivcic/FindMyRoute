using FindMyRouteAPI.Autentifikacija.ViewModels;

namespace FindMyRouteAPI.Modul.ViewModels
{
    public class KorisnikEditVM
    {
        public int Id { get; set; }
        public string? NovoKorisnickoIme { get; set; }
        public string? NovoIme { get; set; }
        public string? NovoPrezime { get; set; }
        public string? NovaAdresa { get; set; }
        public string? NoviEmail { get; set; }
        public string? NoviBrojTelefona { get; set; }
    }
}
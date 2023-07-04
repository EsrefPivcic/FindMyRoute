using FindMyRouteAPI.Autentifikacija.ViewModels;

namespace FindMyRouteAPI.Modul.ViewModels
{
    public class PrevoznikEditVM
    {
        public int Id { get; set; }
        public string? NoviNaziv { get; set; }
        public string? NovaAdresa { get; set; }
        public string? NoviEmail { get; set; }
        public string? NoviBrojTelefona { get; set; }
    }
}
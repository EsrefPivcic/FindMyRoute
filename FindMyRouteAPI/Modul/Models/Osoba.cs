using System.ComponentModel.DataAnnotations;

namespace FindMyRouteAPI.Modul.Models
{
    public class Osoba
    {
        [Key]
        public int Id { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json.Serialization;
using FindMyRouteAPI.Modul.Models;

namespace FIT_Api_Examples.Modul0_Autentifikacija.Models
{
    [Table("KorisnickiNalog")]
    public class KorisnickiNalog
    {
        [Key]
        public int id { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public string korisnickoIme { get; set; }
        [JsonIgnore]
        public string lozinka { get; set; }
        public string Adresa { get; set; }
        public string BrojTelefona { get; set; }
        //public string slika_korisnika { get; set; }
        [JsonIgnore]
        public Korisnik korisnik => this as Korisnik;
        [JsonIgnore]
        public Administrator administrator => this as Administrator;
        [JsonIgnore]
        public RadnikFirme radnikFirme => this as RadnikFirme;
        public bool isKorisnik => korisnik != null;
        public bool isAdministrator => administrator != null;
        public bool isRadnikFirme => radnikFirme != null;
 
    }
}

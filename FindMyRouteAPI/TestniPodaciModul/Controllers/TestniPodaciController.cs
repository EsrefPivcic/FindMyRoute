using FindMyRouteAPI.Data;
using FindMyRouteAPI.Helper;
using FindMyRouteAPI.Modul.Models;
using FIT_Api_Examples.Modul0_Autentifikacija.Models;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using System.Linq;

namespace FindMyRouteAPI.TestniPodaci.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]/[action]")]
    public class TestniPodaciController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public TestniPodaciController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult Count() 
        {
            Dictionary<string, int> data = new Dictionary<string, int>();
            data.Add("Administrator", _dbContext.Administrator.Count());
            data.Add("RadnikFirme", _dbContext.RadnikFirme.Count());
            data.Add("Prevoznik", _dbContext.Prevoznik.Count());
            data.Add("Korisnik", _dbContext.Korisnik.Count());
            data.Add("Linija", _dbContext.Linija.Count());
            data.Add("DaniVoznje", _dbContext.DaniVoznje.Count());
            data.Add("KreditnaKartica", _dbContext.KreditnaKartica.Count());
            return Ok(data);
        }

        [HttpPost]
        public ActionResult Generate() 
        {
            var administrator = new Administrator { 
                Ime = "Nedžmija",
                Prezime = "Muminović",
                Email = "nedzmija.muminovic@edu.fit.ba",
                korisnickoIme = "mia",
                lozinka = "mia",
                Adresa = "Zalik",
                BrojTelefona = "+38761957153",
                posjedujeKreditnu = false,
                isAktiviran = true,
                PIN = "3004"
            };

            _dbContext.Administrator.Add(administrator);
            _dbContext.SaveChanges();

            byte[]? LivnoBusVelika = Slike.resize(Fajlovi.Ucitaj("Images/livnobus.png"), 200);
            byte[]? LivnoBusMala = Slike.resize(Fajlovi.Ucitaj("Images/livnobus.png"), 50);

            var livnobus = new Prevoznik { 
                Naziv = "Livno Bus",
                Adresa = "Livno",
                Email = "livno.bus@livno.ba",
                BrojTelefona = "+38763505404",
                Logo = LivnoBusVelika,
                LogoMali = LivnoBusMala
            };

            _dbContext.Prevoznik.Add(livnobus);
            _dbContext.SaveChanges();

            byte[]? AutoprevozVelika = Slike.resize(Fajlovi.Ucitaj("Images/autoprevoz.png"), 200);
            byte[]? AutoprevozMala = Slike.resize(Fajlovi.Ucitaj("Images/autoprevoz.png"), 50);

            var autoprevoz = new Prevoznik
            {
                Naziv = "Autoprevoz Mostar",
                Adresa = "Mostar",
                Email = "autoprevoz@mostar.ba",
                BrojTelefona = "+38761555444",
                Logo = AutoprevozVelika,
                LogoMali = AutoprevozMala
            };

            _dbContext.Prevoznik.Add(autoprevoz);
            _dbContext.SaveChanges();

            var radnik1 = new RadnikFirme
            {
                Ime = "Ešref",
                Prezime = "Pivčić",
                Email = "esref.pivcic@edu.fit.ba",
                korisnickoIme = "eshi",
                lozinka = "eshi",
                Adresa = "SHM",
                BrojTelefona = "+38763083064",
                Pozicija = "IT Manager",
                RadniStaz = 10,
                Prevoznik_id = livnobus.Id,
                posjedujeKreditnu = false,
                isAktiviran = true
            };

            _dbContext.RadnikFirme.Add(radnik1);
            _dbContext.SaveChanges();

            var radnik2 = new RadnikFirme
            {
                Ime = "Amar",
                Prezime = "Pivčić",
                Email = "amar.pivcic@edu.fit.ba",
                korisnickoIme = "amar",
                lozinka = "amar",
                Adresa = "SHM",
                BrojTelefona = "+38763415217",
                Pozicija = "IT Manager",
                RadniStaz = 10,
                Prevoznik_id = autoprevoz.Id,
                posjedujeKreditnu = false,
                isAktiviran = true
            };

            _dbContext.RadnikFirme.Add(radnik2);
            _dbContext.SaveChanges();

            var radniDani = new DaniVoznje
            {
                Ponedjeljak = true,
                Utorak = true,
                Srijeda = true,
                Cetvrtak = true,
                Petak = true,
                Subota = false,
                Nedjelja = false
            };

            _dbContext.DaniVoznje.Add(radniDani);
            _dbContext.SaveChanges();

            var neradniDani = new DaniVoznje
            {
                Ponedjeljak = false,
                Utorak = false,
                Srijeda = false,
                Cetvrtak = false,
                Petak = false,
                Subota = true,
                Nedjelja = true
            };

            _dbContext.DaniVoznje.Add(neradniDani);
            _dbContext.SaveChanges();

            var linija1 = new Linija {
                Grad1 = "Livno",
                Presjedanje = "Direktna linija",
                Grad2 = "Mostar",
                Prevoznik_id = livnobus.Id,
                PolazakSati = 7,
                PolazakMinute = 20,
                DolazakSati = 9,
                DolazakMinute = 35,
                DaniVoznje_id = radniDani.Id,
                Kilometraza = 135,
                Trajanje = 135,
                Cijena = 15
            };

            _dbContext.Linija.Add(linija1);
            _dbContext.SaveChanges();

            var linija2 = new Linija
            {
                Grad1 = "Livno",
                Presjedanje = "Direktna linija",
                Grad2 = "Split",
                Prevoznik_id = livnobus.Id,
                PolazakSati = 6,
                PolazakMinute = 30,
                DolazakSati = 8,
                DolazakMinute = 0,
                DaniVoznje_id = neradniDani.Id,
                Kilometraza = 100,
                Trajanje = 90,
                Cijena = 20
            };

            _dbContext.Linija.Add(linija2);
            _dbContext.SaveChanges();

            var linija3 = new Linija
            {
                Grad1 = "Mostar",
                Presjedanje = "Direktna linija",
                Grad2 = "Blagaj",
                Prevoznik_id = autoprevoz.Id,
                PolazakSati = 9,
                PolazakMinute = 50,
                DolazakSati = 10,
                DolazakMinute = 5,
                DaniVoznje_id = radniDani.Id,
                Kilometraza = 17,
                Trajanje = 15,
                Cijena = 2
            };

            _dbContext.Linija.Add(linija3);
            _dbContext.SaveChanges();

            var linija4 = new Linija
            {
                Grad1 = "Livno",
                Presjedanje = "Direktna linija",
                Grad2 = "Split",
                Prevoznik_id = autoprevoz.Id,
                PolazakSati = 9,
                PolazakMinute = 0,
                DolazakSati = 10,
                DolazakMinute = 30,
                DaniVoznje_id = radniDani.Id,
                Kilometraza = 100,
                Trajanje = 90,
                Cijena = 23
            };

            _dbContext.Linija.Add(linija4);
            _dbContext.SaveChanges();

            var linija5 = new Linija
            {
                Grad1 = "Mostar",
                Presjedanje = "Direktna linija",
                Grad2 = "Blagaj",
                Prevoznik_id = livnobus.Id,
                PolazakSati = 10,
                PolazakMinute = 0,
                DolazakSati = 10,
                DolazakMinute = 15,
                DaniVoznje_id = radniDani.Id,
                Kilometraza = 17,
                Trajanje = 15,
                Cijena = 3
            };

            _dbContext.Linija.Add(linija5);
            _dbContext.SaveChanges();

            var korisnici = new List<Korisnik>();

            for (int i = 0; i < 10; i++)
            {
                korisnici.Add(new Korisnik
                {
                    Ime = "TestIme" + i.ToString(),
                    Prezime = "TestPrezime" + i.ToString(),
                    Email = "testuser"+i.ToString()+"@gmail.com",
                    korisnickoIme = "test"+i.ToString(),
                    lozinka = "test" + i.ToString(),
                    Adresa = "adresa" + i.ToString(),
                    BrojTelefona = "+3876333330"+i.ToString(),
                    BrojKupljenihKarata = i,
                    posjedujeKreditnu = false,
                    isAktiviran = true
                });
            }

            _dbContext.Korisnik.AddRange(korisnici);
            _dbContext.SaveChanges();

            var kreditnaKartica = new KreditnaKartica
            {
                Korisnik_id = 4,
                TipKartice = "Visa",
                BrojKartice = "5555-4444-3333-2222",
                DatumIsteka = "09/27",
                SigurnosniBroj = "999"
            };

            _dbContext.KreditnaKartica.Add(kreditnaKartica);
            _dbContext.SaveChanges();
            var korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == 4);
            if (korisnik != null)
            {
                korisnik.posjedujeKreditnu = true;
                _dbContext.SaveChanges();
            }

            return Count();
        }
    }
}
using FindMyRouteAPI.Modul.Models;
using Microsoft.EntityFrameworkCore;

namespace FindMyRouteAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Osoba> Osoba { get; set;}
        public DbSet<Korisnik> Korisnik { get; set;}
        public DbSet<Administrator> Administrator { get; set;}
        public DbSet<RadnikFirme> RadnikFirme { get; set;}
        public DbSet<KreditnaKartica> KreditnaKartica { get; set;}
        public DbSet<Grad> Grad { get; set;}
        public DbSet<Prevoznik> Prevoznik { get; set;}
        public DbSet<Linija> Linija { get; set;}
        public ApplicationDbContext(
            DbContextOptions options) : base(options)
        {
        }
    }
}

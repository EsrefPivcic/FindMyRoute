using System.ComponentModel.DataAnnotations;

namespace FindMyRouteAPI.Modul.Models
{
    public class Prevoznik
    {
        [Key]
        public int Id { get; set; }
        public string Naziv { get; set; }

        public override string ToString()
        {
            return Naziv;
        }
    }
}

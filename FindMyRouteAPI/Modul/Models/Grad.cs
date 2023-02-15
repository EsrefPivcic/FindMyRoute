using System.ComponentModel.DataAnnotations;

namespace FindMyRouteAPI.Modul.Models
{
    public class Grad
    {
        [Key]
        public int Id { get; set; }
        public string Naziv { get; set; }
    }
}

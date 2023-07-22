using FIT_Api_Examples.Modul0_Autentifikacija.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FindMyRouteAPI.Modul.Models
{
    [Table("Administrator")]
    public class Administrator : KorisnickiNalog
    {
        [JsonIgnore]
        public string PIN { get; set; }
    }
}

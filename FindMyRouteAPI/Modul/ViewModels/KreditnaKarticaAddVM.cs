namespace FindMyRouteAPI.Modul.ViewModels
{
    public class KreditnaKarticaAddVM
    {
        public int? Korisnik_id { get; set; }
        public string TipKartice { get; set; }         
        public string BrojKartice { get; set; }
        public string DatumIsteka { get; set; }
        public string SigurnosniBroj { get; set; }
    }
}

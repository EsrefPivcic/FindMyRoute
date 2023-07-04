using Microsoft.AspNetCore.Mvc;
using FindMyRouteAPI.Data;
using FindMyRouteAPI.Helper;

namespace FindMyRouteAPI.Modul.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class LogoAplikacijeController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        public LogoAplikacijeController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public ActionResult Get()
        {
            byte[]? logo = Fajlovi.Ucitaj("Images/FindMyRoute.png");
            if (logo == null)
                throw new Exception();
            return File(logo, "image/png");
        }
    }
}

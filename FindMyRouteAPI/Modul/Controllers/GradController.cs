using Microsoft.AspNetCore.Mvc;
using FindMyRouteAPI.Data;
using FindMyRouteAPI.Helper;
using FindMyRouteAPI.Modul.Models;
using FindMyRouteAPI.Modul.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace FindMyRouteAPI.Modul.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]/[action]")]
    public class GradController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        public GradController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.Grad.FirstOrDefault(k => k.Id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] GradAddVM x)
        {
            var newGrad = new Grad
            {
                Naziv = x.Naziv
            };
            _dbContext.Add(newGrad);
            _dbContext.SaveChanges();
            return Get(newGrad.Id);
        }
    }
}

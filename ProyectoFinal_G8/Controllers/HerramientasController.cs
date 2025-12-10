using Microsoft.AspNetCore.Mvc;

namespace ProyectoFinal_G8.Controllers
{
    public class HerramientasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Prestamos()
        {
            return View();
        }
    }
}

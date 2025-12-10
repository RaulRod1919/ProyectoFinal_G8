using Microsoft.AspNetCore.Mvc;

namespace ProyectoFinal_G8.Controllers
{
    public class ProyectosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

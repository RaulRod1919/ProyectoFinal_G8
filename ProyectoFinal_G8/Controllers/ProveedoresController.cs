using Microsoft.AspNetCore.Mvc;

namespace ProyectoFinal_G8.Controllers
{
    public class ProveedoresController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Solicitud()
        {
            return View();
        }
    }
}

using Microsoft.AspNetCore.Mvc;

namespace ProyectoFinal_G8.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Registro()
        {
            return View();
        }
    }
}

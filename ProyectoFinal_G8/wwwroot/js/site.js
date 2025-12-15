
$(document).ready(function () {

    const usuarioStorage = sessionStorage.getItem("usuario");

    if (!usuarioStorage) {
        return;
    }

    const usuario = JSON.parse(usuarioStorage);
    const rol = usuario.rol;

    if (rol === "Bodegero") {
        $("#menu-proveedores").hide();
        $("#menu-empleados").hide();
        $("#menu-proyectos").hide();
        $("#menu-areas").hide();
    }

    if (rol === "Admin") {
        $(".nav-item").show();
    }

    $("#cerrarSesion").on("click", function (e) {
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = "/Auth/Index";
    });

});

$("#cerrar-modal").on("click", function () {
    $("#mensaje").fadeOut();
});


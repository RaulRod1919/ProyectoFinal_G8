document.addEventListener("DOMContentLoaded", function () {


    const urlBase = "http://localhost:3000/api/";

    $.get(urlBase + "empleados/cantidad", function (respuesta) {
        $("#cantidadEmpleados").text(respuesta.cantidad);
    },"json");

    $.get(urlBase + "proyectos/cantidad", function (respuesta) {
        $("#cantidadProyectos").text(respuesta.cantidad);
    }, "json");

    $.get(urlBase + "herramientas/cantidad", function (respuesta) {
        $("#cantidadHerramientas").text(respuesta.cantidad);
    }, "json");

    $.get(urlBase + "prestamos/cantidad", function (respuesta) {
        $("#prestamoHerramientas").text(respuesta.cantidad);
    }, "json");

    let buenas = 0;
    let malas = 0;
    let ocupadas = 0;
    let reparacion = 0;

    $.get(urlBase + "herramientas/cantidad/estados", function (respuesta) {

        buenas = respuesta.buenas;
        malas = respuesta.malas;
        ocupadas = respuesta.ocupadas;
        reparacion = respuesta.reparacion;

        new Chart(document.getElementById("grafico"), {
            type: "bar",
            data: {
                labels: ["Buenas", "Malas", "Ocupadas", "En Reparación"],
                datasets: [
                    {
                        label: "Cantidad de Herramientas",
                        data: [buenas, malas, ocupadas, reparacion],
                        backgroundColor: [
                            "#7197bf", // Buenas
                            "#1b2536", // Malas
                            "#324e72", // Ocupadas
                            "#cedae9"  // Reparación
                        ]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    }, "json");


});
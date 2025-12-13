const API_PRESTAMOS = "http://localhost:3000/api/prestamos";
const API_EMPLEADOS = "http://localhost:3000/api/empleados";
const API_HERRAMIENTAS = "http://localhost:3000/api/herramientas";

$(document).ready(function () {

    cargarEmpleados();
    cargarHerramientas();

    $("#selectEmpleado").on("change", function () {
        const idEmpleado = $(this).val();
        cargarPrestamosPorEmpleado(idEmpleado);
    });

    $("#formRegistrarPrestamo").submit(function (e) {
        e.preventDefault();

        const prestamo = {
            idEmpleado: $("#selectEmpleadoModal").val(),
            idHerramienta: $("#selectHerramienta").val(),
            codigoUnidad: $("#codigoUnidad").val().trim(),
            fecha: $("#fechaPrestamo").val(),
            activo: $("#activo").val() === "true"
        };

        if (!prestamo.idEmpleado || !prestamo.idHerramienta) {
            alert("Seleccione empleado y herramienta");
            return;
        }

        $.ajax({
            url: API_PRESTAMOS,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(prestamo),
            success: function () {
                $("#registroModal").modal("hide");
                $("#formRegistrarPrestamo")[0].reset();
                cargarPrestamosPorEmpleado(prestamo.idEmpleado);
            },
            error: function () {
                alert("Error al registrar el préstamo");
            }
        });
    });

    $("#selectHerramienta").on("change", function () {
        const codigo = $(this).find(":selected").data("codigo");
        $("#codigoUnidad").val(codigo);
    });

    function cargarEmpleados() {
        $.get(API_EMPLEADOS, function (empleados) {
            let options = `<option hidden selected disabled>Seleccione un empleado...</option>`;
            let selectModal = $("#selectEmpleadoModal");
            empleados.forEach(e => {
                options += `
                    <option value="${e._id}">
                        ${e.codigo} - ${e.nombre} ${e.apellido1}
                    </option>
                `;
                selectModal.append(`
                    <option value="${e._id}">
                        ${e.codigo} - ${e.nombre} ${e.apellido1}
                    </option>
                `);
            });

            $("#selectEmpleado").html(options);
        });
    }

    function cargarHerramientas() {
        $.get(API_HERRAMIENTAS+"/buenas", function (herramientas) {
            let options = `<option hidden selected disabled>Seleccione una herramienta...</option>`;
            herramientas.forEach(h => {
                options += `
                    <option value="${h._id}" data-codigo="${h.codigoUnidad}">
                        ${h.nombre} (${h.codigoUnidad})
                    </option>
                `;
            });

            $("#selectHerramienta").html(options);
        });
    }

    function cargarPrestamosPorEmpleado(idEmpleado) {
        $.get(API_PRESTAMOS, function (prestamos) {

            const filtrados = prestamos.filter(p => p.idEmpleado._id === idEmpleado);
            let html = "";
            let activos = 0;

            filtrados.forEach((p, index) => {
                if (p.activo) activos++;

                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${p.idHerramienta.nombre}</td>
                        <td>${p.codigoUnidad}</td>
                        <td>${new Date(p.fecha).toLocaleDateString()}</td>
                        <td>
                            <span class="badge ${p.activo ? "bg-success" : "bg-danger"}">
                                ${p.activo ? "Activo" : "Inactivo"}
                            </span>
                        </td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-danger btn-delete"
                                    data-id="${p._id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            $("#tablaPrestamosEmpleado").html(html);
            $("#totalActivos").text(activos);

            $(".btn-delete").click(function () {
                eliminarPrestamo($(this).data("id"), idEmpleado);
            });
        });
    }

    function eliminarPrestamo(id, idEmpleado) {
        if (!confirm("¿Eliminar este préstamo?")) return;

        $.ajax({
            url: `${API_PRESTAMOS}/${id}`,
            type: "DELETE",
            success: function () {
                cargarPrestamosPorEmpleado(idEmpleado);
            },
            error: function () {
                alert("Error al eliminar préstamo");
            }
        });
    }

});

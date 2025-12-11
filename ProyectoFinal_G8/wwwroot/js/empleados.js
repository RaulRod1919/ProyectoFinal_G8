const API_URL = "http://localhost:3000/api/empleados";

$(document).ready(function () {
    cargarEmpleados();

    $("#formRegistro").submit(function (e) {
        e.preventDefault();

        const id = $("#idEmpleado").val();

        const empleado = {
            codigo: $("#codigo").val(),
            nombre: $("#nombre").val(),
            apellido1: $("#apellido1").val(),
            apellido2: $("#apellido2").val()
        };

        if (id === "") {
            crearEmpleado(empleado);
        } else {
            actualizarEmpleado(id, empleado);
        }
    });

    $("#buscarEmpleado").on("keyup", function () {
        const texto = $(this).val().toLowerCase();

        $("#tablaEmpleados tr").filter(function () {
            $(this).toggle(
                $(this).text().toLowerCase().indexOf(texto) > -1
            );
        });
    });
});

function cargarEmpleados() {
    $.ajax({
        url: API_URL,
        type: "GET",
        success: function (data) {
            let filas = "";
            data.forEach((empleado, index) => {
                filas += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${empleado.codigo}</td>
                        <td>${empleado.nombre} ${empleado.apellido1} ${empleado.apellido2}</td>

                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-primary me-2"
                                onclick="llenarFormulario('${empleado._id}')"
                                data-bs-toggle="modal" data-bs-target="#registroModal">
                                <i class="bi bi-pencil-square"></i>
                            </button>

                            <button class="btn btn-sm btn-outline-danger"
                                onclick="eliminarEmpleado('${empleado._id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            $("#tablaEmpleados").html(filas);
        }
    });
}

function crearEmpleado(empleado) {
    $.ajax({
        url: API_URL,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(empleado),
        success: function () {
            $("#registroModal").modal("hide");
            $("#formRegistro")[0].reset();
            cargarEmpleados();
        },
        error: function (err) {
            alert("Error al registrar: " + err.responseJSON.message);
        }
    });
}

function llenarFormulario(id) {
    $.ajax({
        url: `${API_URL}/${id}`,
        type: "GET",
        success: function (empleado) {
            $("#idEmpleado").val(empleado._id);
            $("#codigo").val(empleado.codigo);
            $("#nombre").val(empleado.nombre);
            $("#apellido1").val(empleado.apellido1);
            $("#apellido2").val(empleado.apellido2);
        }
    });
}

function actualizarEmpleado(id, empleado) {
    $.ajax({
        url: `${API_URL}/${id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(empleado),
        success: function () {
            $("#registroModal").modal("hide");
            $("#formRegistro")[0].reset();
            $("#idEmpleado").val("");
            cargarEmpleados();
        },
        error: function (err) {
            alert("Error al actualizar: " + err.responseJSON.message);
        }
    });
}

function eliminarEmpleado(id) {
    if (!confirm("¿Deseas eliminar este empleado?")) return;

    $.ajax({
        url: `${API_URL}/${id}`,
        type: "DELETE",
        success: function () {
            cargarEmpleados();
        },
        error: function () {
            alert("Error al eliminar.");
        }
    });
}

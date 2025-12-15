const API_REQUISICIONES = "http://localhost:3000/api/requisiciones";
const API_EMPLEADOS = "http://localhost:3000/api/empleados";
const API_PROYECTOS = "http://localhost:3000/api/proyectos";

$(document).ready(function () {

    cargarEmpleados();
    cargarProyectos();
    cargarRequisiciones();

    $("#formRequisicion").submit(function (e) {
        e.preventDefault();

        const detalle = [];
        $("#contenedorMateriales .item-material").each(function () {
            const material = $(this).find(".material-input").val();
            const cantidad = $(this).find(".cantidad-input").val();

            detalle.push({
                material,
                cantidad
            });
        });

        const requisicion = {
            codigo: $("#selectEmpleado").val(),
            idProyecto: $("#selectProyecto").val(),
            fechaSolicitud: $("#fechaSolicitud").val(),
            detalle
        };

        const id = $("#idRequisicion").val();
        const metodo = id ? "PUT" : "POST";
        const url = id ? `${API_REQUISICIONES}/${id}` : API_REQUISICIONES;

        $.ajax({
            url,
            type: metodo,
            contentType: "application/json",
            data: JSON.stringify(requisicion),
            success: function () {
                $("#requisicionModal").modal("hide");
                $("#formRequisicion")[0].reset();
                $("#idRequisicion").val("");
                resetMateriales();
                cargarRequisiciones();
            },
            error: function () {
                alert("Error al guardar la requisición");
            }
        });
    });

});

function cargarEmpleados() {
    $.get(API_EMPLEADOS, function (empleados) {
        let options = `<option hidden selected disabled>Seleccione un empleado...</option>`;
        empleados.forEach(e => {
            options += `
                <option value="${e.codigo}">
                    ${e.codigo} - ${e.nombre} ${e.apellido1}
                </option>
            `;
        });
        $("#selectEmpleado").html(options);
    });
}

function cargarProyectos() {
    $.get(API_PROYECTOS, function (proyectos) {
        let options = `<option hidden selected disabled>Seleccione un proyecto...</option>`;
        proyectos.forEach(p => {
            options += `
                <option value="${p._id}">
                    ${p.nombre}
                </option>
            `;
        });
        $("#selectProyecto").html(options);
    });
}

function cargarRequisiciones() {
    $.get(API_REQUISICIONES, function (requisiciones) {

        let html = "";

        requisiciones.forEach((r, index) => {

            const materiales = r.detalle.map(d =>
                `${d.material} (${d.cantidad})`
            ).join("<br>");

            html += `
                <tr>
                    <td>${index + 1}</td>

                    <td>
                        ${r.codigo}
                    </td>

                    <td>${r.idProyecto?.nombre ?? ""}</td>

                    <td>${new Date(r.fechaSolicitud).toLocaleDateString()}</td>

                    <td>${materiales}</td>

                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger"
                                onclick="eliminarRequisicion('${r._id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        $("#tablaRequisiciones").html(html);
    })
        .fail(function (err) {
            console.error("Error cargando requisiciones:", err);
            alert("No se pudieron cargar las requisiciones");
        });
}


function eliminarRequisicion(id) {
    if (!confirm("¿Eliminar esta requisición?")) return;

    $.ajax({
        url: `${API_REQUISICIONES}/${id}`,
        type: "DELETE",
        success: function () {
            cargarRequisiciones();
        },
        error: function () {
            alert("Error al eliminar");
        }
    });
}

function resetMateriales() {
    $("#contenedorMateriales").html(`
        <div class="row g-3 mb-3 item-material">
            <div class="col-md-8">
                <input type="text" class="form-control material-input" placeholder="Material solicitado" required />
            </div>
            <div class="col-md-4">
                <input type="number" min="1" class="form-control cantidad-input" placeholder="Cantidad" required />
            </div>
        </div>
    `);
}

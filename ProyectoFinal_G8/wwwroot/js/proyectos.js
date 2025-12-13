const API_PROYECTOS = "http://localhost:3000/api/proyectos";
const API_AREAS = "http://localhost:3000/api/areas";

$(document).ready(function () {

    const $buscador = $("#buscador");
    let filtroActual = "";

    cargarProyectos();
    cargarAreas();

    $buscador.on("input", function () {
        filtroActual = $(this).val().toLowerCase().trim();
        filtrarTabla();
    });

    function filtrarTabla() {
        $("tbody tr").each(function () {
            const texto = $(this).text().toLowerCase();
            $(this).toggle(texto.includes(filtroActual));
        });
    }

    $("#formRegistro").submit(function (e) {
        e.preventDefault();

        const id = $("#idProyecto").val();

        const proyecto = {
            nombre: $("#nombreProyecto").val().trim(),
            centroCostos: $("#centroCostos").val().trim(),
            idArea: $("#area").val(),
            estado: $("#estado").val() === "Activo"
        };

        if (!proyecto.nombre || !proyecto.centroCostos || !proyecto.idArea) {
            alert("Complete todos los campos");
            return;
        }

        if (id === "") {
            crearProyecto(proyecto);
        } else {
            actualizarProyecto(id, proyecto);
        }
    });

    function cargarProyectos() {
        $.ajax({
            url: API_PROYECTOS,
            type: "GET",
            success: function (data) {
                let html = "";

                data.forEach((p, index) => {
                    html += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${p.nombre}</td>
                            <td>${p.centroCostos}</td>
                            <td>${p.idArea?.nombre || "Sin área"}</td>
                            <td>
                                <span class="badge ${p.estado ? "bg-success" : "bg-danger"}">
                                    ${p.estado ? "Activo" : "Inactivo"}
                                </span>
                            </td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-primary me-2 btn-edit"
                                        data-id="${p._id}"
                                        data-bs-toggle="modal"
                                        data-bs-target="#registroModal">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-delete"
                                        data-id="${p._id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });

                $("tbody").html(html);

                $(".btn-edit").click(function () {
                    cargarProyecto($(this).data("id"));
                });

                $(".btn-delete").click(function () {
                    eliminarProyecto($(this).data("id"));
                });

                if (filtroActual) filtrarTabla();
            },
            error: function () {
                alert("Error al cargar proyectos");
            }
        });
    }

    function cargarAreas() {
        $.ajax({
            url: API_AREAS,
            type: "GET",
            success: function (areas) {
                let opciones = `<option hidden selected disabled value="">Seleccione un Área</option>`;
                areas.forEach(a => {
                    opciones += `<option value="${a._id}">${a.nombre}</option>`;
                });
                $("#area").html(opciones);
            },
            error: function () {
                alert("Error al cargar áreas");
            }
        });
    }

    function crearProyecto(proyecto) {
        $.ajax({
            url: API_PROYECTOS,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(proyecto),
            success: function () {
                cerrarModal();
                cargarProyectos();
            },
            error: function (err) {
                alert("Error al crear proyecto");
            }
        });
    }

    function cargarProyecto(id) {
        $.ajax({
            url: `${API_PROYECTOS}/${id}`,
            type: "GET",
            success: function (p) {
                $("#idProyecto").val(p._id);
                $("#nombreProyecto").val(p.nombre);
                $("#centroCostos").val(p.centroCostos);
                $("#area").val(p.idArea._id);
                $("#estado").val(p.estado ? "Activo" : "Inactivo");
            },
            error: function () {
                alert("Error al obtener el proyecto");
            }
        });
    }

    function actualizarProyecto(id, proyecto) {
        $.ajax({
            url: `${API_PROYECTOS}/${id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(proyecto),
            success: function () {
                cerrarModal();
                cargarProyectos();
            },
            error: function () {
                alert("Error al actualizar");
            }
        });
    }

    function eliminarProyecto(id) {
        if (!confirm("¿Eliminar este proyecto?")) return;

        $.ajax({
            url: `${API_PROYECTOS}/${id}`,
            type: "DELETE",
            success: function () {
                cargarProyectos();
            },
            error: function () {
                alert("Error al eliminar");
            }
        });
    }

    function cerrarModal() {
        $("#registroModal").modal("hide");
        $("#formRegistro")[0].reset();
        $("#idProyecto").val("");
    }

});

const API_URL = "http://localhost:3000/api/herramientas";

$(document).ready(function () {

    let $buscador = $("#buscarHerramienta");
    let ultimoFiltro = "";
    cargarHerramientas();

    $("#formRegistro").submit(function (e) {
        e.preventDefault();

        const id = $("#idHerramienta").val();

        const herramienta = {
            nombre: $("#nombre").val().trim(),
            codigoUnidad: $("#codigoUnidad").val().trim(),
            estado: $("#estado").val()
        };

        if (!herramienta.nombre || !herramienta.codigoUnidad || !herramienta.estado) {
            alert("Completa todos los campos.");
            return;
        }

        if (id === "") {
            crearHerramienta(herramienta);
        } else {
            actualizarHerramienta(id, herramienta);
        }
    });

    //esto es lo del buscador
    let debounceTimer = null;
    $buscador.on("input", function () {
        ultimoFiltro = $(this).val().toLowerCase().trim();

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => aplicarFiltro(ultimoFiltro), 150);
    });

    function aplicarFiltro(q) {
        $("#tablaHerramientas tr").each(function () {
            const texto = $(this).text().toLowerCase();
            $(this).toggle(texto.indexOf(q) !== -1);
        });
    }

    function cargarHerramientas() {
        $.ajax({
            url: API_URL,
            type: "GET",
            success: function (data) {
                let html = "";
                data.forEach((h, index) => {
                    html += `
                        <tr data-id="${h._id}">
                            <td>${index + 1}</td>
                            <td>${h.nombre}</td>
                            <td>${h.codigoUnidad}</td>
                            <td><span class="badge ${getBadge(h.estado)}">${h.estado}</span></td>

                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-primary me-2 btn-edit"
                                        data-id="${h._id}"
                                        data-bs-toggle="modal" data-bs-target="#registroModal">
                                    <i class="bi bi-pencil-square"></i>
                                </button>

                                <button class="btn btn-sm btn-outline-danger btn-delete"
                                        data-id="${h._id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });

                $("#tablaHerramientas").html(html);

                // Reasignar eventos
                $(".btn-edit").on("click", function () {
                    llenarFormulario($(this).data("id"));
                });

                $(".btn-delete").on("click", function () {
                    eliminarHerramienta($(this).data("id"));
                });

                // Reaplicar filtro si había texto
                if (ultimoFiltro) aplicarFiltro(ultimoFiltro);
            },
            error: function () {
                alert("Error al cargar las herramientas.");
            }
        });
    }

    //esto son los coloores
    function getBadge(estado) {
        switch (estado) {
            case "Buena": return "bg-success";
            case "Mala": return "bg-danger";
            case "Ocupada": return "bg-warning text-dark";
            case "En Reparación": return "bg-info text-dark";
            default: return "bg-secondary";
        }
    }

    function crearHerramienta(herramienta) {
        $.ajax({
            url: API_URL,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(herramienta),
            success: function () {
                $("#registroModal").modal("hide");
                $("#formRegistro")[0].reset();
                cargarHerramientas();
            },
            error: function (err) {
                alert("Error al crear herramienta.");
            }
        });
    }

    function llenarFormulario(id) {
        $.ajax({
            url: `${API_URL}/${id}`,
            type: "GET",
            success: function (h) {
                $("#idHerramienta").val(h._id);
                $("#nombre").val(h.nombre);
                $("#codigoUnidad").val(h.codigoUnidad);
                $("#estado").val(h.estado);
            },
            error: function () {
                alert("Error al obtener los datos.");
            }
        });
    }

    function actualizarHerramienta(id, herramienta) {
        $.ajax({
            url: `${API_URL}/${id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(herramienta),
            success: function () {
                $("#registroModal").modal("hide");
                $("#formRegistro")[0].reset();
                $("#idHerramienta").val("");
                cargarHerramientas();
            },
            error: function () {
                alert("Error al actualizar.");
            }
        });
    }

    function eliminarHerramienta(id) {
        if (!confirm("¿Deseas eliminar esta herramienta?")) return;

        $.ajax({
            url: `${API_URL}/${id}`,
            type: "DELETE",
            success: function () {
                cargarHerramientas();
            },
            error: function () {
                alert("Error al eliminar.");
            }
        });
    }
});

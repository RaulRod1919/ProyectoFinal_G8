const API_URL = "http://localhost:3000/api/materiales";

$(document).ready(function () {

    console.log("materiales.js cargado");

    let $buscador = $("#buscarMaterial");
    let ultimoFiltro = "";

    cargarMateriales();

    // Crear / actualizar material
    $("#formRegistroMaterial").submit(function (e) {
        e.preventDefault();

        const id = $("#idMaterial").val();

        const material = {
            nombre: $("#nombre").val().trim(),
            precio: parseFloat($("#precio").val())
        };

        if (!material.nombre || isNaN(material.precio)) {
            alert("Completa todos los campos correctamente");
            return;
        }

        if (id === "") {
            crearMaterial(material);
        } else {
            actualizarMaterial(id, material);
        }
    });

    // Buscador
    let debounceTimer = null;
    $buscador.on("input", function () {
        ultimoFiltro = $(this).val().toLowerCase().trim();

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => aplicarFiltro(ultimoFiltro), 150);
    });

    function aplicarFiltro(q) {
        $("#tablaMateriales tr").each(function () {
            const texto = $(this).text().toLowerCase();
            $(this).toggle(texto.includes(q));
        });
    }

    // GET materiales
    function cargarMateriales() {
        $.ajax({
            url: API_URL,
            type: "GET",
            success: function (data) {
                let html = "";

                data.forEach((m, index) => {
                    html += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${m.nombre}</td>
                            <td>₡ ${m.precio.toLocaleString()}</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-primary me-2 btn-edit"
                                        data-id="${m._id}"
                                        data-bs-toggle="modal"
                                        data-bs-target="#registroModal">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-delete"
                                        data-id="${m._id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });

                $("#tablaMateriales").html(html);

                $(".btn-edit").click(function () {
                    cargarMaterial($(this).data("id"));
                });

                $(".btn-delete").click(function () {
                    eliminarMaterial($(this).data("id"));
                });

                if (ultimoFiltro) aplicarFiltro(ultimoFiltro);
            },
            error: function () {
                alert("Error al cargar materiales");
            }
        });
    }

    // POST
    function crearMaterial(material) {
        $.ajax({
            url: API_URL,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(material),
            success: function () {
                $("#registroModal").modal("hide");
                $("#formRegistroMaterial")[0].reset();
                cargarMateriales();
            }
        });
    }

    // GET por ID
    function cargarMaterial(id) {
        $.ajax({
            url: `${API_URL}/${id}`,
            type: "GET",
            success: function (m) {
                $("#idMaterial").val(m._id);
                $("#nombre").val(m.nombre);
                $("#precio").val(m.precio);
            }
        });
    }

    // PUT
    function actualizarMaterial(id, material) {
        $.ajax({
            url: `${API_URL}/${id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(material),
            success: function () {
                $("#registroModal").modal("hide");
                $("#formRegistroMaterial")[0].reset();
                $("#idMaterial").val("");
                cargarMateriales();
            }
        });
    }

    // DELETE
    function eliminarMaterial(id) {
        if (!confirm("¿Eliminar material?")) return;

        $.ajax({
            url: `${API_URL}/${id}`,
            type: "DELETE",
            success: function () {
                cargarMateriales();
            }
        });
    }
});

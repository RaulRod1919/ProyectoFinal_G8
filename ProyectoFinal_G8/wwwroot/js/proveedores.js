const API_URL = "http://localhost:3000/api/proveedores";

$(document).ready(function () {

    let $buscador = $("#buscarProveedor");
    let ultimoFiltro = "";

    cargarProveedores();

    $("#formRegistroProveedor").submit(function (e) {
        e.preventDefault();

        const id = $("#idProveedor").val();

        const proveedor = {
            nombre: $("#nombre").val().trim(),
            telefono: $("#telefono").val().trim()
        };

        if (!proveedor.nombre || !proveedor.telefono) {
            alert("Completa todos los campos.");
            return;
        }

        if (id === "") {
            crearProveedor(proveedor);
        } else {
            actualizarProveedor(id, proveedor);
        }
    });

    let debounceTimer = null;
    $buscador.on("input", function () {
        ultimoFiltro = $(this).val().toLowerCase().trim();

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => aplicarFiltro(ultimoFiltro), 150);
    });

    function aplicarFiltro(q) {
        $("#tablaProveedores tr").each(function () {
            const texto = $(this).text().toLowerCase();
            $(this).toggle(texto.includes(q));
        });
    }

    function cargarProveedores() {
        $.get(API_URL, function (data) {
            let html = "";

            data.forEach((p, index) => {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${p.nombre}</td>
                        <td>${p.telefono}</td>
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

            $("#tablaProveedores").html(html);

            $(".btn-edit").click(function () {
                llenarFormulario($(this).data("id"));
            });

            $(".btn-delete").click(function () {
                eliminarProveedor($(this).data("id"));
            });

            if (ultimoFiltro) aplicarFiltro(ultimoFiltro);
        });
    }

    function crearProveedor(proveedor) {
        $.ajax({
            url: API_URL,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(proveedor),
            success: function () {
                cerrarModal();
                cargarProveedores();
            }
        });
    }

    function llenarFormulario(id) {
        $.get(`${API_URL}/${id}`, function (p) {
            $("#idProveedor").val(p._id);
            $("#nombre").val(p.nombre);
            $("#telefono").val(p.telefono);
        });
    }

    function actualizarProveedor(id, proveedor) {
        $.ajax({
            url: `${API_URL}/${id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(proveedor),
            success: function () {
                cerrarModal();
                cargarProveedores();
            }
        });
    }

    function eliminarProveedor(id) {
        if (!confirm("¿Eliminar proveedor?")) return;

        $.ajax({
            url: `${API_URL}/${id}`,
            type: "DELETE",
            success: function () {
                cargarProveedores();
            }
        });
    }

    function cerrarModal() {
        $("#registroModal").modal("hide");
        $("#formRegistroProveedor")[0].reset();
        $("#idProveedor").val("");
    }
});

$(document).ready(function () {
    const apiUrl = "http://localhost:3000/api/areas";
    let modoEdicion = false;

    function cargarAreas() {
        $.get(apiUrl, function (data) {
            let rows = "";

            data.forEach((area, index) => {
                rows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${area.nombre}</td>
                        <td><span class="badge bg-success">Activa</span></td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-primary me-2 btn-editar" 
                                    data-id="${area._id}" 
                                    data-nombre="${area.nombre}"
                                    data-bs-toggle="modal" data-bs-target="#registroModal">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${area._id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            $("table tbody").html(rows);
        });
    }

    cargarAreas();

    $("input[placeholder='Buscar área...']").on("keyup", function () {
        let value = $(this).val().toLowerCase();

        $("table tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $("#registroModal").on("show.bs.modal", function (event) {
        const button = $(event.relatedTarget);

        if (button.hasClass("btn-editar")) {
            // Modo edición
            modoEdicion = true;

            $("#exampleModalLabel").text("Editar Área");
            $("#idArea").val(button.data("id"));
            $("#nombreArea").val(button.data("nombre"));

        } else {
            // Modo crear
            modoEdicion = false;

            $("#exampleModalLabel").text("Nueva Área");
            $("#idArea").val("");
            $("#formRegistro")[0].reset();
        }
    });

    $("#formRegistro").on("submit", function (e) {
        e.preventDefault();

        const id = $("#idArea").val();
        const nombreArea = $("#nombreArea").val();

        if (!modoEdicion) {
            // Crear
            $.ajax({
                url: apiUrl,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ nombre: nombreArea }),
                success: function () {
                    $("#registroModal").modal("hide");
                    cargarAreas();
                },
                error: function (err) {
                    alert("Error al registrar: " + err.responseJSON?.error);
                }
            });

        } else {
            // Editar
            $.ajax({
                url: `${apiUrl}/${id}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify({ nombre: nombreArea }),
                success: function () {
                    $("#registroModal").modal("hide");
                    cargarAreas();
                },
                error: function (err) {
                    alert("Error al actualizar: " + err.responseJSON?.error);
                }
            });
        }
    });

    $(document).on("click", ".btn-eliminar", function () {
        const id = $(this).data("id");

        if (confirm("¿Seguro que desea eliminar esta área?")) {
            $.ajax({
                url: `${apiUrl}/${id}`,
                method: "DELETE",
                success: function () {
                    cargarAreas();
                },
                error: function (err) {
                    alert("Error al eliminar: " + err.responseJSON?.error);
                }
            });
        }
    });
});

const API_SOLICITUDES = "http://localhost:3000/api/solicitudesMateriales";
const API_PROVEEDORES = "http://localhost:3000/api/proveedores";
const API_MATERIALES = "http://localhost:3000/api/materiales";

let listaMateriales = [];
let solicitudesCache = [];

$(document).ready(function () {

    console.log("solicitud.js cargado ✅");

    cargarProveedores();
    cargarMateriales();
    cargarSolicitudes();

    // Abrir modal nuevo
    $("#btnNuevaSolicitud").click(function () {
        limpiarFormulario();
        $("#tituloModal").text("Nueva Solicitud");
        agregarFilaMaterial();
    });

    // + material
    $("#btnAgregarMaterial").click(function () {
        agregarFilaMaterial();
    });

    // - material
    $("#btnEliminarMaterial").click(function () {
        const filas = $("#contenedorMateriales .fila-material");
        if (filas.length > 1) filas.last().remove();
    });

    // Guardar
    $("#formSolicitud").submit(function (e) {
        e.preventDefault();

        const idSolicitud = $("#idSolicitud").val();
        const idProveedor = $("#selectProveedor").val();
        const estado = $("#selectEstado").val();

        if (!idProveedor || !estado) {
            alert("Seleccione proveedor y estado.");
            return;
        }

        const detalle = leerDetalleDesdeUI();
        if (detalle.length === 0) {
            alert("Agregue al menos un material.");
            return;
        }

        const invalido = detalle.some(d => !d.idMaterial || !d.cantidad || d.cantidad <= 0 || d.precioTotalNeto < 0);
        if (invalido) {
            alert("Revise materiales y cantidades.");
            return;
        }

        const body = { idProveedor, estado, detalle };

        if (!idSolicitud) {
            $.ajax({
                url: API_SOLICITUDES,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(body),
                success: function () {
                    $("#solicitudModal").modal("hide");
                    cargarSolicitudes();
                },
                error: function (err) {
                    console.error(err.responseText);
                    alert("Error al crear la solicitud. Revise consola.");
                }
            });
        } else {
            $.ajax({
                url: `${API_SOLICITUDES}/${idSolicitud}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(body),
                success: function () {
                    $("#solicitudModal").modal("hide");
                    cargarSolicitudes();
                },
                error: function (err) {
                    console.error(err.responseText);
                    alert("Error al actualizar la solicitud. Revise consola.");
                }
            });
        }
    });
});

function cargarProveedores() {
    $.get(API_PROVEEDORES, function (data) {
        let html = `<option hidden selected disabled>Seleccione un proveedor...</option>`;
        data.forEach(p => {
            html += `<option value="${p._id}">${p.nombre}</option>`;
        });
        $("#selectProveedor").html(html);
    }).fail(function (err) {
        console.error("Error proveedores:", err.responseText);
    });
}

function cargarMateriales() {
    $.get(API_MATERIALES, function (data) {
        listaMateriales = data;
    }).fail(function (err) {
        console.error("Error materiales:", err.responseText);
    });
}

function cargarSolicitudes() {
    $.get(API_SOLICITUDES, function (data) {
        solicitudesCache = data;

        let html = "";
        data.forEach((s, index) => {
            const proveedor = s.idProveedor?.nombre ?? "(Sin proveedor)";
            const estado = s.estado ?? "Pendiente";

            const resumen = (s.detalle || [])
                .map(d => `${d.idMaterial?.nombre ?? "Material"} x${d.cantidad}`)
                .join(", ");

            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${proveedor}</td>
                    <td>${badgeEstado(estado)}</td>
                    <td>${resumen || "-"}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-2"
                                onclick="editarSolicitud('${s._id}')"
                                data-bs-toggle="modal" data-bs-target="#solicitudModal">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger"
                                onclick="eliminarSolicitud('${s._id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        $("#tablaSolicitudes").html(html);
    }).fail(function (err) {
        console.error("Error solicitudes:", err.responseText);
    });
}

function limpiarFormulario() {
    $("#idSolicitud").val("");
    $("#selectProveedor").val("");
    $("#selectEstado").val("Pendiente");
    $("#contenedorMateriales").html("");
}

function agregarFilaMaterial(detalle = null) {

    let opciones = `<option hidden selected disabled>Seleccione material...</option>`;
    listaMateriales.forEach(m => {
        opciones += `<option value="${m._id}" data-precio="${m.precio}">${m.nombre}</option>`;
    });

    const idMaterial = detalle?.idMaterial?._id || detalle?.idMaterial || "";
    const cantidad = detalle?.cantidad || 1;

    const fila = $(`
        <div class="row g-2 align-items-end mb-2 fila-material">
            <div class="col-md-7">
                <label class="form-label mb-1">Material</label>
                <select class="form-select sel-material" required>
                    ${opciones}
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label mb-1">Cantidad</label>
                <input type="number" min="1" class="form-control inp-cantidad" value="${cantidad}" required>
            </div>
            <div class="col-md-2">
                <label class="form-label mb-1">Total</label>
                <input type="text" class="form-control inp-total" value="0" readonly>
            </div>
        </div>
    `);

    $("#contenedorMateriales").append(fila);

    if (idMaterial) {
        fila.find(".sel-material").val(idMaterial);
    }

    fila.find(".sel-material, .inp-cantidad").on("change input", function () {
        recalcularFila(fila);
    });

    recalcularFila(fila);
}

function recalcularFila($fila) {
    const idMaterial = $fila.find(".sel-material").val();
    const cantidad = parseInt($fila.find(".inp-cantidad").val() || "0", 10);

    const mat = listaMateriales.find(x => x._id === idMaterial);
    const precio = mat ? Number(mat.precio || 0) : 0;

    const total = Math.max(0, cantidad) * precio;
    $fila.find(".inp-total").val(`₡${total.toLocaleString()}`);
}

function leerDetalleDesdeUI() {
    const detalle = [];

    $("#contenedorMateriales .fila-material").each(function () {
        const idMaterial = $(this).find(".sel-material").val();
        const cantidad = parseInt($(this).find(".inp-cantidad").val() || "0", 10);

        const mat = listaMateriales.find(x => x._id === idMaterial);
        const precio = mat ? Number(mat.precio || 0) : 0;

        if (!idMaterial || !cantidad) return;

        detalle.push({
            idMaterial,
            cantidad,
            precioTotalNeto: cantidad * precio
        });
    });

    return detalle;
}


function editarSolicitud(id) {
    const s = solicitudesCache.find(x => x._id === id);
    if (!s) return;

    limpiarFormulario();
    $("#tituloModal").text("Editar Solicitud");
    $("#idSolicitud").val(s._id);

    $("#selectProveedor").val(s.idProveedor?._id || s.idProveedor);
    $("#selectEstado").val(s.estado || "Pendiente");

    $("#contenedorMateriales").html("");
    if (s.detalle && s.detalle.length) {
        s.detalle.forEach(d => agregarFilaMaterial(d));
    } else {
        agregarFilaMaterial();
    }
}

function eliminarSolicitud(id) {
    if (!confirm("¿Eliminar solicitud?")) return;

    $.ajax({
        url: `${API_SOLICITUDES}/${id}`,
        type: "DELETE",
        success: function () {
            cargarSolicitudes();
        },
        error: function (err) {
            console.error(err.responseText);
            alert("No se pudo eliminar.");
        }
    });
}


function badgeEstado(estado) {
    const e = (estado || "").toLowerCase();
    const cls =
        e === "pendiente" ? "bg-secondary" :
            e === "aprobado" ? "bg-success" :
                e === "recibido" ? "bg-primary" :
                    "bg-dark";

    return `<span class="badge ${cls}">${estado}</span>`;
}

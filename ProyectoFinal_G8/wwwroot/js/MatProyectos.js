const API_PROYECTOS = "http://localhost:3000/api/proyectos";
const API_MATERIALES = "http://localhost:3000/api/materiales";
const API_MAT_PROYECTOS = "http://localhost:3000/api/materialesProyectos";

$(document).ready(function () {

    let listaMateriales = [];
    let registrosProyecto = [];

    cargarProyectos();
    cargarMateriales();

    // ===============================
    // 📌 Cargar Proyectos
    // ===============================
    function cargarProyectos() {
        $.get(API_PROYECTOS, function (data) {
            let html = `<option hidden selected disabled>Seleccione un proyecto...</option>`;
            data.forEach(p => {
                html += `<option value="${p._id}">${p.nombre}</option>`;
            });
            $("#selectProyecto").html(html);
        });
    }

    // ===============================
    // 📌 Cargar Materiales
    // ===============================
    function cargarMateriales() {
        $.get(API_MATERIALES, function (data) {
            listaMateriales = data;
            let html = `<option hidden selected disabled>Seleccione un material...</option>`;
            data.forEach(m => {
                html += `<option value="${m._id}">${m.nombre}</option>`;
            });
            $("#selectMaterial").html(html);
        });
    }

    // ===============================
    // 📌 Cambio de proyecto
    // ===============================
    $("#selectProyecto").change(function () {
        const idProyecto = $(this).val();
        $("#idProyectoSeleccionado").val(idProyecto);
        cargarMaterialesProyecto(idProyecto);
    });

    // ===============================
    // 📌 Cargar materiales del proyecto
    // ===============================
    function cargarMaterialesProyecto(idProyecto) {
        $.get(API_MAT_PROYECTOS, function (data) {

            registrosProyecto = data.filter(x => x.idProyecto?._id === idProyecto);

            let html = "";
            let total = 0;

            if (registrosProyecto.length === 0) {
                $("#tablaMaterialesProyecto").html("");
                $("#totalProyecto").text("₡0.00");
                return;
            }

            registrosProyecto[0].detalle.forEach((d, index) => {
                const subtotal = d.cantidad * d.idMaterial.precio;
                total += subtotal;

                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${d.idMaterial.nombre}</td>
                        <td>₡${d.idMaterial.precio.toLocaleString()}</td>
                        <td>${d.cantidad}</td>
                        <td>₡${subtotal.toLocaleString()}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-danger btn-eliminar"
                                    data-index="${index}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            $("#tablaMaterialesProyecto").html(html);
            $("#totalProyecto").text(`₡${total.toLocaleString()}`);

            $(".btn-eliminar").click(function () {
                eliminarMaterial($(this).data("index"));
            });
        });
    }

    // ===============================
    // ➕ Agregar material al proyecto
    // ===============================
    $("#formAgregarMaterial").submit(function (e) {
        e.preventDefault();

        const idProyecto = $("#idProyectoSeleccionado").val();
        const idMaterial = $("#selectMaterial").val();
        const cantidad = parseInt($("#cantidadMaterial").val());

        if (!idProyecto || !idMaterial || cantidad <= 0) {
            alert("Complete todos los campos.");
            return;
        }

        const materialProyectoExistente = registrosProyecto[0];

        if (materialProyectoExistente) {
            // 🔄 Actualizar
            const detalle = materialProyectoExistente.detalle;

            const existente = detalle.find(d => d.idMaterial._id === idMaterial);

            if (existente) {
                existente.cantidad += cantidad;
            } else {
                detalle.push({ idMaterial, cantidad });
            }

            $.ajax({
                url: `${API_MAT_PROYECTOS}/${materialProyectoExistente._id}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify({ detalle }),
                success: function () {
                    $("#registroModal").modal("hide");
                    $("#formAgregarMaterial")[0].reset();
                    cargarMaterialesProyecto(idProyecto);
                }
            });

        } else {
            // 🆕 Crear
            const nuevo = {
                idProyecto,
                detalle: [{ idMaterial, cantidad }]
            };

            $.ajax({
                url: API_MAT_PROYECTOS,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(nuevo),
                success: function () {
                    $("#registroModal").modal("hide");
                    $("#formAgregarMaterial")[0].reset();
                    cargarMaterialesProyecto(idProyecto);
                }
            });
        }
    });

    // ===============================
    // 🗑 Eliminar material
    // ===============================
    function eliminarMaterial(index) {
        if (!confirm("¿Eliminar material del proyecto?")) return;

        const registro = registrosProyecto[0];
        registro.detalle.splice(index, 1);

        $.ajax({
            url: `${API_MAT_PROYECTOS}/${registro._id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ detalle: registro.detalle }),
            success: function () {
                cargarMaterialesProyecto($("#selectProyecto").val());
            }
        });
    }
});

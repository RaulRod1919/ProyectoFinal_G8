const API_EMPLEADOS = "http://localhost:3000/api/empleados";
const API_MATERIALES = "http://localhost:3000/api/materiales";
const API_MAT_EMPLEADOS = "http://localhost:3000/api/materialesEmpleados";

let registrosEmpleado = [];

$(document).ready(function () {

    cargarEmpleados();
    cargarMateriales();

    function cargarEmpleados() {
        $.get(API_EMPLEADOS, function (data) {
            let html = `<option hidden selected disabled>Seleccione un empleado...</option>`;
            data.forEach(e => {
                html += `
                    <option value="${e.codigo}">
                        ${e.nombre} ${e.apellido1}
                    </option>
                `;
            });
            $("#selectEmpleado").html(html);
        });
    }

    function cargarMateriales() {
        $.get(API_MATERIALES, function (data) {
            let html = `<option hidden selected disabled>Seleccione un material...</option>`;
            data.forEach(m => {
                html += `<option value="${m._id}">${m.nombre}</option>`;
            });
            $("#selectMaterial").html(html);
        });
    }

    $("#selectEmpleado").change(function () {
        const codigoEmpleado = Number($(this).val());
        cargarMaterialesEmpleado(codigoEmpleado);
    });

    function cargarMaterialesEmpleado(codigoEmpleado) {

        $.get(API_MAT_EMPLEADOS, function (data) {

            registrosEmpleado = data.filter(r => r.codigo === codigoEmpleado);

            let html = "";
            let total = 0;

            if (registrosEmpleado.length === 0) {
                $("#tablaMaterialesEmpleado").html("");
                $("#totalEmpleado").text("₡0.00");
                return;
            }

            registrosEmpleado[0].detalle.forEach((d, index) => {
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

            $("#tablaMaterialesEmpleado").html(html);
            $("#totalEmpleado").text(`₡${total.toLocaleString()}`);

            $(".btn-eliminar").click(function () {
                eliminarMaterial($(this).data("index"));
            });
        });
    }

    $("#formAgregarMaterial").submit(function (e) {
        e.preventDefault();

        const codigoEmpleado = Number($("#selectEmpleado").val());
        const idMaterial = $("#selectMaterial").val();
        const cantidad = parseInt($("#cantidadMaterial").val());

        if (!codigoEmpleado || !idMaterial || cantidad <= 0) {
            alert("Complete todos los campos.");
            return;
        }

        const registroExistente = registrosEmpleado[0];

        if (registroExistente) {
            const detalle = registroExistente.detalle;
            const existente = detalle.find(d => d.idMaterial._id === idMaterial);

            if (existente) {
                existente.cantidad += cantidad;
            } else {
                detalle.push({ idMaterial, cantidad });
            }

            $.ajax({
                url: `${API_MAT_EMPLEADOS}/${registroExistente._id}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify({ detalle }),
                success: function () {
                    $("#registroModal").modal("hide");
                    $("#formAgregarMaterial")[0].reset();
                    cargarMaterialesEmpleado(codigoEmpleado);
                }
            });

        } else {
            const nuevo = {
                codigo: codigoEmpleado,
                detalle: [{ idMaterial, cantidad }]
            };

            $.ajax({
                url: API_MAT_EMPLEADOS,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(nuevo),
                success: function () {
                    $("#registroModal").modal("hide");
                    $("#formAgregarMaterial")[0].reset();
                    cargarMaterialesEmpleado(codigoEmpleado);
                },
                error: function (err) {
                    console.error(err.responseText);
                    alert("No se pudo crear la asignación.");
                }
            });
        }
    });

    function eliminarMaterial(index) {
        if (!confirm("¿Eliminar material del empleado?")) return;

        const registro = registrosEmpleado[0];
        registro.detalle.splice(index, 1);

        $.ajax({
            url: `${API_MAT_EMPLEADOS}/${registro._id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ detalle: registro.detalle }),
            success: function () {
                cargarMaterialesEmpleado(Number($("#selectEmpleado").val()));
            }
        });
    }
});

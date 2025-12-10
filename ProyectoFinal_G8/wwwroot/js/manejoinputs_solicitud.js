// --- Agregar fila ---
document.getElementById("btnAgregarMaterial").addEventListener("click", () => {
    let container = document.getElementById("contenedorMateriales");
    let item = container.querySelector(".item-material").cloneNode(true);

    // limpiar valores
    item.querySelector(".material-select").value = "";
    item.querySelector(".cantidad-input").value = "";
    item.querySelector(".precio-neto").value = "";

    container.appendChild(item);
});

// --- Eliminar fila ---
document.getElementById("btnEliminarMaterial").addEventListener("click", () => {
    let items = document.querySelectorAll(".item-material");
    if (items.length > 1) {
        items[items.length - 1].remove();
    }
});

// --- Cálculo de Precio Neto ---
document.addEventListener("input", async function (e) {
    if (e.target.classList.contains("cantidad-input")) {
        let row = e.target.closest(".item-material");
        let cantidad = parseFloat(e.target.value);
        let materialId = row.querySelector(".material-select").value;

        if (!materialId || cantidad <= 0) return;

        let precioUnitario = await obtenerPrecio(materialId);

        row.querySelector(".precio-neto").value =
            (precioUnitario * cantidad).toFixed(2);
    }
});

// --- Simulación obtener precio (AJÚSTALO A TU API) ---
async function obtenerPrecio(idMaterial) {
    return 1500; // ejemplo
}

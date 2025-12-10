
document.getElementById("btnAgregarMaterial").addEventListener("click", function () {
    const cont = document.getElementById("contenedorMateriales");

    const item = document.createElement("div");
    item.classList.add("row", "g-3", "mb-3", "item-material");

    item.innerHTML = `
    <div class="col-md-8">
        <input type="text" class="form-control material-input" placeholder="Material solicitado" required />
    </div>
    <div class="col-md-4">
        <input type="number" min="1" class="form-control cantidad-input" placeholder="Cantidad" required />
    </div>
    `;

    cont.appendChild(item);
});

document.getElementById("btnEliminarMaterial").addEventListener("click", function () {
    const cont = document.getElementById("contenedorMateriales");
    const items = cont.getElementsByClassName("item-material");

    if (items.length > 1) {
        cont.removeChild(items[items.length - 1]);
    }
});

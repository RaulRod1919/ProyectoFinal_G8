const API_USUARIOS = "http://localhost:3000/api/usuarios";

$(document).ready(function () {

    $("#registro").on("submit", function (e) {
        e.preventDefault();

        const correo = $("#correo").val().trim();
        const password = $("#password").val();
        const rol = $("#rol").val();

        if (!correo || !password || !rol) {
            mostrarMensaje("Todos los campos son obligatorios", "error");
            return;
        }

        const usuario = {
            correo,
            password,
            rol
        };

        $.ajax({
            url: API_USUARIOS,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(usuario),
            success: function () {
                mostrarMensaje("Usuario registrado correctamente", "success");
                $("#registro")[0].reset();

                setTimeout(() => {
                    window.location.href = "/Auth/Index";
                }, 1200);
            },
            error: function (xhr) {
                let mensaje = "Error al registrar usuario";

                if (xhr.responseJSON?.message) {
                    mensaje = xhr.responseJSON.message;
                }

                mostrarMensaje(mensaje, "error");
            }
        });
    });

    $("#cerrar-modal").on("click", function () {
        $("#mensaje").fadeOut();
    });

});

function mostrarMensaje(texto, tipo) {
    const clase = tipo === "success" ? "success" : "error";

    const html = `
        <div class="mensaje ${clase}" id="mensaje">
            <span>${texto}</span>
            <button id="cerrar-modal">×</button>
        </div>
    `;

    $(".mensaje").remove();
    $("body").prepend(html);

    $("#cerrar-modal").on("click", function () {
        $("#mensaje").fadeOut();
    });
}


const API_LOGIN = "http://localhost:3000/api/usuarios/login";

$(document).ready(function () {

    $("#login").on("submit", function (e) {
        e.preventDefault();

        const correo = $("#correo").val().trim();
        const password = $("#password").val();

        if (!correo || !password) {
            mostrarMensaje("Todos los campos son obligatorios", "error");
            return;
        }

        $.ajax({
            url: API_LOGIN,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ correo, password }),
            success: function (usuario) {
                sessionStorage.setItem("usuario", JSON.stringify(usuario));

                mostrarMensaje("Inicio de sesión exitoso", "success");

                setTimeout(() => {
                    window.location.href = "/Home/Index";
                }, 1000);
            },
            error: function (xhr) {
                let mensaje = "Credenciales incorrectas";
                if (xhr.responseJSON?.message) {
                    mensaje = xhr.responseJSON.message;
                }
                mostrarMensaje(mensaje, "error");
            }
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


});

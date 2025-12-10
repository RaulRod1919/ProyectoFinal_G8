document.addEventListener("DOMContentLoaded", function () {

    new Chart(document.getElementById("grafico"), {
        type: "bar",
        data: {
            labels: ["Opcion A", "Opcion B"],
            datasets: [
                {
                    label: "Datos A",
                    data: [10, 25],
                    backgroundColor: '#3c638d'
                },
                {
                    label: "Datos B",
                    data: [40, 20],
                    backgroundColor: '#293a51' 
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

});
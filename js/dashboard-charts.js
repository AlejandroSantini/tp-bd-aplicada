document.addEventListener('DOMContentLoaded', () => {
    if (typeof datosGraficoJSON !== 'undefined' && Array.isArray(datosGraficoJSON)) {
        const ctx = document.getElementById('myChart');

        const labels = datosGraficoJSON.map(item => item.label);
        const dataValues = datosGraficoJSON.map(item => item.promedio);
        const backgroundColors = dataValues.map(value => {
            if (value >= 8) return 'rgba(75, 192, 192, 0.6)'; // Verde
            if (value >= 6) return 'rgba(255, 206, 86, 0.6)'; // Amarillo
            return 'rgba(255, 99, 132, 0.6)'; // Rojo
        });

        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Promedio de Notas',
                        data: dataValues,
                        backgroundColor: backgroundColors,
                        borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, max: 10 } },
                    plugins: { legend: { display: false } },
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const clickedItem = datosGraficoJSON[index];
                            // Aquí iría la lógica del drill-down para futuras entregas
                            // window.location.href = `/dashboard?facultadId=${clickedItem.id}`;
                            alert(`Hiciste clic en: ${clickedItem.label} (ID: ${clickedItem.id})`);
                        }
                    }
                }
            });
        }
    }
});

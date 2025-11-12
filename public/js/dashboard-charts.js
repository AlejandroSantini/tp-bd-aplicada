window.addEventListener('load', function() {
    console.log('=== INICIANDO GRÁFICOS ===');
    console.log('Chart.js disponible:', typeof Chart !== 'undefined');
    console.log('Datos barras:', datosGraficoJSON);
    console.log('Tasa aprobación:', tasaAprobacion);
    console.log('Color:', tasaColor);
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js NO está cargado!');
        return;
    }
    
    if (typeof datosGraficoJSON !== 'undefined' && Array.isArray(datosGraficoJSON) && datosGraficoJSON.length > 0) {
        const canvas = document.getElementById('myChart');
        
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const labels = datosGraficoJSON.map(item => item.label);
            const dataValues = datosGraficoJSON.map(item => parseFloat(item.promedio));
            
            const backgroundColors = dataValues.map(value => {
                if (value >= 7) return '#4CAF50';
                if (value >= 4) return '#FFC107';
                return '#F44336';
            });
            
            try {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Promedio',
                            data: dataValues,
                            backgroundColor: backgroundColors,
                            borderColor: backgroundColors,
                            borderWidth: 2,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 10,
                                ticks: { stepSize: 1, font: { size: 14 } },
                                grid: { color: 'rgba(0, 0, 0, 0.05)' }
                            },
                            x: {
                                ticks: { font: { size: 13 } },
                                grid: { display: false }
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return 'Promedio: ' + context.parsed.y.toFixed(1);
                                    }
                                },
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                padding: 12,
                                titleFont: { size: 14 },
                                bodyFont: { size: 13 }
                            }
                        },
                        onClick: (event, elements) => {
                            if (elements.length > 0) {
                                const index = elements[0].index;
                                const item = datosGraficoJSON[index];
                                // Drill-down: navegar al siguiente nivel
                                if (window.location.pathname === '/dashboard') {
                                    // Nivel 1 → Nivel 2: ir a facultad
                                    window.location.href = '/facultad/' + item.id;
                                } else if (window.location.pathname.includes('/facultad/')) {
                                    // Nivel 2 → Nivel 3: ir a carrera
                                    window.location.href = '/carrera/' + item.id;
                                }
                            }
                        }
                    }
                });
                console.log('✅ Gráfico de barras creado con drill-down habilitado');
            } catch (error) {
                console.error('❌ Error al crear gráfico de barras:', error);
            }
        }
    }
    
    if (typeof tasaAprobacion !== 'undefined') {
        const indicatorCanvas = document.getElementById('indicatorChart');
        
        if (indicatorCanvas) {
            const ctx2 = indicatorCanvas.getContext('2d');
            
            let colorAprobacion = '#4CAF50'; 
            if (tasaColor === 'amarillo') colorAprobacion = '#FFC107';
            if (tasaColor === 'rojo') colorAprobacion = '#F44336';
            
            const tasaRestante = 100 - tasaAprobacion;
            
            try {
                new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: ['Aprobados', 'Resto'],
                        datasets: [{
                            data: [tasaAprobacion, tasaRestante],
                            backgroundColor: [colorAprobacion, '#E0E0E0'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        cutout: '70%',
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        }
                    }
                });
                console.log('✅ Gráfico circular creado');
            } catch (error) {
                console.error('❌ Error al crear gráfico circular:', error);
            }
        }
    }
});

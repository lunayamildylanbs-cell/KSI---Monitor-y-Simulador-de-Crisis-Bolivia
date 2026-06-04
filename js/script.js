document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    // A. INTEGRACIÓN DE APIs EN TIEMPO REAL (LA PAZ & MACROECONOMÍA)
    // =====================================================================
    
    // Función auxiliar genérica para manejar fetch y errores visuales
    function fetchAPI(url, elementId, formatCallback, errorMsg) {
        const el = document.getElementById(elementId);
        if (!el) return; // Si el elemento no existe en esta página, lo ignora.
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                el.innerHTML = formatCallback(data);
            })
            .catch(error => {
                el.innerHTML = `<span style="font-size: 1rem; color: var(--color-peligro);"><i class="fa-solid fa-triangle-exclamation"></i> ${errorMsg}</span>`;
            });
    }

    // 1. DIVISA: Tipo de Cambio Oficial (Open Exchange Rates API) - Global
    fetchAPI(
        'https://open.er-api.com/v6/latest/USD',
        'api-divisa',
        (data) => `${data.rates.BOB.toFixed(2)} <span style="font-size: 1rem; color: var(--color-gris-oscuro);">Bs</span>`,
        'Error de conexión BCB'
    );

    // 2. CLIMA: Centro La Paz (Tráfico, Mercados)
    fetchAPI(
        'https://api.open-meteo.com/v1/forecast?latitude=-16.4897&longitude=-68.1193&current_weather=true',
        'api-clima-lapaz',
        (data) => {
            const isDay = data.current_weather.is_day ? '<i class="fa-solid fa-sun text-alerta"></i>' : '<i class="fa-solid fa-moon text-info"></i>';
            return `${data.current_weather.temperature}<span style="font-size: 1.2rem; color: var(--color-gris-oscuro);">°C</span> <span style="font-size: 1rem;">${isDay}</span>`;
        },
        'Error satelital'
    );

    // 3. CLIMA: Los Yungas - Coroico (Despensa de La Paz)
    fetchAPI(
        'https://api.open-meteo.com/v1/forecast?latitude=-16.188&longitude=-67.727&current_weather=true',
        'api-yungas',
        (data) => `${data.current_weather.temperature} <span style="font-size: 1rem; color: var(--color-gris-oscuro);">°C</span>`,
        'Error agroclimático'
    );

    // 4. CLIMA: Frontera Tambo Quemado (Ingreso de cisternas y camiones de puerto)
    fetchAPI(
        'https://api.open-meteo.com/v1/forecast?latitude=-18.28&longitude=-69.11&current_weather=true',
        'api-frontera',
        (data) => `${data.current_weather.temperature} <span style="font-size: 1rem; color: var(--color-gris-oscuro);">°C</span>`,
        'Error en frontera'
    );

    // 5. CLIMA: Ruta Patacamaya - Oruro (Vía troncal de occidente)
    fetchAPI(
        'https://api.open-meteo.com/v1/forecast?latitude=-17.23&longitude=-67.91&current_weather=true',
        'api-ruta',
        (data) => `${data.current_weather.temperature} <span style="font-size: 1rem; color: var(--color-gris-oscuro);">°C</span>`,
        'Error de ruta'
    );

    // 6. CLIMA: Puerto de Arica (Logística marítima)
    fetchAPI(
        'https://api.open-meteo.com/v1/forecast?latitude=-18.47&longitude=-70.31&current_weather=true',
        'api-arica',
        (data) => `${data.current_weather.temperature}<span style="font-size: 1.2rem; color: var(--color-gris-oscuro);">°C</span> <span style="font-size: 1rem;">(${data.current_weather.windspeed} km/h)</span>`,
        'Error portuario'
    );

    // 7. FINANZAS: Oro / Refugio de Valor (CoinGecko - PAXG)
    fetchAPI(
        'https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd',
        'api-oro',
        (data) => `$${data['pax-gold'].usd.toLocaleString('en-US')}`,
        'Error mercado global'
    );

    // =====================================================================
    // C. NAVEGACIÓN MÓVIL (MENÚ HAMBURGUESA)
    // =====================================================================
    const menuToggle = document.getElementById('menuToggle');
    const navLista = document.getElementById('navLista');

    if (menuToggle && navLista) {
        menuToggle.addEventListener('click', () => {
            navLista.classList.toggle('mostrar-menu');
        });
    }

    // =====================================================================
    // B. FUNCIÓN GLOBAL DE MANEJO DE ERRORES EN INTERFAZ
    // =====================================================================
    function mostrarErrorUI(contenedorResultadosId, contenedorConclusionesId, mensaje) {
        const areaResultados = document.getElementById(contenedorResultadosId);
        const areaConclusiones = document.getElementById(contenedorConclusionesId);
        
        if (areaConclusiones) areaConclusiones.style.display = 'none';
        
        areaResultados.innerHTML = `
            <div class="alerta-critica p-15 bg-peligro-claro text-rojo border-radius shadow-sm">
                <h4 class="mb-10"><i class="fa-solid fa-triangle-exclamation"></i> Error de Validación</h4>
                <p>${mensaje}</p>
                <p class="text-small mt-10 text-muted">Por favor, revise los datos ingresados en el formulario e intente nuevamente.</p>
            </div>
        `;
    }

    // =====================================================================
    // 1. SIMULADOR DE CARBURANTES
    // =====================================================================
    const formCarburantes = document.getElementById('formCarburantes');
    if (formCarburantes) {
        formCarburantes.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inicial = parseFloat(document.getElementById('reservaInicial').value);
            const consumo = parseFloat(document.getElementById('consumoDiario').value);
            const reabastecimiento = parseFloat(document.getElementById('reabastecimientoDiario').value);
            const critico = parseFloat(document.getElementById('nivelCritico').value);

            // Validaciones Estrictas
            if (isNaN(inicial) || isNaN(consumo) || isNaN(reabastecimiento) || isNaN(critico)) {
                mostrarErrorUI('areaResultadosCarburantes', 'conclusionesCarburantes', 'Debe ingresar valores numéricos en todos los campos.');
                return;
            }
            if (inicial < 0 || consumo < 0 || reabastecimiento < 0 || critico < 0) {
                mostrarErrorUI('areaResultadosCarburantes', 'conclusionesCarburantes', 'Los volúmenes de líquidos no pueden ser cantidades negativas.');
                return;
            }
            if (critico >= inicial) {
                mostrarErrorUI('areaResultadosCarburantes', 'conclusionesCarburantes', 'El Nivel Crítico no puede ser mayor o igual a la Reserva Inicial del surtidor.');
                return;
            }

            const balanceDiario = reabastecimiento - consumo;
            const areaResultados = document.getElementById('areaResultadosCarburantes');
            const conclusiones = document.getElementById('conclusionesCarburantes');
            const textoConclusion = document.getElementById('textoConclusionCarburantes');

            let htmlResultado = '';
            let diagnostico = '';

            if (balanceDiario >= 0) {
                htmlResultado = `
                    <div class="alerta-normal p-15 bg-verde-claro text-verde border-radius">
                        <h4 class="mb-10"><i class="fa-solid fa-check-circle"></i> Abastecimiento Sostenible</h4>
                        <p><strong>Balance Diario:</strong> +${balanceDiario} Litros/día</p>
                        <p>El surtidor recibe más (o igual) combustible del que vende. La reserva inicial de ${inicial} litros no llegará al nivel crítico bajo estas condiciones.</p>
                    </div>`;
                diagnostico = "El modelo indica estabilidad logística. No hay riesgo de desabastecimiento a corto plazo en este surtidor paceño si se mantienen las condiciones actuales de suministro.";
                conclusiones.style.display = 'block';
                textoConclusion.innerHTML = diagnostico;
            } else {
                const perdidaDiaria = Math.abs(balanceDiario);
                const litrosHastaCritico = inicial - critico;
                const diasHastaCritico = litrosHastaCritico / perdidaDiaria;

                let claseAlerta = diasHastaCritico <= 3 ? 'bg-peligro-claro text-rojo' : 'bg-alerta-claro text-naranja';
                let iconoAlerta = diasHastaCritico <= 3 ? 'fa-triangle-exclamation' : 'fa-clock';

                htmlResultado = `
                    <div class="alerta-critica p-15 ${claseAlerta} border-radius">
                        <h4 class="mb-10"><i class="fa-solid ${iconoAlerta}"></i> Déficit de Abastecimiento Detectado</h4>
                        <ul class="lista-resultados">
                            <li><strong>Pérdida neta diaria:</strong> ${perdidaDiaria.toFixed(2)} Litros/día</li>
                            <li><strong>Reserva actual:</strong> ${inicial} Litros</li>
                            <li><strong>Nivel de alerta (Crítico):</strong> ${critico} Litros</li>
                            <li class="destacado mt-10" style="font-size: 1.2em;"><strong>Tiempo estimado hasta colapso:</strong> ${diasHastaCritico.toFixed(1)} días</li>
                        </ul>
                    </div>`;
                
                if (diasHastaCritico < 1) {
                    diagnostico = "¡SITUACIÓN EXTREMA! El surtidor se quedará sin capacidad operativa hoy mismo. Se requiere racionamiento inmediato a minibuses y particulares para priorizar ambulancias y vehículos de emergencia.";
                } else if (diasHastaCritico <= 3) {
                    diagnostico = "Estado crítico. Las largas filas vaciarán el surtidor en menos de 72 horas. Es altamente probable que el administrador deba colocar el letrero de 'No hay gasolina/diésel' a corto plazo.";
                } else {
                    diagnostico = "Déficit moderado. Las reservas alcanzarán para la semana, pero si YPFB no incrementa el flujo de cisternas desde Senkata, la estación entrará en crisis pronto.";
                }
                
                conclusiones.style.display = 'block';
                textoConclusion.innerHTML = diagnostico;
            }

            areaResultados.innerHTML = htmlResultado;
        });

        document.getElementById('btnLimpiarCarburantes').addEventListener('click', () => {
            document.getElementById('areaResultadosCarburantes').innerHTML = '<div class="estado-vacio"><i class="fa-solid fa-clipboard-list icono-gigante text-muted"></i><p>Esperando datos válidos para simular la capacidad operativa...</p></div>';
            document.getElementById('conclusionesCarburantes').style.display = 'none';
        });
    }

    // =====================================================================
    // 2. SIMULADOR DE ALIMENTOS
    // =====================================================================
    const formAlimentos = document.getElementById('formAlimentos');
    if (formAlimentos) {
        formAlimentos.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const producto = document.getElementById('nombreProducto').value.trim();
            const precioInicial = parseFloat(document.getElementById('precioInicial').value);
            const precioActual = parseFloat(document.getElementById('precioActual').value);
            const cantidadSemanal = parseFloat(document.getElementById('cantidadSemanal').value);
            const semanas = parseFloat(document.getElementById('numeroSemanas').value);

            // Validaciones Estrictas
            if (!producto) {
                mostrarErrorUI('areaResultadosAlimentos', 'conclusionesAlimentos', 'Debe especificar el nombre del producto de la canasta familiar (Ej. Arroz, Pollo).');
                return;
            }
            if (isNaN(precioInicial) || isNaN(precioActual) || isNaN(cantidadSemanal) || isNaN(semanas)) {
                mostrarErrorUI('areaResultadosAlimentos', 'conclusionesAlimentos', 'Todos los campos de precios y cantidades deben contener valores numéricos.');
                return;
            }
            if (precioInicial <= 0 || precioActual <= 0 || cantidadSemanal <= 0 || semanas <= 0) {
                mostrarErrorUI('areaResultadosAlimentos', 'conclusionesAlimentos', 'Los precios, cantidades de compra y el tiempo deben ser mayores a cero.');
                return;
            }

            const incrementoPrecio = precioActual - precioInicial;
            const porcentajeAumento = ((precioActual - precioInicial) / precioInicial) * 100;
            
            const gastoSemanalAnterior = precioInicial * cantidadSemanal;
            const gastoSemanalActual = precioActual * cantidadSemanal;
            
            const gastoTotalAnterior = gastoSemanalAnterior * semanas;
            const gastoTotalActual = gastoSemanalActual * semanas;
            
            const impactoTotal = gastoTotalActual - gastoTotalAnterior;

            const areaResultados = document.getElementById('areaResultadosAlimentos');
            const conclusiones = document.getElementById('conclusionesAlimentos');
            const textoConclusion = document.getElementById('textoConclusionAlimentos');

            let htmlResultado = `
                <div class="tarjeta-comparativa border-radius p-15 bg-gris-claro">
                    <h4 class="text-verde mb-15">Análisis de Inflación: ${producto}</h4>
                    <div class="grid-2-columnas mb-15">
                        <div class="box-stat bg-blanco p-10 border-radius shadow-sm">
                            <span class="text-muted d-block text-small">Gasto Histórico (${semanas} sem)</span>
                            <span class="monto-historico text-tachado" style="font-size: 1.2em; color: gray;">${gastoTotalAnterior.toFixed(2)} Bs</span>
                        </div>
                        <div class="box-stat bg-blanco p-10 border-radius shadow-sm">
                            <span class="text-muted d-block text-small">Gasto Actual (${semanas} sem)</span>
                            <span class="monto-actual text-rojo font-bold" style="font-size: 1.4em;">${gastoTotalActual.toFixed(2)} Bs</span>
                        </div>
                    </div>
                    <ul class="lista-resultados">
                        <li><strong>Incremento por unidad:</strong> ${incrementoPrecio >= 0 ? '+' : ''}${incrementoPrecio.toFixed(2)} Bs</li>
                        <li><strong>Inflación específica del producto:</strong> ${porcentajeAumento.toFixed(1)}%</li>
                        <li class="mt-10 pt-10 border-top-dash"><strong>Impacto económico total:</strong> <span class="${impactoTotal > 0 ? 'text-rojo' : 'text-verde'} font-bold">${impactoTotal > 0 ? '-' : '+'}${Math.abs(impactoTotal).toFixed(2)} Bs</span></li>
                    </ul>
                </div>`;

            areaResultados.innerHTML = htmlResultado;
            
            let diagnostico = "";
            if (porcentajeAumento <= 0) {
                diagnostico = "No se registra inflación en este producto. El mercado se mantiene estable o ha bajado de precio temporalmente, lo cual es altamente favorable para la economía de su hogar.";
            } else if (porcentajeAumento <= 15) {
                diagnostico = "Existe una inflación moderada (" + porcentajeAumento.toFixed(1) + "%). Aunque afecta el bolsillo, la familia podría absorber este costo extra de " + impactoTotal.toFixed(2) + " Bs recortando pequeños gastos secundarios.";
            } else if (porcentajeAumento <= 50) {
                diagnostico = "¡Inflación Alta! El producto ha subido un " + porcentajeAumento.toFixed(1) + "%. Se está perdiendo " + impactoTotal.toFixed(2) + " Bs en el periodo evaluado. Se recomienda buscar sustitutos temporales o planificar compras al por mayor en ferias barriales.";
            } else {
                diagnostico = "¡ESPECULACIÓN CRÍTICA! Un aumento del " + porcentajeAumento.toFixed(1) + "% destruye la planificación del presupuesto base familiar. El sobreprecio pagado es insostenible a largo plazo. Es un claro indicador de crisis severa de abastecimiento comercial o monopolio en la distribución.";
            }

            conclusiones.style.display = 'block';
            textoConclusion.innerHTML = diagnostico;
        });

        document.getElementById('btnLimpiarAlimentos').addEventListener('click', () => {
            document.getElementById('areaResultadosAlimentos').innerHTML = '<div class="estado-vacio"><i class="fa-solid fa-cart-arrow-down icono-gigante text-muted"></i><p>Ingresa un producto a la izquierda respetando los rangos indicados para generar el análisis.</p></div>';
            document.getElementById('conclusionesAlimentos').style.display = 'none';
        });
    }

    // =====================================================================
    // 3. SIMULADOR DE TRANSPORTE
    // =====================================================================
    const formTransporte = document.getElementById('formTransporte');
    if (formTransporte) {
        formTransporte.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const distNormal = parseFloat(document.getElementById('distanciaNormal').value);
            const distDesvio = parseFloat(document.getElementById('distanciaDesvio').value);
            const costoKm = parseFloat(document.getElementById('costoKilometro').value);
            const viajes = parseFloat(document.getElementById('viajesSemana').value);

            // Validaciones Estrictas
            if (isNaN(distNormal) || isNaN(distDesvio) || isNaN(costoKm) || isNaN(viajes)) {
                mostrarErrorUI('areaResultadosTransporte', 'conclusionesTransporte', 'Debe ingresar valores numéricos en todos los campos.');
                return;
            }
            if (distNormal <= 0 || distDesvio <= 0 || costoKm <= 0 || viajes <= 0) {
                mostrarErrorUI('areaResultadosTransporte', 'conclusionesTransporte', 'Las distancias, costos y número de viajes deben ser estrictamente mayores a cero.');
                return;
            }
            if (distNormal >= distDesvio) {
                mostrarErrorUI('areaResultadosTransporte', 'conclusionesTransporte', 'Fallo de Lógica: La "Distancia con Desvío" debe ser obligatoriamente mayor a la "Distancia Normal" para que exista un impacto negativo por bloqueos.');
                return;
            }

            const costoViajeNormal = distNormal * costoKm;
            const costoViajeDesvio = distDesvio * costoKm;
            
            const costoAdicionalPorViaje = costoViajeDesvio - costoViajeNormal;
            const gastoAdicionalSemanal = costoAdicionalPorViaje * viajes;
            const gastoAdicionalMensual = gastoAdicionalSemanal * 4;

            const areaResultados = document.getElementById('areaResultadosTransporte');
            const conclusiones = document.getElementById('conclusionesTransporte');
            const textoConclusion = document.getElementById('textoConclusionTransporte');

            let htmlResultado = `
                <div class="tarjeta-comparativa border-radius p-15 bg-naranja-claro text-oscuro">
                    <h4 class="mb-15 text-naranja"><i class="fa-solid fa-truck-ramp-box"></i> Resumen de Sobrecostos Logísticos</h4>
                    <table class="tabla-resultados-simples w-100 mb-15">
                        <tr>
                            <td>Costo Viaje Normal:</td>
                            <td class="text-right"><strong>${costoViajeNormal.toFixed(2)} Bs</strong></td>
                        </tr>
                        <tr>
                            <td>Costo Viaje con Desvío:</td>
                            <td class="text-right"><strong>${costoViajeDesvio.toFixed(2)} Bs</strong></td>
                        </tr>
                        <tr class="border-top-dash">
                            <td>Pérdida neta por viaje:</td>
                            <td class="text-right text-rojo"><strong>-${costoAdicionalPorViaje.toFixed(2)} Bs</strong></td>
                        </tr>
                    </table>
                    <div class="caja-fuerte bg-blanco p-15 border-radius text-center box-shadow-small border-top-naranja">
                        <span class="d-block text-muted text-small">Fuga de capital mensual proyectada por bloqueos:</span>
                        <span class="d-block text-naranja font-bold mt-5" style="font-size: 1.8em;">${gastoAdicionalMensual.toFixed(2)} Bs</span>
                    </div>
                </div>`;

            areaResultados.innerHTML = htmlResultado;

            let diagnostico = "";
            if (gastoAdicionalMensual < 100) {
                diagnostico = "El impacto financiero por el desvío es leve. Genera una molestia operativa y un gasto extra de " + gastoAdicionalMensual.toFixed(2) + " Bs al mes, lo cual podría ser absorbido temporalmente sin necesidad de reajustar los fletes.";
            } else if (gastoAdicionalMensual < 1000) {
                diagnostico = "Impacto Moderado-Alto. Las vías alternas están causando pérdidas significativas (" + gastoAdicionalMensual.toFixed(2) + " Bs mensuales). Es altamente probable que el transportista empiece a trasladar este costo directamente al precio final del producto transportado (inflación).";
            } else {
                diagnostico = "¡PÉRDIDA LOGÍSTICA GRAVE! El sobrecosto mensual alcanza la suma crítica de " + gastoAdicionalMensual.toFixed(2) + " Bs. En este nivel de desgaste de insumos y diésel, la ruta alternativa deja de ser viable económicamente. El servicio operará a pérdida total o será suspendido, provocando desabastecimiento en el mercado de destino.";
            }

            conclusiones.style.display = 'block';
            textoConclusion.innerHTML = diagnostico;
        });

        document.getElementById('btnLimpiarTransporte').addEventListener('click', () => {
            document.getElementById('areaResultadosTransporte').innerHTML = '<div class="estado-vacio"><i class="fa-solid fa-map-location-dot icono-gigante text-muted"></i><p>Ingresa las distancias respetando los rangos para conocer tu gasto logístico adicional.</p></div>';
            document.getElementById('conclusionesTransporte').style.display = 'none';
        });
    }

    // =====================================================================
    // 4. SIMULADOR DE RUMORES Y ESCASEZ
    // =====================================================================
    const formEscasez = document.getElementById('formEscasez');
    if (formEscasez) {
        formEscasez.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const demandaNormal = parseFloat(document.getElementById('demandaNormal').value);
            const porcentajeRumor = parseFloat(document.getElementById('aumentoRumor').value);
            const stock = parseFloat(document.getElementById('stockDisponible').value);

            // Validaciones Estrictas
            if (isNaN(demandaNormal) || isNaN(porcentajeRumor) || isNaN(stock)) {
                mostrarErrorUI('areaResultadosEscasez', 'conclusionesEscasez', 'Debe utilizar únicamente valores numéricos en los campos del formulario.');
                return;
            }
            if (demandaNormal <= 0 || stock < 0 || porcentajeRumor < 0) {
                mostrarErrorUI('areaResultadosEscasez', 'conclusionesEscasez', 'Los valores base de demanda, inventario y porcentaje no pueden ser negativos ni equivalentes a cero.');
                return;
            }

            const aumentoDemandaUnidades = demandaNormal * (porcentajeRumor / 100);
            const nuevaDemanda = demandaNormal + aumentoDemandaUnidades;
            
            const balanceStock = stock - nuevaDemanda;

            const areaResultados = document.getElementById('areaResultadosEscasez');
            const conclusiones = document.getElementById('conclusionesEscasez');
            const textoConclusion = document.getElementById('textoConclusionEscasez');

            let htmlResultado = '';
            let diagnostico = '';

            if (balanceStock >= 0) {
                htmlResultado = `
                    <div class="alerta-normal border-radius p-15 bg-verde-claro text-verde shadow-sm">
                        <h4 class="mb-10"><i class="fa-solid fa-shield-check"></i> El Inventario Resiste el Pánico</h4>
                        <ul class="lista-resultados">
                            <li><strong>Pico de Demanda (Irreal):</strong> ${nuevaDemanda.toFixed(0)} unidades</li>
                            <li><strong>Stock Real del Comercio:</strong> ${stock} unidades</li>
                            <li class="mt-10 pt-10 border-top-dash"><strong>Sobrante de seguridad:</strong> ${balanceStock.toFixed(0)} unidades</li>
                        </ul>
                    </div>`;
                diagnostico = "Afortunadamente, el inventario estratégico de este negocio es lo suficientemente robusto como para absorber el pico de compras masivas provocado por el rumor de redes sociales. Todos los clientes lograrán comprar y la desinformación no logrará materializar la escasez.";
            } else {
                const familiasSinProducto = Math.abs(balanceStock);
                htmlResultado = `
                    <div class="alerta-critica border-radius p-15 bg-peligro-claro text-rojo shadow-sm">
                        <h4 class="mb-10"><i class="fa-solid fa-boxes-stacked"></i> Quiebre Matemático de Stock</h4>
                        <div class="stats-escasez grid-2-columnas mb-15 text-center mt-15">
                            <div class="bg-blanco p-10 border-radius shadow-sm">
                                <span class="d-block text-muted text-small">Demanda Especulativa</span>
                                <strong style="font-size: 1.5em;">${nuevaDemanda.toFixed(0)}</strong>
                            </div>
                            <div class="bg-blanco p-10 border-radius shadow-sm">
                                <span class="d-block text-muted text-small">Inventario Disponible</span>
                                <strong style="font-size: 1.5em;">${stock}</strong>
                            </div>
                        </div>
                        <div class="mensaje-alerta bg-rojo text-blanco p-15 border-radius text-center box-shadow-small">
                            <strong>DÉFICIT LOGÍSTICO:</strong><br> Faltan ${familiasSinProducto.toFixed(0)} unidades de producto para lograr cubrir el pánico.
                        </div>
                    </div>`;
                
                diagnostico = "El rumor digital ha provocado un colapso directo en la cadena de distribución minorista. El miedo ciudadano hizo que la demanda subiera un " + porcentajeRumor + "%, arrasando rápidamente con el inventario planificado. El impacto final es que " + familiasSinProducto.toFixed(0) + " familias (que muy probablemente necesitaban el producto para el día) se quedarán con las manos vacías. La escasez fue originada puramente por el miedo y la especulación.";
            }

            areaResultados.innerHTML = htmlResultado;
            conclusiones.style.display = 'block';
            textoConclusion.innerHTML = diagnostico;
        });

        document.getElementById('btnLimpiarEscasez').addEventListener('click', () => {
            document.getElementById('areaResultadosEscasez').innerHTML = '<div class="estado-vacio"><i class="fa-solid fa-chart-bar icono-gigante text-muted"></i><p>Ingresa los niveles de demanda y stock respetando los ranges para generar el reporte de escasez.</p></div>';
            document.getElementById('conclusionesEscasez').style.display = 'none';
        });
    }

    // =====================================================================
    // 5. SIMULADOR DE PODER ADQUISITIVO
    // =====================================================================
    const formEconomia = document.getElementById('formEconomia');
    if (formEconomia) {
        formEconomia.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const ingreso = parseFloat(document.getElementById('ingresoMensual').value);
            const gastoAnt = parseFloat(document.getElementById('gastoAnterior').value);
            const gastoAct = parseFloat(document.getElementById('gastoActual').value);

            // Validaciones Estrictas
            if (isNaN(ingreso) || isNaN(gastoAnt) || isNaN(gastoAct)) {
                mostrarErrorUI('areaResultadosEconomia', 'conclusionesEconomia', 'Verifique que todos los campos del formulario de presupuesto contengan números válidos.');
                return;
            }
            if (ingreso <= 0 || gastoAnt < 0 || gastoAct < 0) {
                mostrarErrorUI('areaResultadosEconomia', 'conclusionesEconomia', 'El ingreso base familiar mensual debe ser mayor a cero. Los gastos estipulados no pueden ser negativos.');
                return;
            }

            const aumentoGasto = gastoAct - gastoAnt;
            const porcentajePerdida = (aumentoGasto / ingreso) * 100;
            
            const saldoAnterior = ingreso - gastoAnt;
            const saldoActual = ingreso - gastoAct;

            const areaResultados = document.getElementById('areaResultadosEconomia');
            const conclusiones = document.getElementById('conclusionesEconomia');
            const textoConclusion = document.getElementById('textoConclusionEconomia');

            let htmlResultado = '';
            let diagnostico = '';

            htmlResultado += `
                <div class="tarjeta-comparativa border-radius p-15 bg-gris-claro mb-15 shadow-sm border-top-rojo">
                    <h4 class="text-rojo mb-10"><i class="fa-solid fa-money-bill-transfer"></i> Flujo de Caja Familiar</h4>
                    <table class="tabla-resultados-simples w-100">
                        <tr>
                            <td>Margen de Ahorro Histórico:</td>
                            <td class="text-right"><strong>${saldoAnterior.toFixed(2)} Bs</strong></td>
                        </tr>
                        <tr>
                            <td>Margen de Ahorro Actual:</td>
                            <td class="text-right"><strong>${saldoActual.toFixed(2)} Bs</strong></td>
                        </tr>
                        <tr class="border-top-dash">
                            <td>Variación Real del Gasto Básico:</td>
                            <td class="text-right text-rojo"><strong>+${aumentoGasto.toFixed(2)} Bs</strong></td>
                        </tr>
                    </table>
                </div>
            `;

            if (saldoActual < 0) {
                const montoFaltante = Math.abs(saldoActual);
                htmlResultado += `
                    <div class="estado-critico bg-rojo text-blanco p-20 border-radius text-center shadow-md">
                        <h3 class="mb-5"><i class="fa-solid fa-triangle-exclamation"></i> PRESUPUESTO QUEBRADO</h3>
                        <p style="font-size: 1.1em; margin-bottom:15px;">Faltan <strong>${montoFaltante.toFixed(2)} Bs</strong> al hogar para llegar a fin de mes.</p>
                        <span class="badge bg-blanco text-rojo d-inline-block p-10 border-radius font-bold" style="font-size:1.1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Poder Adquisitivo Perdido: ${porcentajePerdida.toFixed(1)}%</span>
                    </div>`;
                
                diagnostico = "ESTADO CRÍTICO: Los ingresos estáticos ("+ingreso+" Bs) ya no logran cubrir la canasta básica inflada ("+gastoAct+" Bs). Has perdido un "+porcentajePerdida.toFixed(1)+"% del valor real de tu sueldo. La familia está oficialmente en déficit presupuestario y requiere obligatoriamente financiamiento externo urgente (préstamos, empeños) o recortar su alimentación/educación sustancialmente para sobrevivir las próximas semanas.";
            } else if (saldoActual === 0) {
                htmlResultado += `
                    <div class="estado-alerta bg-naranja text-blanco p-20 border-radius text-center shadow-md">
                        <h3 class="mb-5"><i class="fa-solid fa-scale-unbalanced"></i> AL LÍMITE EXACTO</h3>
                        <p style="font-size: 1.1em; margin-bottom:15px;">El sueldo cubre estrictamente los gastos mensuales. Saldo: 0 Bs.</p>
                        <span class="badge bg-blanco text-naranja d-inline-block p-10 border-radius font-bold" style="font-size:1.1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Poder Adquisitivo Perdido: ${porcentajePerdida.toFixed(1)}%</span>
                    </div>`;
                diagnostico = "ALERTA ROJA FINANCIERA: Economía de sobrevivencia sin margen de error. Todo el dinero generado se destina al consumo primario. Al tener un saldo nulo, no hay capacidad de ahorro, inversión ni resiliencia económica ante una enfermedad o subida repentina de pasajes. La calidad de vida de esta familia está en alto riesgo de caer a la línea de pobreza extrema.";
            } else {
                htmlResultado += `
                    <div class="estado-stable bg-verde text-blanco p-20 border-radius text-center shadow-md">
                        <h3 class="mb-5"><i class="fa-solid fa-piggy-bank"></i> SALDO POSITIVO</h3>
                        <p style="font-size: 1.1em; margin-bottom:15px;">Aún existe liquidez por <strong>${saldoActual.toFixed(2)} Bs</strong>.</p>
                        <span class="badge bg-blanco text-verde d-inline-block p-10 border-radius font-bold" style="font-size:1.1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Poder Adquisitivo Perdido: ${porcentajePerdida.toFixed(1)}%</span>
                    </div>`;
                
                if (aumentoGasto > 0) {
                    diagnostico = "PRECAUCIÓN Y ALERTA AMARILLA: Aunque el presupuesto aún resiste y la familia no entra en mora, la inflación de los mercados ha devaluado el "+porcentajePerdida.toFixed(1)+"% del salario original. El colchón financiero mensual (ahorro libre) se ha reducido peligrosamente de "+saldoAnterior+" Bs a solo "+saldoActual+" Bs, limitando el crecimiento económico del hogar a futuro.";
                } else {
                    diagnostico = "ESTABILIDAD FINANCIERA: La economía de este hogar se mantiene sólida frente a la coyuntura macroeconómica. No existe pérdida del valor adquisitivo reportada según la parametrización de gastos ingresada.";
                }
            }

            areaResultados.innerHTML = htmlResultado;
            conclusiones.style.display = 'block';
            textoConclusion.innerHTML = diagnostico;
        });

        document.getElementById('btnLimpiarEconomia').addEventListener('click', () => {
            document.getElementById('areaResultadosEconomia').innerHTML = '<div class="estado-vacio"><i class="fa-solid fa-magnifying-glass-chart icono-gigante text-muted"></i><p>Ingresa tus datos de ingresos y gastos respetando los rangos para generar el reporte financiero.</p></div>';
            document.getElementById('conclusionesEconomia').style.display = 'none';
        });
    }

});
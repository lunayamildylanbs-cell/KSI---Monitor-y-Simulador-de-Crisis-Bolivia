# KSI - Monitor y Simulador de Crisis Bolivia 🇧🇴

## 📌 Datos Académicos
* **Nombre completo:** Yamil Dylan Luna Quispe
* **Materia:** Programación Web I
* **Institución:** Universidad Mayor de San Andrés (UMSA)
* **Gestión:** 2026
* **Título del proyecto:** Simulador web de abastecimiento, precios y consumo familiar en contexto de crisis

## 🔗 Enlaces de Entrega
- **Página web (GitHub Pages):** https://lunayamildylanbs-cell.github.io/KSI---Monitor-y-Simulador-de-Crisis-Bolivia/
- **Repositorio GitHub:** https://github.com/lunayamildylanbs-cell/KSI---Monitor-y-Simulador-de-Crisis-Bolivia

---

## 📝 Descripción del Proyecto
**KSI** es una aplicación web educativa e interactiva desarrollada como desafío final para la asignatura de Programación Web I. Su objetivo principal es representar, calcular y visualizar mediante modelos matemáticos sencillos los problemas socioeconómicos reales que atraviesa Bolivia (2025-2026), sin tomar una posición política, sino enfocándose en la educación financiera y logística.

La plataforma permite a cualquier ciudadano simular escenarios de crisis para tomar decisiones informadas sobre su economía familiar.

## 🚀 Funcionalidades y Módulos (Escenarios)
El proyecto incluye 5 calculadoras interactivas basadas en problemas reales:
1. **Escenario A (Carburantes):** Calcula el punto crítico de reserva de una estación de servicio frente a la alta demanda y bajo reabastecimiento.
2. **Escenario B (Alimentos):** Mide el impacto inflacionario en la canasta familiar y el sobreprecio semanal.
3. **Escenario C (Transporte):** Evalúa la pérdida económica logística generada por los desvíos obligatorios ante bloqueos de carreteras.
4. **Escenario D y F (Poder Adquisitivo):** Analiza el flujo de caja de un hogar para determinar el porcentaje de pérdida del valor adquisitivo del salario.
5. **Escenario E (Escasez por Pánico):** Demuestra matemáticamente cómo la especulación y los rumores en redes sociales provocan quiebres de stock inmediatos.

Adicionalmente, el proyecto consume **APIs públicas en tiempo real** (Open Exchange Rates, Open-Meteo, CoinGecko) para mostrar el tipo de cambio oficial, factores climáticos que afectan la logística y métricas de refugio de valor.

## 🛠️ Tecnologías Utilizadas
* **HTML5 Semántico:** Estructuración de 6 páginas (`index` + 5 módulos).
* **CSS3 Avanzado:** Diseño modular, variables (Design System), Flexbox, CSS Grid, animaciones y diseño 100% responsivo (Media Queries). Estilo Neumórfico y Glassmorphism.
* **Vanilla JavaScript (ES6+):** Lógica matemática, validaciones estrictas y manipulación dinámica del DOM sin recargar la página.
* **Fetch API:** Consumo asíncrono de datos externos.
* **Git & GitHub:** Control de versiones y alojamiento de código.

## 📂 Estructura de Carpetas
```text
KSI/
│
├── index.html                  # Dashboard principal y monitor de noticias
├── carburantes.html            # Simulador Escenario A
├── alimentos.html              # Simulador Escenario B
├── transporte.html             # Simulador Escenario C
├── poder_adquisitivo.html      # Simulador Escenarios D y F
├── escasez.html                # Simulador Escenario E
│
├── css/
│   └── estilos.css             # Hoja de estilos única y centralizada
│
├── js/
│   └── script.js               # Lógica de DOM, cálculos y consumo de APIs
│
├── img/                        # Carpeta de recursos gráficos locales
│   └── (imágenes del proyecto)
│
└── README.md                   # Documentación del proyecto

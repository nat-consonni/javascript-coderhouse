// Base de datos simulada de las tiendas y los productos
// para el ID de cada tienda: iniciales tienda + guión (-) + iniciales tienda
// para el ID de cada producto: iniciales tienda + numero con tres digitos
// pesos en uruguayos
// No sé si Brasil o también incluir Brazil... para pensar como parte de UX futura

const tiendas = [
    { 
      id: "tienda-sdm",
      nombre: "Sabores del Mundo",
      productos: [
        { id: "SDM-001", nombre: "Leche de Coco", marca: "ThaiPure", paisesPreferencia: ["Tailandia", "Brasil"], disponible: true, cantidad: 10, precio: 150 },
        { id: "SDM-002", nombre: "Té Chai", marca: "YogiTea", paisesPreferencia: ["India", "Alemania"], disponible: true, cantidad: 25, precio: 290 },
        { id: "SDM-003", nombre: "Salsa Sriracha", marca: "Flying Goose", paisesPreferencia: ["Tailandia"], disponible: true, cantidad: 15, precio: 190 },
        { id: "SDM-004", nombre: "Galletas de Arroz", marca: "Korean Taste", paisesPreferencia: ["Corea del Sur"], disponible: true, cantidad: 20, precio: 120 },
        { id: "SDM-005", nombre: "Pasta de Miso", marca: "Hikari", paisesPreferencia: ["Japón"], disponible: true, cantidad: 5, precio: 310 },
        { id: "SDM-006", nombre: "Curry Japonés", marca: "House Foods", paisesPreferencia: ["Japón"], disponible: true, cantidad: 7, precio: 250 },
        { id: "SDM-007", nombre: "Leche de Almendras", marca: "Almond Breeze", paisesPreferencia: ["EE.UU."], disponible: true, cantidad: 30, precio: 145 },
        { id: "SDM-008", nombre: "Aceite de Sésamo", marca: "Asian Pride", paisesPreferencia: ["China", "Corea"], disponible: false, cantidad: 0, precio: 220 },
        { id: "SDM-009", nombre: "Arroz Basmati", marca: "Tilda", paisesPreferencia: ["India"], disponible: true, cantidad: 18, precio: 140 },
        { id: "SDM-010", nombre: "Sopa Tom Yum", marca: "Thai Chef", paisesPreferencia: ["Tailandia"], disponible: true, cantidad: 9, precio: 210, destacado: true },
      ]
    },
    {
      id: "tienda-erm",
      nombre: "El Rincón del Migrante",
      productos: [
        { id: "ERM-001", nombre: "Harina de Mandioca", marca: "Natural Brasil", paisesPreferencia: ["Brasil", "Paraguay"], disponible: true, cantidad: 8, precio: 120 },
        { id: "ERM-002", nombre: "Leche de Coco", marca: "CocoLoco", paisesPreferencia: ["Brasil"], disponible: false, cantidad: 0, precio: 130 },
        { id: "ERM-003", nombre: "Feijoada enlatada", marca: "Sabores do Brasil", paisesPreferencia: ["Brasil"], disponible: true, cantidad: 12, precio: 160 },
        { id: "ERM-004", nombre: "Dulce de Guayaba", marca: "La Fruta", paisesPreferencia: ["Colombia", "Venezuela"], disponible: true, cantidad: 5, precio: 100 },
        { id: "ERM-005", nombre: "Galletas María", marca: "Cuétara", paisesPreferencia: ["España", "México"], disponible: true, cantidad: 18, precio: 95 },
        { id: "ERM-006", nombre: "Yerba Mate", marca: "La Merced", paisesPreferencia: ["Argentina", "Uruguay"], disponible: true, cantidad: 20, precio: 180 },
        { id: "ERM-007", nombre: "Tamarindo Concentrado", marca: "Jarritos", paisesPreferencia: ["México"], disponible: false, cantidad: 0, precio: 160 },
        { id: "ERM-008", nombre: "Café Colombiano", marca: "Juan Valdez", paisesPreferencia: ["Colombia"], disponible: true, cantidad: 6, precio: 270 },
        { id: "ERM-009", nombre: "Pan de Bono Congelado", marca: "PanAndino", paisesPreferencia: ["Colombia"], disponible: true, cantidad: 10, precio: 220 },
        { id: "ERM-010", nombre: "Té Verde Matcha", marca: "MatchaZen", paisesPreferencia: ["Japón", "EE.UU."], disponible: true, cantidad: 4, precio: 310, destacado: true },
      ]
    },
    {
      id: "tienda-cys",
      nombre: "Cultura y Sabor",
      productos: [
        { id: "CYS-001", nombre: "Té Chai", marca: "Organic India", paisesPreferencia: ["India"], disponible: true, cantidad: 5, precio: 310 },
        { id: "CYS-002", nombre: "Yerba con Jengibre", marca: "Del Mate", paisesPreferencia: ["Uruguay", "Argentina"], disponible: true, cantidad: 12, precio: 180 },
        { id: "CYS-003", nombre: "Salsa Picante Mexicana", marca: "Valentina", paisesPreferencia: ["México"], disponible: true, cantidad: 15, precio: 95 },
        { id: "CYS-004", nombre: "Aceite de Oliva Virgen", marca: "Oleo", paisesPreferencia: ["España", "Italia"], disponible: true, cantidad: 9, precio: 350 },
        { id: "CYS-005", nombre: "Fideos de Arroz", marca: "Bamboo House", paisesPreferencia: ["Vietnam", "China"], disponible: true, cantidad: 14, precio: 160, destacado: true  },
        { id: "CYS-006", nombre: "Salsa Teriyaki", marca: "Kikkoman", paisesPreferencia: ["Japón"], disponible: true, cantidad: 7, precio: 200 },
        { id: "CYS-007", nombre: "Harina de Garbanzo", marca: "EcoLegum", paisesPreferencia: ["India", "Uruguay"], disponible: false, cantidad: 0, precio: 140 },
        { id: "CYS-008", nombre: "Sopa de Miso Instantánea", marca: "Ajinomoto", paisesPreferencia: ["Japón"], disponible: true, cantidad: 10, precio: 190 },
        { id: "CYS-009", nombre: "Leche de Avena", marca: "Oatly", paisesPreferencia: ["Suecia", "Alemania"], disponible: true, cantidad: 8, precio: 155 },
        { id: "CYS-010", nombre: "Café Turco", marca: "Kurukahveci", paisesPreferencia: ["Turquía"], disponible: true, cantidad: 5, precio: 280 },
      ]
    }
  ];
  
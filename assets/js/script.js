// Función para obtener un personaje de la API de Star Wars. (swapi.dev)
async function* obtenerPersonajeApi(primero, ultimo) {
  const url = "https://swapi.dev/api/people/"; //URL API

  for (let i = primero; i <= ultimo; i++) {
    try {
      const response = await fetch(`${url}${i}/`); // obtener personaje
      if (!response.ok) {
        throw new Error(`Error en la petición ${i}: ${response.statusText}`);
      }
      const data = await response.json();
      yield data;
    } catch (error) {
      console.error(`Error al obtener el personaje ${i}:`, error);
    }
  }
}

// Función para insertar Card de personajes con su información en el HTML
function InsertarCardPersonaje(dataApi, rowTimeLine, colorClass) {
  const { name, height, mass } = dataApi;
  const cardRow = document.getElementById(`${rowTimeLine}`);
  let card = `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="single-timeline-content d-flex wow fadeInLeft" data-wow-delay="0.5s" style="visibility: visible; animation-delay: 0.5s; animation-name: fadeInLeft;">
               <div class="timeline-icon ${colorClass}"><i class="fa fa-address-card" aria-hidden="true"></i></div>
              <div class="timeline-text">
                  <h6>${name}</h6>
                  <p>Estatura: ${height} cm. Peso: ${mass} kg.</p>
              </div>
          </div>
        </div>
      `;
  cardRow.insertAdjacentHTML("beforeend", card);
}

// Función para obtener los siguientes personajes de la API.
async function obtenerSiguientePersonaje(generator, rowTimeLine, colorClass) {
  const { done, value } = await generator.next();
  if (done) {
    console.log("Todos los personajes han sido obtenidos.");
    return;
  }

  if (value.error) {
    console.error(value.error);
    return;
  }

  // Insertar Card de personaje con su información en el HTML
  InsertarCardPersonaje(value, rowTimeLine, colorClass);
}

// Definir las columnas de las secciones
const cardPopulares = document.getElementById("col-populares");
const cardSecundarios = document.getElementById("col-secundarios");
const cardSignificativos = document.getElementById("col-significativos");

// Generadores
let obtenerPersonajesPrincipales;
let obtenerPersonajesSecundarios;
let obtenerPersonajeSignificativos;

// Función para resetear los generadores
function resetGeneradores() {
  obtenerPersonajesPrincipales = obtenerPersonajeApi(1, 5);
  obtenerPersonajesSecundarios = obtenerPersonajeApi(6, 10);
  obtenerPersonajeSignificativos = obtenerPersonajeApi(11, 15);
}

resetGeneradores();

//Manjeadores de eventos para los cards de personajes

cardPopulares.addEventListener("mouseenter", () => {
  obtenerSiguientePersonaje(
    obtenerPersonajesPrincipales,
    "row-populares",
    "star-wars-populares"
  );
});

cardSecundarios.addEventListener("mouseenter", () => {
  obtenerSiguientePersonaje(
    obtenerPersonajesSecundarios,
    "row-secundarios",
    "star-wars-secundarios"
  );
});

cardSignificativos.addEventListener("mouseenter", () => {
  obtenerSiguientePersonaje(
    obtenerPersonajeSignificativos,
    "row-significativos",
    "star-wars-significativos"
  );
});

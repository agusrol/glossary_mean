//Este doc maneja la lógica de despliegue, el front. Esto se ejecuta en el navegador del consumidor o nodo. Esta es una forma de hacerlo, haciendo
// que la carga computacional esté en el navegador y se maneje parte de la lógica ahí en el front. Otra forma es agarrando y que Express o Node.js manejen
// esta lógica y "sirvan" los datos ya masticados, en ese caso es el servidor el que hace los tejes y manejes.
//En resumen, este archivo es la lógica del lado del cliente.

const apiUrl = '/words'; //endpoint API

//Fetch and display words
async function fetchWords(){ //Declaramos función de java
    const response = await fetch(apiUrl); //Hacemos petición HTTP, await es para que primero tengamos respuesta del fetch, tenemos sí o sí respuesta del server.
    const words = await response.json(); //Parseamos el json, await hace lo mismo de antes (si no una cagada seguir si no parseaste! Al menos tener un error)
    const wordList = document.getElementById('wordList'); //Seleccionamos elementos con id=wordList y los mandamos a wordList
    wordList.innerHTML = words.map(word =>  //Para cada elemento en esa lista, hacemos este string con código HTML  
        `
    <tr>
      <td>${word.word}</td>
      <td>${word.definition}</td>
      <td>
        <button onclick="editWord('${word._id}', '${word.word}', '${word.definition}')">Edit</button>
        <button onclick="deleteWord('${word._id}')">Delete</button>
      </td>
    </tr>
         
        `
    ).join(''); //Combinamos todos en  un único string, así es una sábana de HTML
}


// Add or Update a word
async function saveWord(event) { //Creamos función para guardar palabra
    event.preventDefault(); //Esto es para que no recargue la página al enviar formulario
    const id = document.getElementById('wordId').value; //Sacamos el id de las palabras con id=wordId
    const word = document.getElementById('word').value; //Traemos el valor del input que tiene id = 'word'
    const definition = document.getElementById('definition').value; // Traemos el valor del input que tiene 'definition' como id
  
    const method = id ? 'PUT' : 'POST'; //Si existe id usamos PUT para actualizar, si no usamos POST para agregar la palabra
    const url = id ? `${apiUrl}/${id}` : apiUrl; //Armamos la URL o endpoint para la request con la dirección de la api y el id de la palabra
  
    await fetch(url, {  //Mandar request HTTP 
      method, //El método elegido antes
      headers: { 'Content-Type': 'application/json' }, //La cabecera MIME
      body: JSON.stringify({ word, definition }) //Pasamos a string con formato json para que esté en el body de la request y después lo parsee Express en el server
    });
  
    document.getElementById('wordForm').reset(); //Reseteamos los campos del formulario una vez que está hecha la request
    fetchWords(); //Llamamos a la función fetchWords() para refrescar la página  con los nuevos valores
  }
  
  // Delete a word
  async function deleteWord(id) {  //Declaramos función para eliminar una palabra
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });  //Envíamos una petición HTTP delete a la url especificada usando el id
    fetchWords(); //Refrescamos
  }
  
  // Prefill form for editing
  function editWord(id, word, definition) { //Declaramos función para rellenar formulario que vamos a modificar
    document.getElementById('wordId').value = id; //Traemos los valores y los metemos en el DOM
    document.getElementById('word').value = word;
    document.getElementById('definition').value = definition;
  }
  
  // Initialize
  document.getElementById('wordForm').addEventListener('submit', saveWord); //Agregamos listener al formulario con id wordForm, que cuando clickeamos en submit
  //llama al callback saveWord
  fetchWords(); //Llamamos para inicializar la página
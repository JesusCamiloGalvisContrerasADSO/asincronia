// Solucione el mismo ejercicio, utilizando solo promesas no
// async/await.
// c. Describa el paso a paso del ejercicio (comente cada línea de código

// se crea un constante y se le coloca un array function la cual va a realizar el fitrado, va a buscar en el objeto el atributo name y busca el que sea igual a 'Evaluacion'
const filtrar = (x) => x.name === "Evaluacion";
// se crea una funcion anonima autoejecutable asincrona donde vamos a realizar la operacion
(async () => {
  // se utiliza el try catch para manejo de errores
  try {
    // se coloca el fetch para extraer los datos del documento .json, implicitamente el genera una promise por lo cual se puede manejar con el .then y con el .catch, por lo tanto retornara resolve o reject, se cumple o no se cumple
    fetch("data.json")
      // aqui con el .then podemos convertir el archivo .json a un archivo js, se le pasa el argumento con el cual se va a trabajar y se coloca el array function
      .then((user) => {
        // si se bajo todo sin presentar ningun error se retorna el archivo convertido en js, el .json retorna una promesa por lo cual sabremos si se cumplio o no se cumplio
        return user.json();
      })
      // se coloca otro .then en donde vamos a pasarle la api para poder bajar los datos del usuario con el cual vamos a trabajar, estamos encadenando promesas, por lo cual o que la anterior nos retorno esta lo recibe y lo toma como la variable usuario
      .then((usuario) => {
        // aqui se bajan los datos que estan en el api, el siguiente fetch esta dentro del anterior para tener los datos del usuaro que ya habiamos bajado del .json
        fetch(`https://api.github.com/users/${usuario.name}/repos`)
          // y dentro de el volvemos a manejar el  .then para poder extraer los datos y poder mostrarlos luego en consola, el argumento que le pasamos al .then es el resultado del fetch
          .then((userGit) => {
            // retorna el archivo convertido del .json() es una promise por lo cual va a retorna el resolve o el reject, si se cumple nos dara el resultado convertido a js
            return userGit.json();
          })
          // volvemos a usar el .then para realizar el filtrado que vamos a implementar
          .then((usuarioGithub) => {
            // realizamos el forEach para poder iterar sobre el arreglo que nos da la api, todos los elementos que tiene el usuario que nos da el .json
            // usuarioGithub.forEach((element) => {
            //   // aqui indicamos que si en el parametro nombre del objeto es igual a evaluacion lo muestre por consola de lo contrario no muestre nada
            //   if (element.name === "Evaluacion") {
            //     console.log(element);
            //   }
            // });
            // y aqui se realiza el filtrado que creamos en el principio con el metodo .filter el cual nos va a permitir iterar sobre el arreglo parandole la funcion, esto es un callback
            let data = usuarioGithub.filter(filtrar);
            // y aqui imprimimos el usuario completo, con todos sus datos y repositorios
            console.log(data);
          })
          // aqui es el catch que se ejecuta en caso que no se cumpla, nos retorne rejectec, o algun codigo que estamos haciendo o se genere un error nos va a enviar aqui para determinar donde se presento el error
          .catch(() => {
            return error;
          });
      })
      // aqui es el catch que se ejecuta en caso que no se cumpla algun codigo que estamos haciendo o se genere un error nos va a enviar aqui para determinar donde se presento el error
      .catch(() => {
        return error;
      });

    // aqui es el catch que se ejecuta en caso que no se cumpla algun codigo que estamos haciendo o se genere un error nos va a enviar aqui para determinar donde se presento el error, nos mostrara en consola el error, lo que le pasamos
  } catch (error) {
    // aqui imprimimos el error, le pasamos el texto que queremos que se muestre y mandamos el error con interpolacion
    console.error(
      `Se presento un error al momento de bajar los datos ${error}`
    );
  }
  // y este es el final de la function, esos dos parentesis son lo que la hacen autoejecutable
})();

//creamos una funcion anonima autoejecutable, es una array funtion
(() => {
  // se coloca el fetch como es una promesa se puede manejar con .then y con .catch, se le pasa el archivo .json para bajar los datos
  fetch("data.json")
    //se coloca el .then y se le pasa un argumento response, con este se le esta pasando la los datos que se bajaron del fetch, se utiliza
    .then((response) => {
      // con esto menejamos el error, esto verifica que el fetch se halla bajado correctamente por eso se coloca el signo de negacion !response.ok significa que si la respuesta del fetch no fue ok mande el error
      if (!response.ok) {
        // esto es para que si se llega a cumplir la condicion se genere el error
        throw new Error("Error al descargar los datos del API");
      }
      // en caso de que no se presente ningun error se retorna el archivo convertido en js con la promesa del .json que respindera si es resolve
      return response.json();
    })
    // encadenamos .then y le pasamos user que seria el archivo .json convertido en JS
    .then((user) => {
      // aqui hacemos la validacion de que el aprendiz sea aprendiz o no, como los valores de si es aprendiz o no estan el boleanos(true y false) entonces podemos determinar si se cumple o n con el filter
      const usuarios = user.users.filter((u) => u.aprendiz);
      // cree esta funcion para imprimir todos los usuarios, esto es una calbak que sera llamada cada vez que un este pasando por un usuario
      const imprimir = (x) => {
        // este console.log  imprime el valor de x que fue pasado desde abajo el .then donde se le pasa el dato qu se extrajo del api
        console.log(x);
      };
      // creamos una variable y le asignamos usuarios que ya pasaron con el filtro y si son aprendiz, luego a eso el metodo .map que crea un nuevo arreglo con los resultados que da
      const promises = usuarios.map((element) => {
        // retornamos el fetch, en este vamos a bajar los resultados del api y el element es cada objeto que tenemos en el .json, es una promesa
        return (
          fetch(`https://api.github.com/users/${element.user}`)
            //volvemos a realizar el mismo procedimiento, debemos convertir los datos a archivo .JS
            .then((respuestaGithub) => {
              //esto es el manejo de errores en caso de que no se bajen de manera correcta los datos
              if (!respuestaGithub.ok) {
                // aqui es donde se manda el error al catch
                throw new Error(
                  `Error al descargar los datos del API de GitHub para el usuario ${element.user}`
                );
              }
              // en caso de que todo salga bien lo retorne en archivo js
              return respuestaGithub.json();
            })
            // aqui es donde llamamos la funcion imprimir y le pasamos el dato del usuario en data para qu lo pueda imprimir, esta es la callback
            .then((data) => {
              imprimir(data);
            })
            //aqui es donde le vamos a undicar que nos retorne el nombre del usuario y el avatar accediendo desde el git hub
            .then((usuarioGithub) => {
              // en este le colocamos que retorne el nombre y el avatar de cada usuario
              return {
                name: element.name,
                // aqui se coloca el usuarioGithub.avatar_url para que busque la url del avatar
                avatar: usuarioGithub.avatar_url,
              };
            })
            //estamos capturando el error con el catch e imprimiendo por que, eso es muy util para saber en dode se presento el error del cpdigo
            .catch((error) => {
              console.error(
                `Error obteniendo el avatar de ${element.user}:`,
                error
              );
              // y para que no genere conflicto con el promises.all le retornamos el avatar como null, en caso de que no tenga o se presente un error
              return { name: element.name, avatar: element.user };
            })
        );
      });
      // retornamos el promise.all(promises) para que cuando todas las primesas se cumplieron muestre por pantalla, de lo contrario no
      return Promise.all(promises);
    })
    // y este siguiente .then captura el resultado anterior y lo manda a imprimir por consola en una tabla
    .then((results) => {
      // con este le indicamos que debe mostrar los resultados y de esos resultados solo el name y el avatar
      console.table(results, ["name", "avatar"]);
    })
    // volvemos a colocar el .then para imprimir los datos en un Array por si acaso
    .then((results) => {
      // la imprecion
      console.log(results);
    })
    // con el catch capturamos el error y lo mostramos por pantalla, se le pasa el error, tiene una array funtion
    .catch((error) => {
      console.error("Error general:", error);
    });
})();

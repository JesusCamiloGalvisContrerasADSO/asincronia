// creamos una funcion anonima autoejecutable asincrona
(async () => {
  // manejamos errores con try catch
  try {
    // Se utiliza fetch para extraer los datos del archivo .json, se utiliza el await para que el resto del codigo espere a que se cumpla la promesa
    let datos = await fetch("data.json");
    // verificamos que el archivo .json se halla extrraido correctamente
    if (!datos.ok) {
      throw new Error("Error al descargar los datos del archivo user.json");
    }
    // se convierte el archivo .json a JS y volvemos a utilizar el await para que el resto de codigo espere a que se conviertan los datos a JS
    let user = await datos.json();

    // Filtrar solo los usuarios que tienen el rol de aprendiz con el .filter, a eso se le pasa una funcion
    let usuarios = user.users.filter((u) => u.aprendiz);
    // verificamos que el array se array de lo contrario se genera el error
    if (!Array.isArray(usuarios)) {
      throw new Error("El formato de los datos no es correcto");
    }

    // Mapeamos los usuarios para obtener los datos de GitHub de cada uno, el .map es un metodo el cual genera un nuevo array al realizar la fncion que se le de
    let promises = usuarios.map(async (element) => {
      // se descargan los datos del api con el fech, el fetch es una promesa, el cual va a restornar el resolve o el reject, se cumple o no se cumple y se le asigna a la variable, aqui se descargan los datos del api
      let usuarioGit = await fetch(
        //este es el link del api de git hub, la cual nos va a dar el usuario de cada persona, por eso se usa la interpolacion, para poder ir consultando de cada usuario a medida que se vaya recorriendo el arreglo
        `https://api.github.com/users/${element.user}/repos`
      );
      // se verifica que todo este correcto
      if (!usuarioGit.ok) {
        throw new Error(
          `Error al descargar los datos del API de GitHub para el usuario ${element.user}`
        );
      }
      // convertimos el .json archivo a JS ya que los datos que se le asignaron a la anterior variable son tipo .json por ende los debemos pasar a JS para que podamos trabajar con ellos 
      let repos = await usuarioGit.json();
      // Retornar los repositorios públicos con el nombre del usuario y los datos que necesitamos moatrar
      //aqui se le pasan los datos que queremos ver en nuestro arreglo, como git nos da toda la informacion nosotros debemos solicitar que se muestre en consola solo los datos que necesitamos mostrar, ingresamos con notacion de punto
      return repos.map((repo) => ({
        name: element.name,
        repoName: repo.name,
        repoUrl: repo.html_url,
      }));
    });

    // Esperar a que todas las promesas se resuelvan y unir los resultados en un solo arreglo
    let results = await Promise.all(promises);
    //se aigna a una variable el resultado del promise.all y se utiliza el .flat, vuelve todo en un solo arreglo para que se pueda manejar de mejor manera
    let allRepos = results.flat();

    // Mostrar los repositorios en la consola, pasando primero el repositorio y luego los datos que queremos mostrar dentro de la tabla
    console.table(allRepos, ["name", "repoName", "repoUrl"]);

    // y por ultimo el catch para el manejo de errores
  } catch (error) {
    console.error(
      "Se presentó un error al momento de realizar el proceso: ",
      error
    );
  }
})();

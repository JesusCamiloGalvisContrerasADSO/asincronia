// creamos una funcion anonima autoejecutable asincrona
(async () => {
  // manejamos errores con try catch
  try {
    // Se utiliza fetch para extraer los datos del archivo .json
    let datos = await fetch("data.json");
    // verificamos que el archivo .json se halla extrraido correctamente
    if (!datos.ok) {
      throw new Error("Error al descargar los datos del archivo user.json");
    }
    // se convierte el archivo .json a JS
    let user = await datos.json();

    // Filtrar solo los usuarios que tienen el rol de aprendiz
    let usuarios = user.users.filter((u) => u.aprendiz);
    // verificamos que el array se array de lo contrario se genera el error
    if (!Array.isArray(usuarios)) {
      throw new Error("El formato de los datos no es correcto");
    }

    // Mapeamos los usuarios para obtener los datos de GitHub de cada uno
    let promises = usuarios.map(async (element) => {
      // se descargan los datos del api
      let usuarioGit = await fetch(
        `https://api.github.com/users/${element.user}/repos`
      );
      // se verifica que todo este correcto
      if (!usuarioGit.ok) {
        throw new Error(
          `Error al descargar los datos del API de GitHub para el usuario ${element.user}`
        );
      }
      // convertimos el .json archivo a JS
      let repos = await usuarioGit.json();
      // Retornar los repositorios públicos con el nombre del usuario y los datos que necesitamos moatrar
      return repos.map((repo) => ({
        name: element.name,
        repoName: repo.name,
        repoUrl: repo.html_url,
      }));
    });

    // Esperar a que todas las promesas se resuelvan y unir los resultados en un solo arreglo
    let results = await Promise.all(promises);
    //vuelve todo en un solo arreglo
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

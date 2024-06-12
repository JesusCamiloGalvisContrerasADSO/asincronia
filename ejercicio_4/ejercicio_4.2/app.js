//se crea una nueva funcion anonima autoejecutable asincrona
(async () => {
  // utilizamos try catch para manejo de errores
  try {
    // Se utiliza fetch para extraer los datos del archivo .json, recordemos que esto es una promesa por ende nos devolvera el resolve o el reject, resuelto o no resuelto 
    let datos = await fetch("data.json");
    //con esto manejamos errores, en caso de que ocurra un error al descargar los datos del archivo mande el error al catch
    if (!datos.ok) {
      throw new Error("Error al descargar los datos del archivo user.json");
    }
    // convertimos los datos a archivo js por medio del metodo .json() y utilizamos await para que hasta que este no se solucione no se ejecute
    let user = await datos.json();

    // Filtrar solo los usuarios que tienen el rol de aprendiz por medio del metodo .filter, le pasamos la funcion para que valide si es true o false, con esto podemos determinar si es falso o verdadero
    let usuarios = user.users.filter((u) => u.aprendiz);
    // con esto manejamos los errores en caso de que no sea un arreglo se prensenta el error 
    if (!Array.isArray(usuarios)) {
      throw new Error("El formato de los datos no es correcto");
    }

    // Mapeamos los usuarios para obtener los datos de GitHub de cada uno para que nos retorne un arreglo nuevo, usamos una funcion asincrona para mejor manejo con async await, que se vuelva sincriono
    let promises = usuarios.map(async (element) => {
      // utilizamos el fetch para bajar los datos del archivo .json, recordemos que esto es una promesa por ede se cumple o no y ademas usamos await para que espere a que se realice eso para poder seguir con lo siguiente
      let usuarioGit = await fetch(
        `https://api.github.com/users/${element.user}/repos`
      );
      // volvemos a revisar que todo este bien 
      if (!usuarioGit.ok) {
        throw new Error(
          `Error al descargar los datos del API de GitHub para el usuario ${element.user}`
        );
      }
      // convertimos el archivo .json a js para poder manejorlo, lo hacemos con el metodo .json() para que se vuelva archivo js, ademas usamos el await para que espere que se cumpla para seguir 
      let repos = await usuarioGit.json();

      // Solo retornar los repositorios si tienen menos de 5, ademas le indicamos que queremos que retorne, nombre etc
      if (repos.length < 5) {
        return repos.map((repo) => ({
          name: element.name,
          repoName: repo.name,
          repoUrl: repo.html_url,
        }));
        // en caso que no sea menor que 5 retorne el arreglo vacio para que no vayaa generar conflictos con el promise.all 
      } else {
        return []; // Retornar un arreglo vacío si tiene más de 5 repos
      }
    });

    // Esperar a que todas las promesas se resuelvan y unir los resultados en un solo arreglo
    let results = await Promise.all(promises);
    // Aplanar el arreglo de resultados
    let allRepos = results.flat();

    // Filtrar los repositorios que contienen la palabra "JavaScript" en el nombre
    let filteredRepos = allRepos.filter((repo) =>
      repo.repoName.toLowerCase().includes("javascript")
    );

    // Ordenar los repositorios por el nombre del repositorio de menor a mayor
    filteredRepos.sort((a, b) => a.repoName.localeCompare(b.repoName));

    // Filtrar los repositorios que tienen más de 5 letras en su nombre
    let finalRepos = filteredRepos.filter((repo) => repo.repoName.length > 5);

    // Mostrar los repositorios en la consola, solo lo que le indicamos que muestre
    console.table(finalRepos, ["name", "repoName", "repoUrl"]);
  } catch (error) {
    //aqui capturamos el error en caso de que algo alga mal y lo mostramos al usuario 
    console.error(
      "Se presentó un error al momento de realizar el proceso: ",
      error
    );
  }
})();

(async () => {
  try {
    // Se utiliza fetch para extraer los datos del archivo .json
    let datos = await fetch("data.json");
    if (!datos.ok) {
      throw new Error("Error al descargar los datos del archivo user.json");
    }
    let user = await datos.json();

    // Filtrar solo los usuarios que tienen el rol de aprendiz
    let usuarios = user.users.filter((u) => u.aprendiz);
    if (!Array.isArray(usuarios)) {
      throw new Error("El formato de los datos no es correcto");
    }

    // Mapeamos los usuarios para obtener los datos de GitHub de cada uno
    let promises = usuarios.map(async (element) => {
      let usuarioGit = await fetch(
        `https://api.github.com/users/${element.user}/repos`
      );
      if (!usuarioGit.ok) {
        throw new Error(
          `Error al descargar los datos del API de GitHub para el usuario ${element.user}`
        );
      }
      let repos = await usuarioGit.json();

      // Solo retornar los repositorios si tienen menos de 5
      if (repos.length < 5) {
        return repos.map((repo) => ({
          name: element.name,
          repoName: repo.name,
          repoUrl: repo.html_url,
        }));
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

    // Mostrar los repositorios en la consola
    console.table(finalRepos, ["name", "repoName", "repoUrl"]);
  } catch (error) {
    console.error(
      "Se presentó un error al momento de realizar el proceso: ",
      error
    );
  }
})();

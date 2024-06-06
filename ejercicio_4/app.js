// se crea una funcion anonima autoejecutable asincrona donde se va a realizar el proceso de solicitud al api
(async () => {
  // manejamos errores con try catch
  try {
    // Se utiliza fetch para extraer los datos del archivo .json
    let response = await fetch("data.json");
    // se le asigna a una variable el archivo response.json, esto se hace para que los datos que se bajaron del fetch se conviertan a js
    let data = await response.json();

    // Filtrar solo los usuarios que tienen el rol de aprendiz
    let aprendices = data.users.filter((u) => u.aprendiz);

    // Mapeamos los usuarios aprendices para obtener los datos de GitHub de cada uno
    let promises = aprendices.map(async (aprendiz) => {
      // Realizamos la solicitud a la API de GitHub para obtener los repositorios del usuario
      let responseGit = await fetch(
        `https://api.github.com/users/${aprendiz.user}/repos`
      );
      // Convertimos la respuesta a JSON
      let repos = await responseGit.json();

      // Filtrar solo los repositorios que coinciden con el nombre "Evaluacion"
      let reposFiltrados = repos.filter((repo) => repo.name === "Evaluacion");

      // Retornar los repositorios públicos con el nombre del usuario y los datos que necesitamos mostrar
      return {
        name: aprendiz.name,
        user: aprendiz.user,
        repos: reposFiltrados.map((repo) => ({
          repoName: repo.name,
          repoUrl: repo.html_url,
        })),
      };
    });

    // Esperar a que todas las promesas se resuelvan y unir los resultados en un solo arreglo
    let results = await Promise.all(promises);

    // Filtrar los resultados para mostrar solo aquellos con menos de 5 repositorios públicos
    let filteredResults = results.filter((user) => user.repos.length < 5);

    // Aplanar los resultados filtrados para mostrarlos en una tabla
    let allRepos = filteredResults.flatMap((user) =>
      user.repos.map((repo) => ({
        name: user.name,
        repoName: repo.repoName,
        repoUrl: repo.repoUrl,
      }))
    );

    // Mostrar los repositorios en la consola
    console.table(allRepos, ["name", "repoName", "repoUrl"]);

    // y por ultimo el catch para el manejo de errores
  } catch (error) {
    console.error(
      "Se presentó un error al momento de realizar el proceso: ",
      error
    );
  }
})();

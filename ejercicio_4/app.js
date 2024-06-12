// se crea una funcion anonima autoejecutable asincrona donde se va a realizar el proceso de solicitud al api
(async () => {
  // manejamos errores con try catch
  try {
    // Se utiliza fetch para extraer los datos del archivo .json, se utiliza el await para que el resto del codigo espere a que se cumpla la promesa
    let response = await fetch("data.json");
    // se le asigna a una variable el archivo response.json, esto se hace para que los datos que se bajaron del fetch se conviertan a js
    let data = await response.json();

    // Filtrar solo los usuarios que tienen el rol de aprendiz con el metodo .filter, le debemos pasar la funcion que debemos realizar, en este caso solo accedemos al campo de aprendiz, como esta en buleano el filtro sabra si es true o false
    let aprendices = data.users.filter((u) => u.aprendiz);

    // Mapeamos los usuarios aprendices para obtener los datos de GitHub de cada uno, esto nos devolvera un nuevo arreglo por cada usuario 
    let promises = aprendices.map(async (aprendiz) => {
      // Realizamos la solicitud a la API de GitHub para obtener los repositorios del usuario
      let responseGit = await fetch(
        //este es el link del api de git hub, la cual nos va a dar el usuario de cada persona, por eso se usa la interpolacion, para poder ir consultando de cada usuario a medida que se vaya recorriendo el arreglo
        `https://api.github.com/users/${aprendiz.user}/repos`
      );
      // Convertimos la respuesta a JSON con el metodo .json, este metodo convierte los archivos que descargamos en archivo .json a JS
      let repos = await responseGit.json();

      // Filtrar solo los repositorios que coinciden con el nombre "Evaluacion", esto lo hacemos con el metodo .filter  y le pasamos la funcion donde buscara el nombre evaluacion
      let reposFiltrados = repos.filter((repo) => repo.name === "Evaluacion");

      // Retornar los repositorios públicos con el nombre del usuario y los datos que necesitamos mostrar
      //aqui se le pasan los datos que queremos ver en nuestro arreglo, como git nos da toda la informacion nosotros debemos solicitar que se muestre en consola solo los datos que necesitamos mostrar, ingresamos con notacion de punto
      return {
        name: aprendiz.name,
        user: aprendiz.user,
        //aqui utilizamos el metodo map para devolver un nuevo erreglo con el nombre del repositorio y la url 
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
    //primero mapea cada elemento usando una función de mapeo, luego aplana el resultado en una nueva matriz.
    let allRepos = filteredResults.flatMap((user) =>
      user.repos.map((repo) => ({
        name: user.name,
        repoName: repo.repoName,
        repoUrl: repo.repoUrl,
      }))
    );

    // Mostrar los repositorios en la consola por medio de una tabla, le pasamos que queremos que imprima, name, nombre del repositorio y la url del mismo
    console.table(allRepos, ["name", "repoName", "repoUrl"]);

    // y por ultimo el catch para el manejo de errores
  } catch (error) {
    console.error(
      "Se presentó un error al momento de realizar el proceso: ",
      error
    );
  }
})();

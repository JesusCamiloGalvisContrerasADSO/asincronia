// esto es una funcion anonima autoejecutable asyncrona 
(async () => {
  // utilizamos el manejo de errores 
  try {
    // Se utiliza fetch para extraer los datos del archivo .json, esto retorna el resolve o el reject, es una promesa, el await es para que espere, sea sincrono el codigo
    let datos = await fetch("data.json");
    //en caso de que no este bien se capture el error
    if (!datos.ok) {
      throw new Error("Error al descargar los datos del archivo user.json");
    }
    //convertimos el archivo json a JS por medio del metodo .json()
    let user = await datos.json();

    // Filtrar solo los usuarios que tienen el rol de aprendiz con el metodo filter y se le pasa la funcion, este responde por medio de los boleanos que se encuentran en el archivo
    let usuarios = user.users.filter((u) => u.aprendiz);

    // Función para validar si un string solo contiene letras mayúsculas, usamos una funcion expresada, valida que este funcionando correctamente
    const esMayusculas = (str) => /^[A-Z\s]+$/.test(str);

    // Proxy handler para validar y transformar a mayúsculas
    const handler = {
      //entramos a la funcion con el set para bajar datos, en este caso los estamos validando que si sean mayusculas, de lo contrario no entrara al condicional y retornara true
      set: function (obj, prop, value) {
        //aqui se valida que prop sea name y que la funcion este retornando true
        if (prop === "name" && esMayusculas(value)) {
          // aqui es el valor con el que se va a modificar 
          obj[prop] = value;
        }
        return true;
      },
    };

    // utilizamos el forEach para iterar sobre el arreglo, se le pasa como argumento u
    usuarios.forEach((u) => {
      // tenemos una condicional donde verifica que la palabra sea mayor de 2, incluya ADSO y sea aprendiz
      if (
        u.aprendiz &&
        u.name.split(" ").length > 2 &&
        u.user.includes("ADSO")
      ) {
        //aqui estamos creando el proxy, instanciando a la funcion proxy
        let proxyUsuario = new Proxy(u, handler);
        // aqui estamos convirtiendo el name a mayusculas con el metodo toUpperCase() y lo asignamos al mismo campo 
        proxyUsuario.name = proxyUsuario.name.toUpperCase();
      }
    });

    // Mostrar los usuarios modificados en una tabla, nosotros le indicamos que queremos que se vea
    console.table(user.users, ["name", "user", "aprendiz"]);

    // Mapeamos los usuarios para obtener los datos de GitHub de cada uno, creamos una funcion asyn para poder trabajar de una mejor manera
    let promises = usuarios.map(async (element) => {
      // bajamos los datos de la api y la asignamos al usuarioGit
      let usuarioGit = await fetch(
        `https://api.github.com/users/${element.user}/repos`
      );
      //verificamos que todo este en correcto estado, si no capturar el error
      if (!usuarioGit.ok) {
        throw new Error(
          `Error al descargar los datos del API de GitHub para el usuario ${element.user}`
        );
      }
      // convertimos el archivo json a JS para poder trabajar con el 
      let repos = await usuarioGit.json();

      // Solo retornar los repositorios si tienen menos de 5, solo retorna los datos que deseo ver en consola
      if (repos.length < 5) {
        return repos.map((repo) => ({
          name: element.name,
          repoName: repo.name,
          repoUrl: repo.html_url,
        }));
        // en caso de que no se cumpla retorne un arreglo vacio 
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
    // aqui capturamos el error para poder mostrar al usuario en caso de que se halla presentado un error
  } catch (error) {
    console.error(
      "Se presentó un error al momento de realizar el proceso: ",
      error
    );
  }
})();

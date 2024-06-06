// se crea una variable y se le asigna una funcion donde se va a buscar el nombre evaluacion
const filtrar = (x) => x.name === "Evaluacion";
// se creo una funcion anoima autoejecutable asincrona donde se va a realizar el proceso de solicitud al api
(async () => {
  // se creo una variable, se le coloca await para que el resto del codigo espere que se descarguen los datos del fetch
  let response = await fetch("data.json");
  // se le asigna a una variable el archivo response.json, esto se hace para que los datos que se bajaron del fetch se conviertan a js, es un metodo asincrono, convierte el response en una promesa la cual retorna si se bajo correctamente o no
  let user = await response.json();
  // ahora vamos a realizar la solicitud al api donde vamos a bajar los datos del usuario el cual este en el archivo que bajamos del json anterior, por eso se realiza la interterpolacion con el user.name, para que este valor sea modificable
  let respuestaGit = await fetch(
    `https://api.github.com/users/${user.name}/repos`
  );
  //convertimos el archivo anterior a archivo JS para poder trabajar con el, se tienen el await para que el demas codigo no se ejecute antes de este
  let usuarioGit = await respuestaGit.json();
  // aqui creamos otra variable, le asignamos el metodo .filter para que realice un filtrado de la informacion y le pasamos la funcion para que entienda que tiene que filtrar
  let data = usuarioGit.filter(filtrar);
  // imprimimos la variable de anteriormente le asignamos el filtrado del usuario
  console.log(data);
  //aqui imprimimos el usuario en caso de que no tenga ninguno que se llame como se le asigno en el filtro, entonces para ver la info
  console.log(usuarioGit);
})();

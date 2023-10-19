let productos = [];
const url = "api/productos.json";

// Variante de función getJSONData. Estaban utilizando fetch en crudo, por eso
//animé a reutilizar código.
let obtener = (url) => {
  var resultado = {};
  return fetch(url)
    .then((respuesta) => {
      if (respuesta.ok) {
        return respuesta.json();
      } else {
        throw Error(respuesta.statusText);
      }
    })
    .then((respuesta) => {
      resultado.status = "ok";
      resultado.data = respuesta;

      return resultado;
    })
    .catch((error) => {
      resultado.status = "error";
      resultado.data = error;

      return resultado;
    });
};
//Función que carga los productos a la lista desplegable
function cargarProductos(listaProductos) {
  let producto = document.getElementById("producto");
  for (let elemento of listaProductos) {
    producto.innerHTML += `<option value= ${elemento.producto} -  ${elemento.precio}>${elemento.producto} -  ${elemento.precio} </option>`;
  }
}
function recalcular() {
  let cantidades = document.getElementsByClassName("cant");
  let precios = document.getElementsByClassName("precio");
  let resultados = document.getElementsByClassName("res");
  var total = 0;
  console.log("Total es: " + typeof total);
  for (let i = 0; i < precios.length; i++) {
    total += parseFloat(
      parseFloat(cantidades[i].value) * parseFloat(precios[i].innerHTML)
    );

    resultados[i].innerHTML = parseFloat(
      parseFloat(cantidades[i].value) * parseFloat(precios[i].innerHTML)
    ).toFixed(2);
    console.log("Peero el programa dice que total ahora es: " + typeof total);
  }
  console.log("Total ahora es:" + typeof total);
  document.getElementById("total").innerHTML = "$ " + total.toFixed(2);
}
function agregarALista() {
  let cant = parseInt(document.getElementById("cantidad").value);
  let lista = document.getElementById("lista"); //tomo el tbody
  let index = document.getElementById("producto").selectedIndex; //tomo el índice
  //del producto seleccionado.
  lista.innerHTML += `<tr><td class="pruduct">${
    productos[index].producto
  } </td><td>$ <span class="precio">${
    productos[index].precio
  }</span></td><td><input type="number" class="form-control cant" value="${cant}" onchange="recalcular();" ></td><td>$ <span class="res">${(
    cant * productos[index].precio
  ).toFixed(
    2
  )}</span></td><td><img src="/img/borrar.png" width="20"><span></td></tr>`;
  recalcular();


}

function imprimirTicket() {
  let doc = new jsPDF();
  let datos = DatosUsuario()
  let dia = new Date().toDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric"
  });

  let carritoProduct = document.getElementsByClassName("pruduct")
  let carritoPrecio = document.getElementsByClassName("precio")
  let carritototal = document.getElementsByClassName("res")
  let numero = 105
  doc.setFontSize(20);
  doc.text(80, 20, 'Ferretería "267"');
  doc.setFontSize(12);
  doc.text(80, 28, "C.I.F.: 01234567A" );
  doc.text(80, 34, "C/ Arturo Soria, 1");
  doc.text(80, 42, "999 888 777");
  doc.text(80, 50, "alfredo@lacodigoteca.com");
  doc.line(20, 60, 190, 60);
  doc.text(20, 70, "Factura Sirol.: F2019-000001");
  doc.text(20, 75, `Fecha: ${dia}`);
  doc.text(20, 80, "Metodo de pago: Tarjeta");
  doc.setFont("arial", "bold")
  doc.text(20, 95, `Producto`);
  doc.text(110, 95, "Ud");
  doc.text(130, 95, `Precio `);
  doc.text(170, 95, `total`);
  doc.setLineWidth(0.5);
  doc.line(20, 97, 190, 97);


  for (let i = 0; i < carritoProduct.length; i++) {
    doc.text(20, numero, `${carritoProduct[i].textContent}`);
    doc.text(110, numero, "USD");
    doc.text(130, numero, `${carritoPrecio[i].textContent}`);
    doc.text(170, numero, `${carritototal[i].textContent}`);

    numero = numero + 5
  }
 

  doc.text(20, 120, "TOTAL SIN I.V.A.");
  doc.text(20, 125, "I.V.A. 21%");
  doc.text(20, 130, "TOTAL:");
  doc.text(190, 130, `${datos.total}`);

  /*Completar */
  

  doc.save(cliente + ".pdf");
}

document.addEventListener("DOMContentLoaded", () => {
  obtener(url).then((resultado) => {
    //Agrego los productos a la lista
    if (resultado.status === "ok") {
      console.log(resultado.data);
      productos = resultado.data;
      cargarProductos(productos);
      console.log(productos);
    }
  });
  let btnAgregar = document.getElementById("agregar");
  btnAgregar.addEventListener("click", () => {
    agregarALista();
    //alert( document.getElementById('producto').selectedIndex);
  });

  let btnImprimir = document.getElementById("imp");
  btnImprimir.addEventListener("click", () => {
    imprimirTicket();
  });

  
});


function  DatosUsuario(){
  let name = document.getElementById("cliente").value;
  let Rut = document.getElementById("rut").value;
  let total = document.getElementById("total").innerText;

  let datos = {
    name: name,
    rut: Rut,
    total: total
  }

  return datos
}


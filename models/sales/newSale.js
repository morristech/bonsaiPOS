/* global DataBase */
var fs = require('fs');
var total = 0;
var ci;
var db = new DataBase();
var myObject = db.getTable("products",'\\views\\sales',2);
var business_name;
var nit;
var clients= db.getTable("users",'\\views\\sales',2);
var mySales = db.getTable("sales",'\\views\\sales',2);
var myOrganisation = db.getTable("organisations",'\\views\\sales',2);
var myNit = db.getTable("organisations",'\\views\\sales',2);
var saleproducts = db.getTable("saleProducts",'\\views\\sales',2);

if(localStorage.getItem('reload')==1)
{
  showAlertMessage("successSale");
  $("#alertMessage").show();
  localStorage.removeItem('reload');
  var id_of_last_sale = get_data('\\views\\sales',2);
  if(typeof id_of_last_sale === 'object' && id_of_last_sale.hasOwnProperty('id_sale'))
  {
    open_bill_view();
  }
}

function showAlertMessage(tipeMessage)
{
  $("#alertMessage").removeClass();
  if(tipeMessage=="success"){
    $("#alertMessage").addClass("alert alert-dismissible alert-success");
    $("#alertMessage")[0].innerHTML='<p>El producto fue a&ntilde;adido exitosamente.</p>';
  }
  else if (tipeMessage=="successSale"){
    $("#alertMessage").addClass("alert alert-dismissible alert-success");
    $("#alertMessage")[0].innerHTML='<p>La venta se realiz&oacute; correctamente.</p>';
  }
  else if (tipeMessage=="warning"){
    $("#alertMessage").addClass("alert alert-dismissible alert-warning");
    $("#alertMessage")[0].innerHTML='<p>El producto no se encuentra disponible, pero se a&ntilde;adi&oacute; a la venta.</p>';
  }
  else if (tipeMessage=="warningAmount"){
    $("#alertMessage").addClass("alert alert-dismissible alert-danger");
    $("#alertMessage")[0].innerHTML='<p>La cantidad del producto debe ser mayor a 0.</p>';
  }
  else{
    $("#alertMessage").addClass("alert alert-dismissible alert-danger");
    $("#alertMessage")[0].innerHTML='<p>El producto no existe.</p>';
  }
  $("#alertMessage").show();
}

(function ($) {
  $('#form1').on('submit', function (event) {
    $("#alertMessage").hide();
    event.preventDefault();
    var data_table = $("#tblDatos");
    var amount_product = $("#amount_product").val();
    var name_product = $("#name_product").val();
    business_name = $("#business_name").val();
    nit = $("#nit").val();

    if(Number(name_product) != true){
      for (var cont = 0; cont < myObject.length; cont++) {
        if (name_product === myObject[cont].name) {
           name_product = myObject[cont].id;
        }
      }

    }
    var resp = false;
    if(amount_product > 0){
      for (var cont = 0; cont < myObject.length; cont++) {
        if (name_product == myObject[cont].id) {
          var totalprice = myObject[cont].price * amount_product;
          data_table.append("<tr id = " + myObject[cont].id + '><td style="text-align: center;" ' + ">" + myObject[cont].code + '</td><td style="text-align: center;">' + myObject[cont].name + '</td><td style="text-align: center;">'+'<input type="number" name="quantity" style="width: 60px; heigth:1px" min="1" id=' + myObject[cont].id  + '  value=' + amount_product +     '    >  </td><td style="text-align: center;">' + myObject[cont].price  + '</td><td id="td_id_'+cont+'" style="text-align: center;">'+totalprice+'</td><td><button class="btn btn-danger btn-sm" onclick=' + "fnselect(" + myObject[cont].id + "," + amount_product +")" + ">" + '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' + "</button></td></tr>");
          myObject[cont].amount = myObject[cont].amount - amount_product;
          total = total + (myObject[cont].price * amount_product);
          $("#btn_confirm").show();
          $("#btn_cancel").show();
          $("#total").text(total);
          $("#name_product").val("");
          $("#amount_product").val("");
          document.getElementById('total_sale').value=total;
          showAlertMessage("success");
          if (myObject[cont].amount <= 0) {
            showAlertMessage("warning");
          }
          resp = true;
          break;
        }
      }
      }
      else {
        showAlertMessage("warningAmount");
        $("#name_product").val("");
        $("#amount_product").val("");
        resp = true;
      }

    if (resp === false) {
      $('#btn_cancelAndAccept')[0].innerHTML="Aceptar";
      $("#modalTitleMessageDanger")[0].innerHTML='Alerta - El producto no existe!';
      $("#modalBodyMessageDanger")[0].innerHTML='<p> El producto que desea agregar a la venta no existe.</p>';
      $('#myDangerModal').modal('show');
      showAlertMessage("danger");
    }
    var lastQuantity = amount_product;
            $("input[id=" + myObject[cont].id + "]").change(function () {
                  if (lastQuantity > $(this).val()) {
                    total_sale = $("#total").text();
                    total_sale = total_sale - (myObject[cont].price*(lastQuantity-$(this).val()));
                    $("#total").text(total_sale);
                    lastQuantity = $(this).val();
                    totalprice= myObject[cont].price * lastQuantity;
                    $("#td_id_"+cont.toString()).text(totalprice);
                  }
                  if (lastQuantity < $(this).val()) {
                    total_sale = $("#total").text();
                    total_sale = parseInt(total_sale) + (parseInt(myObject[cont].price) * (parseInt($(this).val())-lastQuantity));
                    $("#total").text(total_sale);
                    lastQuantity = $(this).val();
                    totalprice= myObject[cont].price * lastQuantity;
                    $("#td_id_"+cont.toString()).text(totalprice);
                  }
                  amount_product = lastQuantity;
            });
  });

  $('#btn-client').click(function(){
    event.preventDefault();
    var data_table = $("#tblclient");
    var rowCount = $('#tblclient tr').length;
    var client_id=0
    var aux=""
    var business_name=""
    if(rowCount<1){
      name=$('#name-field').val();
    if (!isNaN(parseFloat(name)) && isFinite(name)) {
      for (var cont = 0; cont < clients.length; cont++) {
        if(clients[cont].ci==name){
          client_id=clients[cont].ci;
          name=clients[cont].name +" "+ clients[cont].lastname ;

        }
      }
    }
              for (var cont = 0; cont < clients.length; cont++) {
                aux= clients[cont].name.toString()+" "+clients[cont].lastname.toString()
                if (aux == name) {
                  client_id=clients[cont].ci
                  business_name=clients[cont].business_name
                  nit=clients[cont].nit

                }
                ci=client_id;
              }

      if (!$('#name-field').val()) {
        name="sin cliente"
      }
      else {
        data_table.append('<tr id=tr_client> <td> <b> Cliente: </b></td><td> '+ name +"</td><td> <b>CI:</b>"+client_id +'</td> <td> <input type="button" id= "deleteclient" onclick= "deleteclient()" value="Borrar"/> </td></tr>')
        $('#business_name').val(business_name);
        $('#nit').val(nit);
      }
  }
  else {
    $('#myDangerModal2').modal('show');
  }
});

  $("#add_btn").click(function () {
    showAlertMessage("danger");
  });

  $("#btn_confirm").click(function () {
      var date = new Date().toUTCString();
      var client= "sin cliente";
      var size = mySales.length;
      var id = 1;


      if ($('#name-field').val()) {
         client=document.getElementById("tblclient").rows[0].cells[1].innerText;
      }
      if(mySales.length != 0)
      {
        var aux = mySales.length;
        id = mySales[aux-1].id + 1;
      }

      on_account=$('#on_account').val();
      if(on_account==''){
        $("#alertMessage").removeClass();
        $("#alertMessage").addClass("alert alert-dismissible alert-danger");
        $("#alertMessage")[0].innerHTML='<p>Debe ingresar un monto recibido.</p>';
        $("#alertMessage").show();
        document.getElementById('button').focus();
      }else{
        if (!$.isNumeric(on_account)) {
           $("#alertMessage").removeClass();
           $("#alertMessage").addClass("alert alert-dismissible alert-danger");
           $("#alertMessage")[0].innerHTML='<p>El monto recibido debe ser numerico.</p>';
           $("#alertMessage").show();
           document.getElementById('alertMessage').focus();
        }else{
          if (on_account<total) {
            $("#alertMessage").removeClass();
            $("#alertMessage").addClass("alert alert-dismissible alert-danger");
            $("#alertMessage")[0].innerHTML='<p>El monto recibido debe ser mayor o igual al total.</p>';
            $("#alertMessage").show();
            document.getElementById('alertMessage').focus();
          }else{
            changing=$('#changing').val();
            var sale = { "id": id, "date": date, "total": total , "on_account": on_account, "changing": changing, "client":client, "business_name":business_name, "nit":nit, "sync":false};

            mySales.push(sale);
            db.putTable("sales", mySales,'\\views\\sales',2);
            registerSalesProducts(sale.id)
            db.putTable("products", myObject,'\\views\\sales',2);
            name=$('#name-field').val();
            for (var cont = 0; cont < clients.length; cont++) {
              aux= clients[cont].name.toString()+" "+clients[cont].lastname.toString()
              if (aux == name) {
                clients[cont].business_name=$('#business_name').val();
                clients[cont].nit=$('#nit').val();
              }
            }
            db.putTable("users", clients,'\\views\\sales',2);
            var to_bill = {"id_sale":id,"nit_buyer":nit,"name_buyer":business_name,"date":date};
            set_data_to_push(to_bill,'\\views\\sales',2);
            location.reload();
            localStorage.setItem('reload',1);
          }
        }
      }

      db.putTable("users", clients,'\\views\\sales',2);
      var to_bill = {"id_sale":id,"nit_buyer":nit,"name_buyer":business_name,"date":date};
      set_data_to_push(to_bill,'\\views\\sales',2);
      if (!isDaily()) {synchronize()};
      location.reload();
      localStorage.setItem('reload',1);

  });




  ///////////////////////////////////////a;adir organizacion
  $("#nit").blur(function(){
    nit = $("#nit").val();
    if (!$('#business_name').val()) {
      for (var i = 0; i < myOrganisation.length; i++) { //busco el nombre segun nit
        if (  myOrganisation[i].nit==nit) {
          business_name=myOrganisation[i].name;
        }
      }
        document.getElementById("business_name").value = business_name;

    }


    });

  ///////////////////////////////////////////


  $("#btn_cancel").click(function(){
    $('#myDangerModal').modal('show');
    $("#modalTitleMessageDanger")[0].innerHTML='Alerta - Esta apunto de cancelar una venta!';
    $("#modalBodyMessageDanger")[0].innerHTML='<p> ¿Esta seguro que desea cancelar la venta actual? </p>';
    $('#btn_cancelAndAccept')[0].innerHTML="Cancelar";
    $('#btn_cancelSale')[0].innerHTML="Aceptar";
    $("#btn_cancelSale").show();
  });

  $("#btn_cancelSale").click(function(){
    location.reload();
  });

})(jQuery);

function getpathproyect(todelete,cant_of_breakbar)
{
  actualdir = __dirname
  /*34 es ascii de '\', la primera comparación ve si pertenece el path a windows,
  si pertenece a windows, no hace nada, caso contrario, lo cambia a '/'
  */
  if(actualdir.search('/') != -1){
    for(i = 0; i < cant_of_breakbar; i++){
      todelete = todelete.replace(String.fromCharCode(92),'/');
    }
  }
  actualdir = actualdir.replace(todelete,'');
  return actualdir;
}

function converpath(toconvert,cant_of_breakbar){
  actualdir = __dirname
  /*34 es ascii de '\', la primera comparación ve si pertenece el path a windows,
  si pertenece a windows, no hace nada, caso contrario, lo cambia a '/'
  */
  if(actualdir.search('/') != -1){
    for(i = 0; i < cant_of_breakbar; i++){
      toconvert = toconvert.replace(String.fromCharCode(92),'/');
    }
  }
  return toconvert;
}

function fnselect(value, amount_value) {
  var fs = require('fs');
  dir = getpathproyect('\\views\\sales',2);
  fs.readFile(dir + converpath('\\bd\\products.json',2), function (err, products) {
    if (err)
      throw err;
    for (var cont = 0; cont < myObject.length; cont++) {
      if (value == myObject[cont].id) {
        myObject[cont].amount = myObject[cont].amount + amount_value;
        total = total - (myObject[cont].price*amount_value);
        $("#total").text(total);
      }
    }
  });
  var element = document.getElementById(value);
  element.remove();
  var rowCount = $('#tblDatos tr').length;
  if(rowCount-1===0){
    $("#btn_confirm").hide();
    $("#btn_cancel").hide();
  }
}

$(document).ready(function() {
//Cargar datos cliente
  var data2 = new Array("");
  for (var cont = 0; cont < clients.length; cont++) {
    data2.push(clients[cont].name.toString()+" "+clients[cont].lastname.toString());
  }

 $("#name-field").autocomplete({ source: data2 });

  var data = new Array("");
  for (var cont = 0; cont < myObject.length; cont++) {
    data.push(myObject[cont].name.toString());
    }
	$("#name_product").autocomplete({ source: data });
//Cargar nombre organizacion

  var dataOrg = new Array("");
  for (var cont = 0; cont < myOrganisation.length; cont++) {
    dataOrg.push(myOrganisation[cont].name.toString());
    }
	$("#business_name").autocomplete({ source: dataOrg });

  //Cargar nit organizacion
    var dataNit = new Array("");
    for (var cont = 0; cont < myNit.length; cont++) {
      dataNit.push(myNit[cont].nit.toString());
      }
  	$("#nit").autocomplete({ source: dataNit });

	});
  //delete client
  function deleteclient(){
    var element = document.getElementById("tr_client");
    element.remove();
  }

function getProductsFromSalesTable(){
  var table = document.getElementById('tblDatos')
  var products = [];
  for (var i = 1, row; row = table.rows[i]; i++) {
    row
    var product = { "id": row.cells[0].innerHTML, "code": row.cells[1].innerHTML, "name": row.cells[2].innerHTML , "quantity": String((row.cells[5].innerHTML)/(row.cells[4].innerHTML)), "price": row.cells[4].innerHTML, "total": row.cells[5].innerHTML};
    products.push(product);
  };
  return products;
}

function getSaleProducts(id)
{
  var table = document.getElementById('tblDatos')
  var products = [];
  for (var i = 1, row; row = table.rows[i]; i++) {
    row
    var product = { "product_id": row.cells[0].innerHTML, "sale_id": id, "name": row.cells[1].innerHTML ,"quantity": String((row.cells[4].innerHTML)/(row.cells[3].innerHTML)), "price": row.cells[3].innerHTML};
    products.push(product);
  };
  return products;
}

function getTotal(){
  return $('#total').html();
}

function generatePDF(sale,client)
{
  if(ci==undefined)
  ci='0'
  var doc = new jsPDF();
  doc.setFontSize(22);
  doc.text(20, 20, 'NOTA DE VENTA');

  doc.setFontSize(16);
  doc.text(20, 30, 'FECHA: '+String(sale.date).toUpperCase());

  doc.setFontSize(18);
  doc.text(20, 40, 'DATOS DEL CLIENTE:');

  doc.setFontSize(16);
  doc.text(20, 50, 'NOMBRE: '+String(client).toUpperCase());

  doc.text(20, 60, 'CI: '+String(ci));

  var detail=getProductsFromSalesTable();

  doc.setFontSize(18);
  doc.text(20, 70, 'DETALLE');
  doc.text(20, 75, '------------');

  doc.setFontSize(16);

  var i;

  for (i = 0; i < detail.length ; i++) {
    doc.text(20, 80+60*i, 'ID:'+detail[i].id);
    doc.text(20, (80+10)+60*i, 'CODIGO: '+detail[i].code);
    doc.text(20, (80+20)+60*i, 'NOMBRE: '+detail[i].name.toUpperCase());
    doc.text(20, (80+30)+60*i, 'CANTIDAD: '+detail[i].quantity);
    doc.text(20, (80+40)+60*i, 'PRECIO: '+detail[i].price);
    doc.text(20, (80+50)+60*i, 'SUBTOTAL: '+detail[i].total);
    doc.text(20, (85+50)+60*i, '----');


  };

  doc.text(20, i*60+90, '------------');


  doc.setFontSize(18);
  doc.text(20, i*60+100, 'TOTAL: '+ sale.total);
  doc.save('NotaDeVenta'+String(sale.id)+'.pdf');
}

function registerSalesProducts(id)
{
  var auxArray = getSaleProducts(id);
  array=saleproducts.concat(auxArray);
  db.putTable("saleProducts", array,'\\views\\sales',2);

}

function open_bill_view()
{
  var path = getpathproyect('\\views\\sales',2) + converpath('\\views\\bill\\generatorbill.html',3);
  window.open(path, '', 'width=420,height=600');
}



function synchronize()
{
    var data;
    user = db.getTable('token','\\views\\sales',2);
    sales = db.getTable('sales','\\views\\sales',2);
    saleProducts = db.getTable('saleProducts','\\views\\sales',2);
    //generar cadena para json
    var product;
    var products=[];
    for (var cont=0;cont<sales.length;cont++){

      if(sales[cont].sync===false){
        products=[];
      for (var cont2=0;cont2<saleProducts.length;cont2++){
            if(sales[cont].id===saleProducts[cont2].sale_id){
            sales[cont].sync=true;
            resp=true;
             product = { "item_id": parseInt(saleProducts[cont2].product_id), "price":parseInt(saleProducts[cont2].price), "quantity":parseInt(saleProducts[cont2].quantity), "description": saleProducts[cont2].name};
             products.push(product);
            }
      }
          data= JSON.stringify(products);
          data=eval("("+ data + ")" );
    //enviar la cadena json a erp
    $.ajax({
      headers: {token: user[0].token},
      method: "POST",
      url: "http://catolica.bonsaierp.com:3000/api/v1/incomes",
      data: {
        income: {
        "date":"2015-11-19",
        "due_date":"2015-11-22",
        "contact_id":1,
        "currency":"BOB",
        "description":"Prueba ingreso",
        "income_details_attributes":
        data}
      }
    })
    .done(function(resp) {
      setTimeout(function(){
        alert("Los datos de la empresa fueron actualizados exitosamente.");
      }, 1000);
    })
    .fail(function (ajaxContext){
     //alert("Error al Actualizar los datos de la empresa");
   });
     }
   }
   if(resp === true){
     alert("Las  de ventas de la empresa fueron actualizados exitosamente");
   }
   else {
     alert("No se tiene ninguna  nueva venta para synchronize");
   }
       db.putTable('sales',sales,'\\views\\sales',2);
}

function isDaily() {
  var mySynchronization = db.getTableDos("synchronization");
  for (var i = 0; i < mySynchronization.length; i++) {
    if (mySynchronization[i].type === "daily")
      return true;
  }
  return false;
}

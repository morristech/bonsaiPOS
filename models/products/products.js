window.$ = window.jQuery = require('./libs/jquery.min.js');
var db = new DataBase();

if(localStorage.getItem('reload')==1)
{
  showAlertMessage("successProductUpdate");
  $("#alertMessage").show();
  localStorage.removeItem('reload');
}

function showAlertMessage(tipeMessage)
{
  $("#alertMessage").removeClass();
  if(tipeMessage=="successProductUpdate"){
    $("#alertMessage").addClass("alert alert-dismissible alert-success");
    $("#alertMessage")[0].innerHTML='<p>Los productos fueron actualizados exitosamente.</p>';
  }
  else{
    $("#alertMessage").addClass("alert alert-dismissible alert-danger");
    $("#alertMessage")[0].innerHTML='<p>Error al Actualizar los productos.</p>';
  }
}

$(document).ready(function () {

	$("#update").click(function () {
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "http://demo.bonsaierp.com/api/v1/items",
			"method": "GET",
			"headers": {
				"token": "dLXE2gSxDTN0w0as2YrkEdi18m8GlacZ3UrZvBd3y2ALEo",
				"cache-control": "no-cache"
			}
		}
    $('#progressbardiv').show();
    $('#progressbar-2').animate({ width: '100%' }, 1, 'linear').html("Cargando...");
		$.ajax(settings)
			.done(function (response) {
				var products =response;
				db.putTable('products',products,'',2);
        setTimeout(function(){
            showAlertMessage("successProductUpdate");
     			  $("#alertMessage").show();
            $('#progressbar-2').html("Descarga Completa.");
        }, 1000);

			})
      .fail(function (ajaxContext){
        showAlertMessage("errorProductUpdate");
        $("#alertMessage").show();
        $('#progressbar-2').html("Error en la Descarga.");
      });
	});
});
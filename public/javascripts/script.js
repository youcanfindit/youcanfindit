document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById('post-location') || document.getElementById('post-location-edit')) {
    // let map = new google.maps.Map(document.getElementById('post-location'), {
    //   center: {lat: -34.397, lng: 150.644},
    //   zoom: 15
    // })

    let pos = {}

    $(function(){
      $("#geocomplete").geocomplete({
        map: "#post-location",
        details: "form",
        markerOptions: {
          draggable: true
        },
        center: {lat: -34.397, lng: 150.644},
        /*location: {lat: pos.lat, lng: pos.lng},*/
        zoom: 15
    });

    $("#geocomplete").bind("geocode:dragged", function(event, latLng){
      $("input[name=lat]").val(latLng.lat());
      $("input[name=lng]").val(latLng.lng());
      $("#reset").show();
    });


    $("#find").click(function(){
      $("#geocomplete").trigger("geocode");
    }).click();
  })
}



var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;
document.getElementById("date").setAttribute("max", today);
document.getElementById("date").setAttribute("value", today);


}, false);

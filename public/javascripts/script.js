document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById('post-location')) {
    // let map = new google.maps.Map(document.getElementById('post-location'), {
    //   center: {lat: -34.397, lng: 150.644},
    //   zoom: 15
    // })


    let pos = {}

    $(function(){
      $("#geocomplete").geocomplete({
        map: "#post-location",
        details: "form ",
        markerOptions: {
          draggable: true
        },
        location: {lat: pos.lat, lng: pos.lng},
        zoom: 15
    });

    $("#geocomplete").bind("geocode:dragged", function(event, latLng){
      $("input[name=lat]").val(latLng.lat());
      $("input[name=lng]").val(latLng.lng());
      $("#reset").show();
    });


    $("#reset").click(function(){
      $("#geocomplete").geocomplete("resetMarker");
      $("#reset").hide();
      return false;
    });

    $("#find").click(function(){
      $("#geocomplete").trigger("geocode");
    }).click();

    console.log(document.getElementById('latitude').value)
    console.log(document.getElementById('longitude').value)
});



      // var marker = new google.maps.Marker({
      //   position: myLatLng,
      //   map: map,
      //   title: 'Hello World!'
      // })

      // Try HTML5 geolocation.
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function(position) {
      //     pos = {
      //       lat: position.coords.latitude,
      //       lng: position.coords.longitude
      //     };
      //
      //     document.getElementById('latitude').value = position.coords.latitude
      //     document.getElementById('longitude').value = position.coords.longitude
      //
      //     map.setCenter(pos);
      //   }, function() {
      //     handleLocationError(true, infoWindow, map.getCenter());
      //   })
      //
      //
      //   let marker = new google.maps.Marker({
      //     position: {
      //       lat: parseInt(pos.lat),
      //       lng: parseInt(pos.lng)
      //     },
      //     draggable: true,
      //     animation: google.maps.Animation.DROP,
      //     map: map,
      //     title: `Prueba`
      //   })
      //
      //
      //
      //
      //   google.maps.event.addListener(marker, 'dragend', function() {
      //     geocodePosition(marker.getPosition())
      //   })
      //
      //   function geocodePosition(pos) {
      //     geocoder = new google.maps.Geocoder();
      //     geocoder.geocode({latLng: pos}, function(results, status) {
      //       if (status == google.maps.GeocoderStatus.OK) {
      //         $("#mapSearchInput").val(results[0].formatted_address);
      //         $("#mapErrorMsg").hide(100);
      //       } else {
      //         $("#mapErrorMsg").html('Cannot determine address at this location.'+status).show(100);
      //       }
      //     }
      //   );
      // }
      //
      // }
      //





      // google.maps.event.addListener(map, 'click', function(event) {
      //   placeMarker(event.latLng);
      // })
      //
      // function placeMarker(location) {
      //   var marker = new google.maps.Marker({
      //       position: location,
      //       draggable: true,
      //       map: map
      //   })
      // }




      //
      // function initPostMap() {



  }





}, false);

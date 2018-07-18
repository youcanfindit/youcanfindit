document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById('post-location') || document.getElementById('post-location-edit')) {
    if ($('#post-location').hasClass('new')) {
      let pos = {}
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          $('input[name=literal]').val(`${pos.lat},${pos.lng}`)
          $("#find").click()

        }, function() {});
      }
    }

    $(function(){
      $("#geocomplete").geocomplete({
        map: "#post-location",
        details: "form",
        markerOptions: {
          draggable: true
        },
        zoom: 15
    });

    $("#geocomplete").bind("geocode:dragged", function(event, latLng){
      $("input[name=lat]").val(latLng.lat());
      $("input[name=lng]").val(latLng.lng());
      $('input[name=literal]').val(`${latLng.lat()},${latLng.lng()}`)
    });


    $("#find").click(function(){
      $("#geocomplete").trigger("geocode");
    }).click();
  })
  }



  if (document.getElementById('post-location') && $('#post-location').hasClass('detail')) {
    var myLatlng = new google.maps.LatLng($("input[name=lat]").val(),$("input[name=lng]").val());
    var mapOptions = {
      zoom: 15,
      center: myLatlng,
      disableDefaultUI: true,
      draggable: false
    }
    var map = new google.maps.Map(document.getElementById("post-location"), mapOptions);

    var marker = new google.maps.Marker({
      position: myLatlng,
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
  }
}, false);

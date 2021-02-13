function removeSinkForm() {
    $("#panel-content").html("");
};

function openExamplePanel() {
  $(".example-panel").fadeIn( function () {
    $("#info-panel").addClass('shorten-panel');
    $("#legend-side-panel").addClass('shorten-panel');
    $("#layer-panel").addClass('shorten-panel');
  });

  $.ajax ({
    url:root_url+"/example-locations",
    success: function (data) {
      var html = '';
      var icon = L.divIcon({className: '',html:'<i class="fa fa-bullseye" style="color: red; font-size:20px;"></i>'});
      var pois = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: icon});
        },
        onEachFeature: function (feature, layer) {
          var latlong = [feature.geometry.coordinates[1],feature.geometry.coordinates[0]];
          var popup = L.popup({'className' : 'latlong-popup'})
            .setContent(`
              <h4>${feature.properties.name}</h4>
              <h5>${feature.properties.description}</h5>
              <button onclick="zoomToExample([${latlong}],18,'${feature.properties.basemap}')" title="zoom to" class="example-zoom-button">zoom to</a>
            `)
          layer.bindPopup(popup);
          html += `<button onclick="zoomToExample([${latlong}],18,'${feature.properties.basemap}')" title="${feature.properties.description}" class="example-zoom-button">${feature.properties.name}</a>`
        }
      }).addTo(map);

      pois.id = "pois";
      $("#put-examples-here-xs").html(html);
      $("#put-examples-here-sm").html(html);
    }
  });
}

function closeExamplePanel() {
  map.eachLayer(function(layer) {
    if (layer.id == "pois") {map.removeLayer(layer)};
  });

  $(".example-panel").fadeOut( function () {
    $("#info-panel").removeClass('shorten-panel');
    $("#legend-side-panel").removeClass('shorten-panel');
    $("#layer-panel").removeClass('shorten-panel');
  });
};

$(document).ready(
    function() {
        $("#open-panel").click(function() {
            $("#info-panel").fadeIn();
        });
        $("#close-panel").click(function() {
            $("#info-panel").fadeOut();
        });

        $("#open-layers-panel").click(function() {
            $(".leaflet-right").hide();
            $(".leaflet-right").fadeIn();
            $(".leaflet-right").addClass('leaflet-far-right');
            $("#layer-panel").fadeIn();
        });
        $("#close-layers-panel").click(function() {
            $(".leaflet-right").removeClass('leaflet-far-right');
            $("#layer-panel").fadeOut();
            $("#legend-side-panel").fadeOut(400, function() {
                $("#open-legend-panel").html("show legend");
            });

        });

        $(".open-legend-btn").click(function() {
            if ($("#open-legend-panel").text() == "show legend") {
                $("#open-legend-panel").html("hide legend");
                $("#legend-side-panel").fadeIn();
            } else {
                $("#open-legend-panel").html("show legend");
                $("#legend-side-panel").fadeOut();
            }
        });
        $("#close-legend-panel").click(function() {
            $("#legend-side-panel").fadeOut();
            $("#open-legend-panel").html("show legend");
        });



        $("#toggle-example-panel").click(function() {
          if ($(this).text() == "show POIs") {
            openExamplePanel();
            $(this).html("hide POIs");
          } else {
            $(this).html("show POIs");
            closeExamplePanel();
          }
        });
        $(".close-example-panel").click(function() {
          $("#toggle-example-panel").html("show POIs");
          closeExamplePanel();
        });

        $("#toggle-instructions").click( function() {
            $("#instructions").toggle();
            if ($(this).text() == "click to hide desktop assessment instructions") {
                $(this).html("click to show desktop assessment instructions");
            } else {
                $(this).html("click to hide desktop assessment instructions");
            }
        });


        $(".save-location").click(function() {
            if ($(this).text() == "bookmark current view") {
                saveView();
                $(this).html("return to bookmarked view");
            } else {
                returnView();
                $(this).html("bookmark current view");
            }
        });
        $(".refresh-layer-icon").click(function() {
            redrawSinkLayer();
        });

        $(".leaflet-control-layers-separator").html("<h5>Overlays</h5>");
        $("#get-form").click(function() {
            var ajax = $.ajax({
                url : "/sink-form/5",
                success : function (response) {
                    $("#panel-content").html(response);
                }
            });
        });

    }
);

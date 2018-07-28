function removeSinkForm() {
    $("#panel-content").html("");
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
            $(".leaflet-right").fadeIn();
            $("#layer-panel").fadeIn(400, function () {
                $(".leaflet-right").hide();
                $(".leaflet-right").addClass('leaflet-right-right');
            });
        });
        $("#close-layers-panel").click(function() {
            $(".leaflet-right").removeClass('leaflet-right-right');
            $("#layer-panel").fadeOut();
            $("#legend-side-panel").fadeOut(400, function() {
                $("#open-legend-panel").html("show legend");
            });
            
        });
        
        $("#open-legend-panel").click(function() {
            if ($(this).text() == "show legend") {
                $(this).html("hide legend");
                $("#legend-side-panel").fadeIn();
            } else {
                $(this).html("show legend");
                $("#legend-side-panel").fadeOut();
            }
        });
        $("#close-legend-panel").click(function() {
            $("#legend-side-panel").fadeOut();
            $("#open-legend-panel").html("show legend");
        });
        
        $("#open-example-panel").click(function() {
            $("#example-panel").fadeIn();
            $.ajax ({
                url:root_url+"/example-locations",
                success: function (data) {
                    console.log(data);
                    var html = ''
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            var name = data[key]['name'];
                            var latlong = data[key]['latlong'];
                            var desc = data[key]['description'];
                            var basemap = data[key]['basemap'];
                            html += '<button onclick="zoomToExample(['+latlong+'],18,\''+basemap+'\')" title="'+desc+'" class="example-zoom-button">'+name+'</a>';
                        }
                    }
                    $("#put-examples-here").html(html);
                }
            });
        });
        $("#close-example-panel").click(function() {
            $("#example-panel").fadeOut();
        });
        
        $("#toggle-instructions").click( function() {
            $("#instructions").toggle();
            if ($(this).text() == "click to hide desktop assessment instructions") {
                $(this).html("click to show desktop assessment instructions");
            } else {
                $(this).html("click to hide desktop assessment instructions");
            }
        });
        
        
        $("#save-location").click(function() {
            if ($(this).text() == "bookmark current view") {
                saveView();
                $(this).html("return to bookmarked view");
            } else {
                returnView();
                $(this).html("bookmark current view");
            }
        });
        
        $("#refresh-sink-layer").click(function() {
            redrawSinkLayer();
        });
        
        $(".leaflet-control-layers-separator").html("<h5>Overlays</h5>");
        $("#get-form").click(function() {
            var ajax = $.ajax({
                url : "/sink-form/5",
                success : function (response) {
                    $("#panel-content").html(response);
                    console.log("form loaded");
                }
            });
        });
        
    }
);
    
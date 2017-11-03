function removeSinkForm() {
    console.log("adine");
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
            $("#layer-panel").fadeIn();
        });
        $("#close-layers-panel").click(function() {
            $("#layer-panel").fadeOut();
        });
        
        $("#open-legend-panel").click(function() {
            $("#legend-side-panel").fadeIn();
        });
        $("#close-legend-panel").click(function() {
            $("#legend-side-panel").fadeOut();
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
                    console.log(html);
                    $("#put-examples-here").html(html);
                }
            });
        });
        $("#close-example-panel").click(function() {
            $("#example-panel").fadeOut();
        });
        
        $("#toggle-instructions").click( function() {
            $("#instructions").toggle();
            if ($(this).text() == "hide instructions") {
                $(this).html("show instructions");
            } else {
                $(this).html("hide instructions");
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
    
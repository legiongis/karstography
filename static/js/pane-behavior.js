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
    });
    
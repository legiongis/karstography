function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

var seconds = [1000, 1004, 1022, 1033, 1059, 1063, 1070, 1072, 1077, 1084, 1089, 1094, 1099, 1106, 1119, 1120, 1123, 1133, 161, 17, 240, 241, 246, 247, 248, 251, 253, 258, 287, 293, 308, 311, 326, 331, 337, 340, 349, 351, 357, 375, 437, 445, 448, 449, 455, 464, 465, 478, 482, 508, 521, 533, 541, 548, 581, 597, 609, 611, 618, 622, 624, 629, 630, 632, 648, 650, 669, 675, 691, 694, 696, 704, 705, 707, 708, 710, 713, 715, 716, 728, 751, 765, 767, 771, 772, 773, 783, 794, 807, 808, 812, 816, 840, 842, 850, 852, 899, 925, 927, 931, 932, 935, 936, 943, 945, 949, 961, 965, 984, 986, 989, 990, 991, 993, 994]



$(document).ready(function() {
    for (var i = 651; i <= 700; i++) {

        var modalId = i+"modal";
        var imgID = i+"image";
        var pdfLink = "https://csp.us-southeast-1.linodeobjects.com/wcr-crawford/pdf/CR"+i+".pdf";
        var thumbLink = "https://csp.us-southeast-1.linodeobjects.com/wcr-crawford/thumbs/CR"+i+"_thumb.png";
        var jpgLink = "https://csp.us-southeast-1.linodeobjects.com/wcr-crawford/jpeg/CR"+i+".jpg";
        var containerId = "CR"+i;
        
        
        var divContent = '\
        <div class="row wcr-entry">\
            <div class="help-section" >\
                <div class="help-toggle">\
                    <h3><a href="javascript:void(0);">WCR #'+i+'</a></h3>\
                </div>\
                <div class="help-content">\
                    <div class="col-sm-6">\
                        <iframe class="wcr-form" src="https://docs.google.com/forms/d/e/1FAIpQLSdWfa9IGqQbpQtQ2o5exN7tM6fdlPA_eJDmHRlObpDplrM_iQ/viewform?embedded=true&entry.1615259771='+i+'" width="100%" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>\
                        <div class="zoom-container" id="'+containerId+'" style="height:200px;width:555px;background-color:lightgrey;margin-left:auto;margin-right:auto"></div>\
                    </div>\
                    <div class="col-sm-6">\
                        <img id="img-zoom" style="border: solid black 1px;" src="'+jpgLink+'" width="100%" data-zoom-image="'+jpgLink+'"/>\
                    </div>\
                </div>\
            </div>\
        </div>'
        
        // <a href="'+pdfLink+'">
        // </a>
        $(divContent).insertBefore("#end");
        // if (isInArray(i, seconds)){
            // var pdfLink_2 = "https://csp.us-southeast-1.linodeobjects.com/wcr-crawford/pdf/CR"+i+"_2.pdf";
            // var thumbLink_2 = "https://csp.us-southeast-1.linodeobjects.com/wcr-crawford/thumbs/CR"+i+"_2_thumb.png";
            // $('<div class="col-xs-6 col-sm-3">\
                // <div class="tile">\
                    // <a href="'+pdfLink_2+'">\
                        // <div class="on-image"><p>CR'+i+'b.pdf</p></div>\
                        // <img src="'+thumbLink_2+'" height="256" />\
                    // </a>\
                // </div>\
               // </div>').insertBefore("#end");
        // }
        
    }
    
    function closeAll() {
        $(".help-content").hide("fast");
    }
    
    $(".help-toggle").click(function (){ 
        var iconEl = $(this).find('i');
        
        var sectionEl = $(this).closest('.help-section');
        var contentEl = $(sectionEl).find('.help-content');
        var imgEl = $(contentEl).find('img');
        var zcontainer = $(contentEl).find(".zoom-container");
        console.log(zcontainer);
        var zid = $(zcontainer).attr('id');
        closeAll();
        if (contentEl.is(":visible")){
            contentEl.hide("fast");
            $(".zoomContainer").remove();
            $(".zoomWindowContainer").remove();
        } else {
            contentEl.show("fast");
            $(imgEl).elevateZoom({zoomWindowPosition: zcontainer.attr("id"), zoomWindowHeight: 200, zoomWindowWidth:555, borderSize: 0, easing:false});
        }
        $(iconEl).toggleClass("fa-chevron-down");
        $(iconEl).toggleClass("fa-chevron-right");
        //$(imgEl).elevateZoom();
        
        
    });
});
//zoomWindowHeight: 200, zoomWindowWidth:450,
//https://ftp.legiongis.com/WCRs/tif/CR1.tif


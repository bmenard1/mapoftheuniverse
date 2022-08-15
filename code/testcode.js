$(document).ready(function() {
    console.log("AYE")
})
var page = $("html, body");


$("#viewMap").click(function(e){
    console.log("HEY")
    page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
       page.stop();
   });

    $('html, body').animate({
		scrollTop: $(".mapbox").offset().top
	}, 5000, 'linear', function() {
        console.log("SCROLLEd")
       page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
    });
    
    
});
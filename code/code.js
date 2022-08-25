
$(document).ready(function() {
    console.log("HELLO")
    $('.more-info').hide();
    /*
    $(".slice-map-text").hover(
        function(e){
            //$(".map-container-info").show(200);
            $(".map-container-info").fadeIn(200);
            //$(".map-container-info").css('visibility', 'visible');
            $(".map-container-info > h1").text(information[1].title)
            switch(e.target.id) {
                case "text_01":
                    $(".map-container-info > h1").text(information[8].title)
                    $(".map-container-info>img").attr('src', information[8].img)
                    $(".map-container-info>p").text(information[8].caption)
                    break;
                case "text_02":
                    $(".map-container-info > h1").text(information[7].title)
                    $(".map-container-info>img").attr('src', information[7].img)
                    $(".map-container-info>p").text(information[7].caption)

                    break;
                case "text_03":
                    $(".map-container-info > h1").text(information[8].title)
                    $(".map-container-info>img").attr('src', information[8].img)
                    $(".map-container-info>p").text(information[6].caption)

                    break;
                case "text_04":
                    $(".map-container-info > h1").text(information[6].title)
                    $(".map-container-info>img").attr('src', information[6].img)
                    $(".map-container-info>p").text(information[6].caption)

                    break;
            
            }
        
            console.log("in")
        }, function(){
            $(".map-container-info").fadeOut(0);
            //$(".map-container-info").css('visibility', 'hidden');
            console.log("out")
        }
    )
    */

    $("#hide-terms").click(function(e){
        $(".term-box-words").slideToggle( 'slow', function(){
            var text = $("#hide-terms").text();
            $("#hide-terms").text(
                text == "Show" ? "Hide" : "Show");

         });

    })

    $(".map-effect").hover(
        function(e){
            console.log(e.target.id)
            //$(".map-container-info").show(200);
            //$(".map-container-info").fadeIn(500);
            if($('.map-container-info').is(":hidden")){

                $(".map-container-info").fadeIn(200);
            }
            switch(e.target.id) {
                case "area_01":
                    $("#slice-map").attr('src', "Images/WebMap_V02/near.png")
                    $(".map-container-info > h1").text(information[4].title)
                    $(".map-container-info>img").attr('src', information[4].img)
                    $(".map-container-info>p").text(information[4].caption)

                    break;
                case "area_02":
                    $("#slice-map").attr('src', "Images/WebMap_V02/red.png")
                    $(".map-container-info > h1").text(information[3].title)
                    $(".map-container-info>img").attr('src', information[3].img)
                    $(".map-container-info>p").text(information[3].caption)

                    break;
                case "area_03":
                    $("#slice-map").attr('src', "Images/WebMap_V02/quasars.png")
                    $(".map-container-info > h1").text(information[2].title)
                    $(".map-container-info>img").attr('src', information[2].img)
                    $(".map-container-info>p").text(information[2].caption)

                    break;
                case "area_04":
                    $("#slice-map").attr('src', "Images/WebMap_V02/cmb.png")
                    $(".map-container-info > h1").text(information[1].title)
                    $(".map-container-info>img").attr('src', information[1].img)
                    $(".map-container-info>p").text(information[1].caption)
                    break;
                case "area_05":
                    $("#slice-map").attr('src', "Images/WebMap_V02/galaxies.png")
                    $(".map-container-info > h1").text(information[9].title)
                    $(".map-container-info>img").attr('src', information[9].img)
                    $(".map-container-info>p").text(information[9].caption)
                    break;

                case "axis_01":
                    //$(".angle-on-sky-axis").addClass('highlighted-axis');
                    $(".map-container-info > h1").text(information[7].title)
                    $(".map-container-info>img").attr('src', information[7].img)
                    $(".map-container-info>p").text(information[7].caption)
                    break;
                case "axis_02":
                    //$(".redshift-axis").addClass('highlighted-axis');
                    $(".map-container-info > h1").text(information[5].title)
                    $(".map-container-info>img").attr('src', information[5].img)
                    $(".map-container-info>p").text(information[5].caption)
                    break;
                case "axis_03":
                    //$(".lookback-time-axis").addClass('highlighted-axis');
                    $(".map-container-info > h1").text(information[6].title)
                    $(".map-container-info>img").attr('src', information[6].img)
                    $(".map-container-info>p").text(information[6].caption)
                    break;
                case "axis_04":
                    //$(".you-are-here-axis").addClass('highlighted-axis');

                    $(".map-container-info > h1").text(information[8].title)
                    $(".map-container-info>img").attr('src', information[8].img)
                    $(".map-container-info>p").text(information[8].caption)
                    break;    
            }

            //$(".map-container-info").css('visibility', 'visible');
        
            console.log("in")
        }, function(){
            $(".map-container-info").fadeOut(100);

            $("#slice-map").attr('src', "Images/WebMap_V02/total.png")
            //$(".slice-map-text").removeClass('highlighted-axis');

            //$(".map-container-info").css('visibility', 'hidden');
            console.log("out")
        }
    )

    $(".read-more").click(function(e){
        console.log("HELLO")
        $(".read-more").hide();
        $(".more-info").show();
        $('.info-col').removeClass('col-lg-3');
        $('.info-col').addClass('col-lg-6');
        $('.other-col').addClass('col-lg-3')
        $('.other-col').removeClass('col-lg-6')

    })

    $(".read-less").click(function(e){
        $(".read-more").show();

        $('.info-col').removeClass('col-lg-6');
        $('.info-col').addClass('col-lg-3');
        $('.other-col').removeClass('col-lg-3');
        $('.other-col').addClass('col-lg-6');
        $(".more-info").hide();
    })

    $(".info-accordion").click(function(e){
        $(".more-info").hide();
        $(".read-more").show();

        $('.info-col').removeClass('col-lg-6');
        $('.info-col').addClass('col-lg-3');
        $('.other-col').removeClass('col-lg-3');
        $('.other-col').addClass('col-lg-6');

        console.log("TEST")

    })

    $(".term-box").hover(
        function(e){

        }, function(e){
            if($('.map-container-info').is(":visible")){
                
                $(".map-container-info").show();
            }

        }

    )

    $(".banner-map-area").hover(
        function(e){
            console.log(e.target.id)
            //$(".map-container-info").show(200);
            $(".map-container-info").fadeIn(200);
            switch(e.target.id) {
                case "banner-area-04":
                    $("#slice-map").attr('src', "Images/Slice/EditedSliceCMB.png")
                    $(".map-container-info > h1").text(information[1].title)
                    $(".map-container-info > img").attr('src', information[1].img)
                    break;
                case "banner-area-03":
                    $("#slice-map").attr('src', "Images/Slice/EditedSliceQuasar.png")
                    $(".map-container-info > h1").text(information[2].title)
                    $(".map-container-info>img").attr('src', information[2].img)
                    break;
                case "banner-area-02":
                    $("#slice-map").attr('src', "Images/Slice/EditedSliceLRG.png")
                    $(".map-container-info > h1").text(information[3].title)
                    $(".map-container-info>img").attr('src', information[3].img)
                    break;
                case "banner-area-01":
                    $("#slice-map").attr('src', "Images/Slice/EditedSliceNear.png")
                    $(".map-container-info > h1").text(information[4].title)
                    $(".map-container-info>img").attr('src', information[4].img)
                    break;
            }

            //$(".map-container-info").css('visibility', 'visible');
        
            console.log("in")
        }, function(){
            $(".map-container-info").hide(0);
            $("#slice-map").attr('src', "Images/Slice/NoText.png")

            //$(".map-container-info").css('visibility', 'hidden');
            console.log("out")
        }
    )
    $(window).scroll(function() {
        var windowTop = $(this).scrollTop() 
        var windowBottom = $(this).scrollTop() + $(window).outerHeight()
        var elementTop = $(".banner-outline").offset().top;
        var percentage = (windowTop - elementTop) / $(".banner-outline").outerHeight() * 100;
        var bottomPercentage = (windowBottom - elementTop) / $(".banner-outline").outerHeight() * 100;
        percentage = Math.max(Math.min(percentage, 100), 0)

        bottomPercentage = Math.min(bottomPercentage, 100)
        $(".banner-navigator-section").css({top: percentage + "%"})
        $(".banner-navigator-section").css({height: bottomPercentage - percentage + "%"})
        var barPos = $(".bar_container").offset().top - $(".banner-outline").offset().top
        var galaxyHeight = $(".banner-outline").outerHeight();

        var barPercentage = barPos/galaxyHeight
        lookback = 13.74 -  barPercentage * 13.74
        //$("#sidebar-lookback-time").html((1.0).toFixed(2))
        console.log("YES")
        $("#sidebar-lookback-time").html((lookback).toFixed(1));
        $("#sidebar-lookback-time_2").html((lookback).toFixed(1));

    })
    
    $("#scroll-btn").click(function() {
        $('html, body').animate({scrollTop:$('#bottom').offset().top + window.innerHeight * 0.2 - window.innerHeight, easing: 'linear'},{ duration: 1000, easing: "linear", complete: function () {
            console.log("HEY")
            }})

    })

    /*
    $("#viewMap").click(function() {
        $('html,body').animate({scrollTop:$('.map-container').offset().top, easing: 'linear'},{ duration: 1000, easing: "linear", complete: function () {
            console.log("HEY")
            }})

        
        window.scrollTo({
            top: $('.map-container').offset().top,
            left: 0,
            behavior: 'smooth'
          })    
    })
    */

    $("#viewBanner").click(function() {
        /*
        window.scrollTo({
            top: $('#bottom').offset().top - window.innerHeight,
            left: 0,
            behavior: 'smooth'
        })  
        */

    });

    $(".banner-modal").click(function(e) {
        console.log("HELLO")
        console.log(e.target.id)
        set_modal_pic(e.target.id)

    })

    $(".banner-info-box-content").click(function(e) {
        console.log("HEY")
        console.log($(this).parent().attr("id"))
         set_modal_pic($(this).parent().parent().attr("id"))
    })


    $(".banner-tick").click(function() {
        var id = $(this).attr('id');
        console.log($(this).top)
        /*
        window.scrollTo({
            top: $('.axis #' + id).offset().top - (window.innerHeight/4 * 3),
            left: 0,
            behavior: 'smooth'
        })  
        */
        console.log(id)
    })

    $(".banner-info-box-content").click(function() {
        $('#myModal').modal('toggle');

    })

    $(".banner-navigator").click(function(e) {
        var parentOffset = $(this).parent().offset(); 

        var posX = $(this).position().left,
            posY = $(this).position().top;
        height = $(this).parent().outerHeight();
        var percentage = ((e.pageY - parentOffset.top)/height)
        var pixelposition = $(".banner-outline").offset().top + $('.banner-outline').outerHeight() * percentage - ($(window).outerHeight()/2)
        console.log(percentage)
        console.log(pixelposition)
        window.scrollTo({
            top: pixelposition,
            left: 0,
            behavior: 'smooth'
          })  

    })
})



const information = {
    1: {title: "The Cosmic Microwave Background", caption: "This is an actual photograph of the first flash of light emitted soon after the big bang, 13.7 billion years ago. This light has been stretched by the expansion of the Universe and arrives at us as radiowaves. This is the edge of the observable Universe.", img: "Images/Explanations/cmb_illust.png"},
    2: {title: "Quasars", caption: "They are massive black holes located at the center of certain galaxies. As they accrete surrounding gas, they become extremely bright and can be seen across the Universe. Their light is blueish. At these distances, galaxies have become too faint the Sloan Digital Sky Survey telescope.", img: "Images/Explanations/Quasar@300x.png" },
    3: {title: "Luminous Red Galaxy", caption: "They are massive black holes located at the center of certain galaxies. As they accrete surrounding gas, they become extremely bright and can be seen across the Universe. Their light is blueish. At these distances, galaxies have become too faint the Sloan Digital Sky Survey telescope.", img: "Images/Placeholder images/Example Explanations/LRG.jpeg"},
    4: {title: "Near Galaxies", caption: "Each dot is a galaxy. All together, they form a filamentary structure. Spiral galaxies are faint and blue. Elliptical galaxies are yellowish and much brighter. We can see them farther away.", img: "Images/Explanations/Near_placeholder.png" },
    5: {title: "Redshift", caption: " PLAGARIZED: 'Red shift' is a key concept for astronomers. The term can be understood literally - the wavelength of the light is stretched, so the light is seen as 'shifted' towards the red part of the spectrum. Something similar happens to sound waves when a source of sound moves relative to an observer.", img: "Images/Explanations/Redshift@300x.png"},
    6: {title: "Lookback Time", caption: "PLAGARIZED: The time elapsed between when we detect the light here on Earth and when it was originally emitted by the source, is known as the 'lookback time'. The more distant an object is from us, the further back in time we are looking. ", img: "Images/Explanations/Lookback Time@300x.png" },
    7: {title: "Angle on the Sky", caption: "This is a slice of the sky this small... ", img: "Images/Placeholder images/Example Explanations/Example Explanations/Lookback.jpeg" },
    8: {title: "You are Here", caption: "We are currently in the Milky Way, in the Agsastarious neighborhood, in the Stamsf arm, in the Solar System, on Planet Earth.", img: "Images/Explanations/You are Here@300x.png" },
    9: {title: "Galaxies", caption: "PLAGARAIZED: Galaxies are sprawling systems of dust, gas, dark matter, and anywhere from a million to a trillion stars that are held together by gravity. Nearly all large galaxies are thought to also contain supermassive black holes at their centers.", img: "Images/Explanations/Galaxies_wikipedia cropped.png" },
}

const modal_info = {
    1: {img: "Images/SkyView"}
}

$(document).on("click", function (event) {
    // If the target is not the container or a child of the container, then process
    // the click event for outside of the container.
    if ($(event.target).closest(".info-box").length === 0) {
        $('.collapse').collapse('hide')
        $(".more-info").hide();

      console.log("You clicked outside of the container element");
    }
});
  
$("#viewMap").click(function() {
    $('html,body').animate({scrollTop:$('.map-container').offset().top, easing: 'linear'},{ duration: 500, easing: "linear", complete: function () {
        }})
})

function set_modal_pic(id) {
    switch(id){
        case "banner-info-1":
            $(".modal-body > img").attr('src', "Images/Skyview/V_01/cmb.png")
            break; 
        case "banner-info-2":
            $(".modal-body > img").attr('src', "Images/Skyview/V_01/12.png")
            break;   
        case "banner-info-3":
            $(".modal-body > img").attr('src', "Images/Skyview/V_01/8.5.png")
            break; 
        case "banner-info-4":
            $(".modal-body > img").attr('src', "Images/Skyview/V_01/4.5.png")
            break; 
        case "banner-info-5":
            $(".modal-body > img").attr('src', "Images/Skyview/V_01/1.8.png")
            break; 
        case "banner-info-6":
            $(".modal-body > img").attr('src', "Images/Skyview/V_01/0.1.png")
            break; 
    }

}
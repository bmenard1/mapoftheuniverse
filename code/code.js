
$(document).ready(function() {
    console.log("HELLO")
    $('.more-info').hide();

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
        /*
        $('.info-col').removeClass('col-lg-3');
        $('.info-col').addClass('col-lg-6');
        $('.other-col').addClass('col-lg-3')
        $('.other-col').removeClass('col-lg-6')
        */
    })

    $(".read-less").click(function(e){
        $(".read-more").show();
        /*
        $('.info-col').removeClass('col-lg-6');
        $('.info-col').addClass('col-lg-3');
        $('.other-col').removeClass('col-lg-3');
        $('.other-col').addClass('col-lg-6');
        */
        $(".more-info").hide();
    })

    $(".info-accordion").click(function(e){
        var myClass = $(this).attr("class");
        console.log(myClass)
        if(myClass.includes("collapsed")){
            $('.other-col').removeClass('col-lg-3');
            $('.other-col').addClass('col-lg-6');
            $('.this-col').removeClass('col-lg-6');
            $('.this-col').addClass('col-lg-3');
        } else {
            $('.other-col').removeClass('col-lg-6');
            $('.other-col').addClass('col-lg-3');
            $('.this-col').addClass('col-lg-6');
            $('.this-col').removeClass('col-lg-3');
    
        }

        $(".more-info").hide();
        $(".read-more").show();
        $('.info-col').removeClass('col-lg-6');
        $('.info-col').addClass('col-lg-3');
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

    $(".banner-info-box > .term-hover").hover(function(e){
        console.log("ANOTHER oNE")
        console.log($(this).siblings('img.explanation_image'))
        console.log($(this).siblings('img.skyview_image'))

        $(this).siblings('img.explanation_image').hide()
        $(this).siblings('img.skyview_image').show()

    }, function(e) {
        $(this).siblings('img.explanation_image').show()
        $(this).siblings('img.skyview_image').hide()

    })
    

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
        //var fade = $('.banner-info-box');
        var fade = $('.fade');
        var range = 400;
        var st = $(this).scrollTop();
        var center = st + $(window).outerHeight() * (2/4);
        /*
        $('.hideme').each( function(i){
            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            var top_of_window = $(window).scrollTop()
            var top_of_object = $(this).position().top
            //var bottom_of_window = $(window).scrollTop() 

            console.log(bottom_of_object)
            console.log(bottom_of_window)

            if( bottom_of_window > bottom_of_object ){
                $(this).animate({'opacity':'1'},1000);
            }
        });
        */

        fade.each(function () {
            var offset = $(this).offset().top;
            var height = $(this).outerHeight();
            offset = offset + height / 2; 
            var perc = Math.pow((center - offset) /  ($(window).outerHeight()/2), 2)
            //center =  offset + height / 1; 
            if(center-offset > 0){
                $(this).css({ 'opacity': 1 - perc });
            } else {
                $(this).css({ 'opacity': 1 - perc });
            }
        });
        
    })
    
    $("#scroll-btn").click(function() {
        $('html, body').animate({scrollTop:$('#bottom').offset().top + window.innerHeight * 0.2 - window.innerHeight, easing: 'linear'},{ duration: 2000, easing: "linear", complete: function () {
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

    $(".banner-info-box").click(function(e) {
        $('#myModal').modal('toggle');
        console.log(e.target.id)
        console.log( $(this).attr('id') )
        set_modal_pic($(this).attr('id') )
    })
    $('#myModal').on('hidden.bs.modal', function () {
        // do something…
        set_modal_pic(-1 )
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



$(document).on("click", function (event) {
    // If the target is not the container or a child of the container, then process
    // the click event for outside of the container.
    if ($(event.target).closest(".info-box").length === 0 && $(event.target).closest(".accordion-button").length != 1 ) {
        console.log($(event.target).closest(".accordion-button").length)
        $('.collapse').collapse('hide')
        $(".more-info").hide();
        $('.other-col').removeClass('col-lg-3');
        $('.other-col').addClass('col-lg-6');
        $('.this-col').removeClass('col-lg-6');
        $('.this-col').addClass('col-lg-3');


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
            $(".modal-body > img").attr('src', modal_info[1]["img"])
            $(".modal-header > h1").text(modal_info[1]["header"])
            $(".modal-footer > p").text(modal_info[1]["caption"])

            break; 
        case "banner-info-2":
            $(".modal-body > img").attr('src', modal_info[2]["img"])
            $(".modal-header > h1").text(modal_info[2]["header"])
            $(".modal-footer > p").text(modal_info[2]["caption"])
            break;   
        case "banner-info-3":
            $(".modal-body > img").attr('src', modal_info[3]["img"])
            $(".modal-header > h1").text(modal_info[3]["header"])
            $(".modal-footer > p").text(modal_info[3]["caption"])

            break; 
        case "banner-info-4":
            $(".modal-body > img").attr('src', modal_info[4]["img"])
            $(".modal-header > h1").text(modal_info[4]["header"])
            $(".modal-footer > p").text(modal_info[4]["caption"])
            break; 
        case "banner-info-5":
            $(".modal-body > img").attr('src', modal_info[5]["img"])
            $(".modal-header > h1").text(modal_info[5]["header"])
            $(".modal-footer > p").text(modal_info[5]["caption"])
            break; 
        case "banner-info-6":
            $(".modal-body > img").attr('src', modal_info[6]["img"])
            $(".modal-header > h1").text(modal_info[6]["header"])
            $(".modal-footer > p").text(modal_info[6]["caption"])
            break; 
        default:
            $(".modal-body > img").attr('src', "")
            $(".modal-header > h1").text("")
            $(".modal-footer > p").text("")

    }

}

const modal_info = {
    1: {img: "Images/Skyview/V_01/cmb.png", header: "The Cosmic Microwave Background", caption: "This is an actual photograph of the first flash of light emitted soon after the big bang, 13.7 billion years ago. This light has been stretched by the expansion of the Universe and arrives at us as radiowaves. This is the edge of the observable Universe."},
    2: {img: "Images/Skyview/V_01/12.png", header: "Redshifted Quasars", caption: "At these distances, the expansion of the Universe is so great that the blue photons from quasars get stretched and appear redder. A bit farther, we encounter an epoch during which the Universe is filled with hydrogen gas that prevents the propagation of visible light we could observe today. This epoch is called the 'dark ages'."},
    3: {img: "Images/Skyview/V_01/8.5.png", header: "Quasars", caption: "Quasars are massive black holes located at the center of certain galaxies. As they accrete surrounding gas and stars, they become extremely bright and can be seen across the Universe. Their light is blueish."},
    4: {img: "Images/Skyview/V_01/4.5.png", header: "Redshifted Elliptical Galaxies", caption: "As the Universe expands, photons gets stretched and objects appear redder. This is the case for the elliptical galaxies. At these distances, they appear red to us. As we no longer detect the fainter spiral galaxies, the filamentary structure is less visible."},
    5: {img: "Images/Skyview/V_01/1.8.png", header: "Elliptical Galaxies", caption: "Elliptical galaxies are yellowish and much brighter than spiral galaxies. We can see them farther away."},
    6: {img: "Images/Skyview/V_01/0.1.png", header: "Spiral Galaxies", caption: "Each dot is a galaxy shown with its apparent color. Spiral galaxies are faint and blue. Our galaxy, the Milky Way, is a blue spiral that would look like one of these if we could observe it from the outside."},

}
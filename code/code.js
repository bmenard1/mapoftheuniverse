
$(document).ready(function() {
    var visible_overlay = "#axis_set_01"
    var current_checked = 3
    $('.more-info').hide();

    $("#hide-terms").click(function(e){
        $(".term-box-words").slideToggle( 'slow', function(){
            var text = $("#hide-terms").text();
            $("#hide-terms").text(
                text == "Show" ? "Hide" : "Show");
         });
    })

    $(".modal-dialog").click(function(e){
    })

    /*
    var myModalEl = document.getElementById('download-beautiful-modal')
    myModalEl.addEventListener('hidden.bs.modal', function (event) {
      // do something...
      alert("BROKE")
    })
    */



    $(".dropdown-item").hover(function(e){
        $('.download-click-section').hide();
        $(this).children('.download-click-section').show();
        e.stopPropagation();
    }, function(e) {
        $('.download-click-section').hide();

    })

    $('.mapbox').bind('contextmenu',function() { return false; });

    $('img').on('dragstart', function(event) { event.preventDefault(); });


    $(".phone-banner-box").click(function(e){
        set_modal_pic(this.id)
        $('#myModal').modal('toggle');

    })

    $(".map-effect").hover(
        function(e){
            if($('.map-container-info').is(":hidden")){

                $(".map-container-info").fadeIn(200);
            }
            switch(e.target.id) {
                case "area_01":
                    $("#slice-map").attr('src', "https://apps.sciserver.org/mapoftheuniverse/Images/WebMap_V02/near.png")
                    $(".map-container-info > h1").text(information[4].title)
                    $(".map-container-info>img").attr('src', information[4].img)
                    $(".map-container-info>p").text(information[4].caption)
                    break;
                case "area_02":
                    $("#slice-map").attr('src', "https://apps.sciserver.org/mapoftheuniverse/Images/WebMap_V02/red.png")
                    $(".map-container-info > h1").text(information[3].title)
                    $(".map-container-info>img").attr('src', information[3].img)
                    $(".map-container-info>p").text(information[3].caption)
                    break;
                case "area_03":
                    $("#slice-map").attr('src', "https://apps.sciserver.org/mapoftheuniverse/Images/WebMap_V02/quasars.png")
                    $(".map-container-info > h1").text(information[2].title)
                    $(".map-container-info>img").attr('src', information[2].img)
                    $(".map-container-info>p").text(information[2].caption)
                    break;
                case "area_04":
                    $("#slice-map").attr('src', "https://apps.sciserver.org/mapoftheuniverse/Images/WebMap_V02/cmb.png")
                    $(".map-container-info > h1").text(information[1].title)
                    $(".map-container-info>img").attr('src', information[1].img)
                    $(".map-container-info>p").text(information[1].caption)
                    break;
                case "area_05":
                    $("#slice-map").attr('src', "https://apps.sciserver.org/mapoftheuniverse/Images/WebMap_V02/galaxies.png")
                    $(".map-container-info > h1").text(information[9].title)
                    $(".map-container-info>img").attr('src', information[9].img)
                    $(".map-container-info>p").text(information[9].caption)
                    break;
                case "axis_01":
                    $(".map-container-info > h1").text(information[7].title)
                    $(".map-container-info>img").attr('src', information[7].img)
                    $(".map-container-info>p").text(information[7].caption)
                    break;
                case "axis_02":
                    $(".map-container-info > h1").text(information[5].title)
                    $(".map-container-info>img").attr('src', information[5].img)
                    $(".map-container-info>p").text(information[5].caption)
                    break;
                case "axis_03":
                    $(".map-container-info > h1").text(information[6].title)
                    $(".map-container-info>img").attr('src', information[6].img)
                    $(".map-container-info>p").text(information[6].caption) 
                    break;
                case "axis_04":
                    $(".map-container-info > h1").text(information[8].title)
                    $(".map-container-info>img").attr('src', information[8].img)
                    $(".map-container-info>p").text(information[8].caption)
                    break;    
            }        
        }, function(){
            $(".map-container-info").fadeOut(100);
            $("#slice-map").attr('src', "https://apps.sciserver.org/mapoftheuniverse/Images/WebMap_V02/total.png")
        }
    )

    $(".dropdown-menu-center").click(function(e){
        e.stopPropagation();
        $('.download-click-section').hide();

     })
     

    $(".bottom-arrow").click(function(e){
        $('html, body').animate({scrollTop:$(".scroll-to-map").offset().top + $(".scroll-to-map").outerHeight() - $(window).height(), easing: 'linear'},{ duration: 2000, easing: "linear", complete: function () {
            console.log("HEY")
            }})
    })

    $(".info-accordion").click(function(e){
        var myClass = $(this).attr("class");
        if(myClass.includes("collapsed")){

            $('.other-col').removeClass('col-lg-3 this-col-change');
            $('.other-col').addClass('col-lg-6');
        } else {

            $('.other-col').removeClass('col-lg-6');
            $('.other-col').addClass('col-lg-3 this-col-change');
        }

        $(".more-info").hide();
        $(".read-more").show();
        $('.info-col').removeClass('col-lg-6');
        $('.info-col').addClass('col-lg-3');
    })


    let toggle_banner = false;
    $(".description").click(function(e){
        console.log("DESCRIPTION")
        var images = $(".description img")

        images.each(function(index){
            var data_src = $(this).attr('data-src')
            if(data_src){
                console.log(data_src)
            }

            $(this).attr("src", data_src)

        })

    })
    $(".banner-switch").click (function(e) {

        var images = $(".banner-section img")

        images.each(function(index){
            var data_src = $(this).attr('data-src')
            if(data_src){
                console.log(data_src)
            }

            $(this).attr("src", data_src)

        })


        if(!toggle_banner) {
            $(".map-section").fadeOut(400, function() {
                $(".banner-section").fadeIn(800)
                $(window).scrollTop($(".banner-section").offset().top + $(".banner-section").outerHeight() - $(window).height())
            }) 
        
            $(".cover").hide()

            toggle_banner = true;
        } else {
            $(".banner-section").fadeOut(400, function() {
                $(".map-section").fadeIn(800)
                $(".cover").show()
                $(window).scrollTop($(".scroll-to-map").offset().top + $(".scroll-to-map").outerHeight() - $(window).height())
            })
            
            toggle_banner = false

        }
    })

    $('.select-button').hover(function(e){
        id = this.id
        console.log(current_checked)
        if(current_checked == 3 && id == "near_label") {
            overlay_show = "#near_from_full" 
        } else if (current_checked == 3 && id == "outer_label") {
            overlay_show = "#outer_from_full" 
        } else if(current_checked == 2 && id == "near_label") {
            overlay_show = "#near_from_outer" 
        } else if(current_checked == 2 && id == "close_label") {
            overlay_show = "#close_from_outer" 
        } else if (current_checked == 3 && id == "close_label") {
            overlay_show = "#close_from_full" 
        } else if (current_checked == 1 && id == "close_label") {
            overlay_show = "#close_from_near" 
        }
         else {
            overlay_show = "none" 
            console.log("HOVERING HERE")
        } 
        if(overlay_show != "none") {
            console.log("SHOWING")
            $(overlay_show).show()
        }

    }, function(e) {
        $(overlay_show).hide()

    })

    $('input').on('change', function() {

        var checked = $("input[name=options-outlined]:checked").val()
        var other_checked = $("input[name=options-outlined2]:checked").val()
        var true_checked = 0
        if (checked != current_checked) {
            $('input:radio[name=options-outlined2][value=' + checked + ']').click();
            true_checked = checked
        } else {
            $('input:radio[name=options-outlined][value=' + other_checked + ']').click();
            true_checked = other_checked
        }

        console.log(true_checked)

        var axis_overlay = ""
        if(true_checked == 1) {
            axis_overlay = "#axis_set_03"; 
        } else if (true_checked == 2) {
            axis_overlay = "#axis_set_02"; 
        } else if (true_checked == 4) {
            axis_overlay = "#axis_set_04"; 

        } else {
            axis_overlay = "#axis_set_01"; 
        }



        $("#black-overlay").fadeIn("fast", function() {
            $(".hover-map-overlay").hide()
            $(visible_overlay).hide()
            $(axis_overlay).show()
            $("#black-overlay").fadeOut("fast", function(){});
            visible_overlay = axis_overlay
            current_checked = true_checked
        })

    });
      
    
    $(".banner-switch-hover").hover(function(e){
        $("#overlay").fadeIn("fast", function(){})
    }, function(e){
        console.log("OFF")
        $("#overlay").fadeOut("fast", function(){})
    })
    /*
    $(".banner-switch-near").hover(function(e){
        $("#overlay").fadeIn("fast", function(){})
    }, function(e){
        console.log("OFF")
        $("#overlay").fadeOut("fast", function(){})
    })
    */
    $(".banner-info-box >p> .term-hover").hover(function(e){
        $(this).parent().siblings('img.explanation_image').hide()
        $(this).parent().siblings('img.skyview_image').show()
    }, function(e) {
        $(this).parent().siblings('img.explanation_image').show()
        $(this).parent().siblings('img.skyview_image').hide()
    })

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
        $("#sidebar-lookback-time").html((lookback).toFixed(1));
        $("#sidebar-lookback-time_2").html((lookback).toFixed(1));
        var fade = $('.fade');
        var range = 400;
        var st = $(this).scrollTop();
        var center = st + $(window).outerHeight() * (2/4);
        
        var scroll_msg = $(".scroll-up-message");
        var scrollPercent =  $(window).scrollTop() / ($(document).height() - $(window).height());
        
        scroll_msg.css({opacity: 1-  (1-scrollPercent) *6 })
        fade.each(function () {
            var offset = $(this).offset().top;
            var height = $(this).outerHeight();
            offset = offset + height / 2; 
            var perc = Math.pow((center - offset) /  ($(window).outerHeight()/2), 2)

            if(center-offset > 0){
                $(this).css({ 'opacity': 1 - perc });
            } else {
                $(this).css({ 'opacity': 1 - perc });
            }
        });
        
    })


    $(".banner-modal").click(function(e) {
        set_modal_pic(e.target.id)
    })

    $(".banner-info-box-content").click(function(e) {
        set_modal_pic($(this).parent().parent().attr("id"))
    })


    $(".banner-tick").click(function() {
        var id = $(this).attr('id');
    })

    $(".banner-info-box").click(function(e) {
        $('#myModal').modal('toggle');
        set_modal_pic($(this).attr('id') )
    })

    $('#myModal').on('hidden.bs.modal', function () {
        // do something…
        set_modal_pic(-1 )
    })

    $(".banner-navigator, .edit").click(function(e) {
        var parentOffset = $(this).parent().offset(); 
        var posX = $(this).position().left,
            posY = $(this).position().top;
        height = $(this).parent().outerHeight();
        var percentage = ((e.pageY - parentOffset.top)/height)
        var pixelposition = $(".banner-outline").offset().top + $('.banner-outline').outerHeight() * percentage - ($(window).outerHeight()/2)
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
        $('.collapse').collapse('hide')
        $(".more-info").hide();
        $('.other-col').removeClass('col-lg-3');
        $('.other-col').addClass('col-lg-6');

        $('.this-col').removeClass('col-lg-6');
        $('.this-col').addClass('col-lg-3');

        $('.other-col-2').removeClass('col-lg-6');
        $('.other-col-2').addClass('col-lg-8');

        $('.this-col-2').removeClass('col-lg-6');
        $('.this-col-2').addClass('col-lg-4');
    }
    var $target = $(event.target);
    $('.download-click-section').hide();

  });
  

function set_modal_pic(id) {
    switch(id){
        case "banner-info-1": case "phone-banner-1":
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
    1: {img: "https://apps.sciserver.org/mapoftheuniverse/Images/Skyview/V_01/cmb.jpeg", header: "the cosmic microwave background", caption: "This is an actual photograph of the first flash of light emitted soon afterthe big bang, 13.7 billion years ago. This light has been stretched by the expansion of the Universe and arrives at us as radiowaves. This is the edge of the observable Universe."},
    2: {img: "https://apps.sciserver.org/mapoftheuniverse/Images/Skyview/V_01/12.jpeg", header: "redshifted quasars", caption: " At these distances, the expansion of the Universe is so great that the blue photons from quasars get stretched and appear redder. A bit farther, we encounter an epoch during which the Universe is filled with hydrogen gas that prevents the propagation of visible light we could observe today. This epoch is called the \"dark ages\"."},
    3: {img: "https://apps.sciserver.org/mapoftheuniverse/Images/Skyview/V_01/8.5.jpg", header: "quasars", caption: "Quasars are massive black holes located at the center of certain galaxies. As they accrete surrounding gas and stars, they become extremely bright and can be seen across the Universe. Their light is blueish."},
    4: {img: "https://apps.sciserver.org/mapoftheuniverse/Images/Skyview/V_01/4.5.jpeg", header: "redshifted elliptical galaxies", caption: "As the Universe expands, photons gets stretched and objects appear redder. This is the case for the elliptical galaxies. At these distances, they appear red to us.As we no longer detect the fainter spiral galaxies, the filamentary structure is less visible."},
    5: {img: "https://apps.sciserver.org/mapoftheuniverse/Images/Skyview/V_01/1.8.jpeg", header: "elliptical galaxies", caption: "Elliptical galaxies are yellowish and much brighter than spiral galaxies. We can see them farther away."},
    6: {img: "https://apps.sciserver.org/mapoftheuniverse/Images/Skyview/V_01/0.1.jpeg", header: "spiral galaxies", caption: "Each dot is a galaxy shown with its apparent color. Spiral galaxies are faint and blue. Our galaxy, the Milky Way, is a blue spiral that would look like one of these if we could observe it from the outside."},
}
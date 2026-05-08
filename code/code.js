var current_checked = 3
var visible_overlay = "#axis_set_01"
var user_clicked = false;
var carousel_handle = null;
var animating = false
function mod(n, m) {
    return ((n % m) + m) % m;
  }

  
$(document).ready(function() {
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
                    $("#slice-map").attr('src', "https://menard.pha.jhu.edu/MapoftheUniverse/Images/WebMap_V02/near.png")
                    $(".map-container-info > h1").text(information[4].title)
                    $(".map-container-info>img").attr('src', information[4].img)
                    $(".map-container-info>p").text(information[4].caption)
                    break;
                case "area_02":
                    $("#slice-map").attr('src', "https://menard.pha.jhu.edu/MapoftheUniverse/Images/WebMap_V02/red.png")
                    $(".map-container-info > h1").text(information[3].title)
                    $(".map-container-info>img").attr('src', information[3].img)
                    $(".map-container-info>p").text(information[3].caption)
                    break;
                case "area_03":
                    $("#slice-map").attr('src', "https://menard.pha.jhu.edu/MapoftheUniverse/Images/WebMap_V02/quasars.png")
                    $(".map-container-info > h1").text(information[2].title)
                    $(".map-container-info>img").attr('src', information[2].img)
                    $(".map-container-info>p").text(information[2].caption)
                    break;
                case "area_04":
                    $("#slice-map").attr('src', "https://menard.pha.jhu.edu/MapoftheUniverse/Images/WebMap_V02/cmb.png")
                    $(".map-container-info > h1").text(information[1].title)
                    $(".map-container-info>img").attr('src', information[1].img)
                    $(".map-container-info>p").text(information[1].caption)
                    break;
                case "area_05":
                    $("#slice-map").attr('src', "https://menard.pha.jhu.edu/MapoftheUniverse/Images/WebMap_V02/galaxies.png")
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
            $("#slice-map").attr('src', "https://menard.pha.jhu.edu/MapoftheUniverse/Images/WebMap_V02/total.png")
        }
    )

    $(".dropdown-menu-center").click(function(e){
        e.stopPropagation();
        $('.download-click-section').hide();

     })
     

    $(".bottom-arrow").click(function(e){
        $('html, body').animate({scrollTop:$(".scroll-to-map").offset().top + $(".scroll-to-map").outerHeight() - $(window).height(), easing: 'linear'},{ duration: 2000, easing: "linear", complete: function () {
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
        /*
        if ($("#full").is(":checked")) {
            $("#outer_from_full").hide();
        } else {
            $("#full").prop('checked', true);
            zoomlevel()
        }
        */
       $(".hover-map-overlay").fadeOut("fast")

        if(carousel_handle) {
            clearInterval(carousel_handle)
            carousel_handle = null
        }

        var images = $(".description img")

        images.each(function(index){
            var data_src = $(this).attr('data-src')
            $(this).attr("src", data_src)

        })

    })

    $(".banner-switch").click (function(e) {
        var images = $(".banner-section img")
        images.each(function(index){
            var data_src = $(this).attr('data-src')
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

    $(".zoom-icon").click(function(e){
        
        change = 1
        if ($(e.target).hasClass('plus-icon')) {
            change = -1
        } else {
            change = 1
        }        
        clearInterval(carousel_handle)
        options = ["#full", "#outer", "#near",  "#close", "#near_galaxy_view"]
        var checked = $("input[name=options-outlined]:checked").val()
        var other_checked = $("input[name=options-outlined2]:checked").val()
        var true_checked = 0
        var order = ['3', '2', '1', '4', '5']
        if (checked != current_checked) {
            $('input:radio[name=options-outlined2][value=' + checked + ']').prop('checked', true);
            //$('input:radio[name=options-outlined2][value=' + checked + ']').click();
            true_checked = checked
        } else {
            $('input:radio[name=options-outlined][value=' + other_checked + ']').prop('checked', true);
            //$('input:radio[name=options-outlined][value=' + other_checked + ']').click();
            true_checked = other_checked
        }
        
        
        $(options[mod((order.indexOf(true_checked)+ change),5)]).prop('checked', true);
        zoomlevel()

        
    })

    $('.select-button').hover(function(e){
        id = this.id
        if(current_checked == 3 && id == "near_label" ) {
            overlay_show = "#near_from_full" 
        } else if (current_checked == 3 && id == "outer_label") {
            overlay_show = "#outer_from_full" 
        } else if(current_checked == 2 && id == "near_label") {
            overlay_show = "#near_from_outer" 
        } else if(current_checked == 2 && (id == "close_label" || id == "near_galaxy_view_label")) {
            overlay_show = "#close_from_outer" 
        } else if (current_checked == 3 && (id == "close_label" || id == "near_galaxy_view_label")) {
            overlay_show = "#close_from_full" 
        } else if (current_checked == 1 && (id == "close_label" || id == "near_galaxy_view_label")) {
            overlay_show = "#close_from_near" 
        } 
         else {
            overlay_show = "none" 
        } 
        if(overlay_show != "none") {
            $(overlay_show).show()
        }
    }, function(e) {
        $(overlay_show).hide()
    })

    $('input').on('change', function() {
        user_clicked = true;
        zoomlevel()
    });
      
    $('.zoom_button').click(function() {
        clearInterval(carousel_handle)

    })
    
    $(".banner-switch-hover").hover(function(e){
        $("#overlay").fadeIn("fast", function(){})
    }, function(e){
        $("#overlay").fadeOut("fast", function(){})
    })
    /*
    $(".banner-switch-near").hover(function(e){
        $("#overlay").fadeIn("fast", function(){})
    }, function(e){
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

    var UNIVERSE_AGE_GYR = 13.7;
    var scroll_ticking = false;
    var $mapbox = $(".mapbox");
    var $bannerOutline = $(".banner-outline");
    var $bannerNav = $(".banner-navigator-section");
    var $barContainer = $(".bar_container");
    var $lookbackA = $("#sidebar-lookback-time");
    var $lookbackB = $("#sidebar-lookback-time_2");
    var $scrollMsg = $(".scroll-up-message");
    var $fullRadio = $("#full");
    var $win = $(window);
    var $doc = $(document);

    function onScroll() {
        var winH = window.innerHeight;
        var scrollY = window.scrollY;
        var bottomOfScreen = scrollY + winH;

        var mapboxOffset = $mapbox.offset();
        if (mapboxOffset) {
            var top_of_element = mapboxOffset.top;
            var bottom_of_element = top_of_element + $mapbox.outerHeight();
            if ((bottomOfScreen > top_of_element) && (scrollY < bottom_of_element)) {
                if (!animating) {
                    carousel();
                    animating = true;
                }
            } else {
                $fullRadio.prop('checked', true);
                zoomlevel();
                clearInterval(carousel_handle);
                animating = false;
            }
        }

        var bannerOffset = $bannerOutline.offset();
        if (bannerOffset) {
            var elementTop = bannerOffset.top;
            var bannerH = $bannerOutline.outerHeight();
            var percentage = Math.max(Math.min((scrollY - elementTop) / bannerH * 100, 100), 0);
            var bottomPercentage = Math.min((bottomOfScreen - elementTop) / bannerH * 100, 100);
            $bannerNav.css({ top: percentage + "%", height: (bottomPercentage - percentage) + "%" });

            var barOffset = $barContainer.offset();
            if (barOffset) {
                var barPercentage = (barOffset.top - elementTop) / bannerH;
                var lookback = UNIVERSE_AGE_GYR - barPercentage * UNIVERSE_AGE_GYR;
                var lookbackStr = lookback.toFixed(1);
                $lookbackA.html(lookbackStr);
                $lookbackB.html(lookbackStr);
            }
        }

        var docH = $doc.height();
        var scrollPercent = docH > winH ? scrollY / (docH - winH) : 0;
        $scrollMsg.css({ opacity: 1 - (1 - scrollPercent) * 6 });

        var center = scrollY + winH * 0.5;
        var halfWin = winH * 0.5;
        $('.fade').each(function () {
            var $el = $(this);
            var elOffset = $el.offset();
            if (!elOffset) return;
            var offset = elOffset.top + $el.outerHeight() / 2;
            var perc = Math.pow((center - offset) / halfWin, 2);
            $el.css({ opacity: 1 - perc });
        });

        scroll_ticking = false;
    }

    $win.scroll(function() {
        if (!scroll_ticking) {
            window.requestAnimationFrame(onScroll);
            scroll_ticking = true;
        }
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

function carousel() {
    
    options = ["#outer", "#near",  "#close", "#near_galaxy_view", "#full"]
    hover_options = ["#outer_from_full", "#near_from_outer", "#close_from_near", "#Galaxy_View"]
    option_index = 0

    carousel_handle = setInterval(function(){ 
        if (option_index %2 || option_index == 6) {

            if(option_index == 7) {
                option_index = 8
            }

            $(hover_options[Math.floor(option_index/2)]).fadeOut()

            $(options[Math.floor(option_index/2)]).prop('checked', true);
            zoomlevel()
    
        } else {
            $(hover_options[Math.floor(option_index/2)]).fadeIn(300)
        }
        
        option_index += 1
        option_index = option_index%9

    }, 3000);

}

const information = {
    1: {title: "The Cosmic Microwave Background", caption: "This is an actual photograph of the first flash of light emitted soon after the Big Bang, 13.7 billion years ago. The expansion of the Universe has stretched this light, so it now reaches us as microwave radio waves. It marks the edge of the observable Universe.", img: "Images/Explanations/cmb_illust.png"},
    2: {title: "Quasars", caption: "Quasars are massive black holes at the centers of certain galaxies. As they accrete surrounding gas, they become extremely bright and can be seen across the Universe. Their light is blueish. At these distances, galaxies have become too faint for the Sloan Digital Sky Survey telescope to detect.", img: "Images/Explanations/Quasar@300x.png" },
    3: {title: "Luminous Red Galaxy", caption: "Luminous Red Galaxies are massive elliptical galaxies hundreds of times brighter than the Milky Way. Their old, cool stars give them a distinctly reddish color, and their brightness lets us see them billions of light years away.", img: "Images/Explanations/Redshift@300x.png"},
    4: {title: "Near Galaxies", caption: "Each dot is a galaxy. Together they form a filamentary structure. Spiral galaxies are faint and blue. Elliptical galaxies are yellowish and much brighter, so we can see them farther away.", img: "Images/Explanations/Near_placeholder.png" },
    5: {title: "Redshift", caption: "As the Universe expands, light traveling toward us gets stretched. This shifts its wavelength toward the red end of the spectrum — what astronomers call redshift. The more distant an object, the more its light is stretched, and the redder it appears.", img: "Images/Explanations/Redshift@300x.png"},
    6: {title: "Lookback Time", caption: "Light takes time to travel. When we look at a distant object, we see it as it was when its light first set out. This delay is the lookback time. The farther we look, the further back in time we see.", img: "Images/Explanations/Lookback Time@300x.png" },
    7: {title: "Angle on the Sky", caption: "The map shows a thin slice of the sky, about 10° wide. The full survey covers a larger region, but a 2D map could not display it all at once without saturating the image with dots.", img: "Images/Explanations/Lookback Time@300x.png" },
    8: {title: "You are Here", caption: "We are currently in the Local Group, in the Milky Way galaxy, in the Orion Arm, in the Solar System, on Planet Earth.", img: "Images/Explanations/You are Here@300x.png" },
    9: {title: "Galaxies", caption: "A galaxy is a vast system of stars, gas, dust, and dark matter held together by gravity. Each contains millions to trillions of stars. Most large galaxies host a supermassive black hole at their center.", img: "Images/Explanations/Galaxies_wikipedia cropped.png" },
}



$(document).on("click", function (event) {
    // If the target is not the container or a child of the container, then process
    // the click event for outside of the container.
    if ($(event.target).closest(".info-box").length === 0 && $(event.target).closest(".accordion-button").length != 1 && $(event.target).closest(".zoom-container").length != 1) {
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

function zoomlevel() {
    var checked = $("input[name=options-outlined]:checked").val()
    var other_checked = $("input[name=options-outlined2]:checked").val()
    var true_checked = 0

    if (checked != current_checked) {
        $('input:radio[name=options-outlined2][value=' + checked + ']').prop('checked', true);
        //$('input:radio[name=options-outlined2][value=' + checked + ']').click();
        true_checked = checked
    } else {
        $('input:radio[name=options-outlined][value=' + other_checked + ']').prop('checked', true);
        //$('input:radio[name=options-outlined][value=' + other_checked + ']').click();
        true_checked = other_checked
    }


    var axis_overlay = ""
    if(true_checked == 1) {
        axis_overlay = "#axis_set_03"; 
    } else if (true_checked == 2) {
        axis_overlay = "#axis_set_02"; 
    } else if (true_checked == 4) {
        axis_overlay = "#axis_set_04"; 

    } else if(true_checked == 5) {
        axis_overlay = "#axis_set_05"
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
}

const modal_info = {
    1: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/cmb.jpeg", header: "the cosmic microwave background", caption: "This is an actual photograph of the first flash of light emitted soon afterthe big bang, 13.7 billion years ago. This light has been stretched by the expansion of the Universe and arrives at us as radiowaves. This is the edge of the observable Universe."},
    2: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/12.jpeg", header: "redshifted quasars", caption: " At these distances, the expansion of the Universe is so great that the blue photons from quasars get stretched and appear redder. A bit farther, we encounter an epoch during which the Universe is filled with hydrogen gas that prevents the propagation of visible light we could observe today. This epoch is called the \"dark ages\"."},
    3: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/8.5.jpg", header: "quasars", caption: "Quasars are massive black holes located at the center of certain galaxies. As they accrete surrounding gas and stars, they become extremely bright and can be seen across the Universe. Their light is blueish."},
    4: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/4.5.jpeg", header: "redshifted elliptical galaxies", caption: "As the Universe expands, photons gets stretched and objects appear redder. This is the case for the elliptical galaxies. At these distances, they appear red to us.As we no longer detect the fainter spiral galaxies, the filamentary structure is less visible."},
    5: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/1.8.jpeg", header: "elliptical galaxies", caption: "Elliptical galaxies are yellowish and much brighter than spiral galaxies. We can see them farther away."},
    6: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/0.1.jpeg", header: "spiral galaxies", caption: "Each dot is a galaxy shown with its apparent color. Spiral galaxies are faint and blue. Our galaxy, the Milky Way, is a blue spiral that would look like one of these if we could observe it from the outside."},
}

$(document).ready(function() {
    console.log("HELLO")
    $('.more-info').hide();

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

    $(".map-effect").hover(
        function(e){
            console.log(e.target.id)
            //$(".map-container-info").show(200);
            //$(".map-container-info").fadeIn(500);
            if($('.map-container-info').is(":hidden")){

                $(".map-container-info").slideDown(100);
            }

            switch(e.target.id) {
                case "area_01":
                    $("#slice-map").attr('src', "Images/WebMap_V01/near.png")
                    $(".map-container-info > h1").text(information[1].title)
                    $(".map-container-info>img").attr('src', information[1].img)
                    $(".map-container-info>p").text(information[1].caption)

                    break;
                case "area_02":
                    $("#slice-map").attr('src', "Images/WebMap_V01/red.png")
                    $(".map-container-info > h1").text(information[2].title)
                    $(".map-container-info>img").attr('src', information[2].img)
                    $(".map-container-info>p").text(information[2].caption)

                    break;
                case "area_03":
                    $("#slice-map").attr('src', "Images/WebMap_V01/quasars.png")
                    $(".map-container-info > h1").text(information[3].title)
                    $(".map-container-info>img").attr('src', information[3].img)
                    $(".map-container-info>p").text(information[3].caption)

                    break;
                case "area_04":
                    $("#slice-map").attr('src', "Images/WebMap_V01/cmb.png")
                    $(".map-container-info > h1").text(information[4].title)
                    $(".map-container-info>img").attr('src', information[4].img)
                    $(".map-container-info>p").text(information[4].caption)

                    break;
                case "area_05":
                    $("#slice-map").attr('src', "Images/WebMap_V01/galaxies.png")
                    $(".map-container-info > h1").text(information[4].title)
                    $(".map-container-info>img").attr('src', information[4].img)
                    $(".map-container-info>p").text(information[4].caption)

                    break;

            }

            //$(".map-container-info").css('visibility', 'visible');
        
            console.log("in")
        }, function(){
            $("#slice-map").attr('src', "Images/WebMap_V01/total.png")
            //$(".map-container-info").css('visibility', 'hidden');
            console.log("out")
        }
    )

    $("#read-more").click(function(e){
        console.log("READ MORE");
        $(".more-info").slideDown();

    })
    $(".term-box").hover(
        function(e){

        }, function(e){
            if($('.map-container-info').is(":visible")){

                $(".map-container-info").slideUp();
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
                    $(".map-container-info>img").attr('src', information[1].img)
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
            $(".map-container-info").fadeOut(0);
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

    })
    
    $("#scroll-btn").click(function() {
        window.scrollTo({
            top: $('#bottom').offset().top - window.innerHeight,
            left: 0,
            behavior: 'smooth'
          })  
    })

    $("#viewMap").click(function() {

        window.scrollTo({
            top: $('.map-container').offset().top,
            left: 0,
            behavior: 'smooth'
          })    })
    
    $("#viewBanner").click(function() {
        window.scrollTo({
            top: $('#bottom').offset().top - window.innerHeight,
            left: 0,
            behavior: 'smooth'
        })  
    });


    $("#about").click(function() {
        window.scrollTo({
            top: $('.about-container').offset().top,
            left: 0,
            behavior: 'smooth'
        })  
    })
    $("#hide-term-box").click(function() {
        $(".term-box").hide()
    })
    $(".banner-tick").click(function() {
        var id = $(this).attr('id');
        window.scrollTo({
            top: $('.axis #' + id).offset().top - (window.innerHeight/4 * 3),
            left: 0,
            behavior: 'smooth'
        })  
        console.log(id)
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
    1: {title: "The Cosmic Microwave Background", caption: "This is an actual photograph of the first flash of light emitted soon after the big bang, 13.7 billion years ago. This light has been stretched by the expansion of the Universe and arrives at us as radiowaves. This is the edge of the observable Universe.", img: "Images/Placeholder images/Example Explanations/CMB.jpeg"},
    2: {title: "Quasars", caption: "They are massive black holes located at the center of certain galaxies. As they accrete surrounding gas, they become extremely bright and can be seen across the Universe. Their light is blueish. At these distances, galaxies have become too faint the Sloan Digital Sky Survey telescope.", img: "Images/Placeholder images/Example Explanations/Quasar.jpeg" },
    3: {title: "Luminous Red Galaxy", caption: "They are massive black holes located at the center of certain galaxies. As they accrete surrounding gas, they become extremely bright and can be seen across the Universe. Their light is blueish. At these distances, galaxies have become too faint the Sloan Digital Sky Survey telescope.", img: "Images/Placeholder images/Example Explanations/LRG.jpeg"},
    4: {title: "Near Galaxies", caption: "Each dot is a galaxy. All together, they form a filamentary structure. Spiral galaxies are faint and blue. Elliptical galaxies are yellowish and much brighter. We can see them farther away.", img: "Images/Placeholder images/Example Explanations/Near Galaxies.png" },
    5: {title: "Redshift", caption: "Texts. A test", img: "Images/Placeholder images/Example Explanations/Example Explanations/Redshift.jpeg"},
    6: {title: "Lookback Time", caption: "Texts. <br> A test", img: "Images/Placeholder images/Example Explanations/Lookback.jpeg" },
    7: {title: "Angle on the Sky", caption: "Texts. <br> A test", img: "Images/Placeholder images/Example Explanations/Example Explanations" },
    8: {title: "You are Here", caption: "Texts. <br> A test", img: "Images/Placeholder images/Example Explanations/Example Explanations" },

}
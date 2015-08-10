$(document).ready(function() {
    var siteNavTop = $(".site-navbar").offset().top;
    var windowWidth = $(window).width();

    $(window).resize(function() {
        windowWidth = $(window).width();
    });

    $(window).scroll(function() {
        if($(this).scrollTop() > siteNavTop) {
            $(".site-navbar").addClass("nav-fixed");
        }
        else {
            $(".site-navbar").removeClass("nav-fixed");
        }
    });

    $('.smooth-scroll').click(function(event) {
        event.preventDefault();
        var section = $(this).attr('href');
        if(windowWidth > 767) {
            var sectionPos = $(""+section).offset().top - $('.site-navbar').height();
        }
        else {
            var sectionPos = $(""+section).offset().top;
        }
        $('html,body').animate({scrollTop:sectionPos}, '900');
    });

    $('.turn-right').click(function() {
        $(this).parent('.box-front-side').addClass('rotate').delay(200).queue(function() {
            $(this).removeClass('show-side').removeClass('rotate');
            $(this).parents('.box').find('.box-back-side').addClass('show-side');
            $(this).clearQueue();
        });
    });
    $('.turn-left').click(function() {
        $(this).parent('.box-back-side').addClass('rotate').queue(function() {
            $(this).removeClass('show-side').removeClass('rotate');
            $(this).parents('.box').find('.box-front-side').addClass('show-side');
            $(this).clearQueue();
        });
    });
});
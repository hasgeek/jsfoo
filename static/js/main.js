$(document).ready(function() {
    var siteNavTop = $(".site-navbar").offset().top;

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
        if((window).width > 768) {
            var sectionPos = $(""+section).offset().top - $('.site-navbar').height();
        }
        else {
            var sectionPos = $(""+section).offset().top;
        }
        $('html,body').animate({scrollTop:sectionPos}, '900');
    });
});
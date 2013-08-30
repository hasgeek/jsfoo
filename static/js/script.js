function initExpandBlurb () {
    
    $('a.expand-blurb').each(function() {
        var   $blurb        = $(this.hash)
            , $toggle       = $($blurb.data('toggle-link'))
            , active_text   = $blurb.data('active-text')
            , deactive_text = $blurb.data('deactive-text')
            ;
        
        $(this).on('click', function() {
            $blurb.slideToggle(400, function() {
                if ($blurb.is(':visible')) $toggle.html(active_text);
                else $toggle.html(deactive_text);
            });
            return false;
        });
            
    })
    
}

function main() {
    initExpandBlurb();
}

$(main);
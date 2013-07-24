
function expandProgramCommitteeBio () {
    $('.program-committee ul h3 a').on('click', function (event) {
        var   $target = $(this)
            , $container = $target.closest('li')
            ;
        $target.closest('ul').removeClass('mobile-contracted');
        $('.program-committee-bio', $container).slideDown();
        event.preventDefault();
    });
}

function main () {
    expandProgramCommitteeBio();
}

$(main)

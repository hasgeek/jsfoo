var $cog = $('#cog'),
$body = $(document.body);

$(window).scroll(function() {
	$cog.css({
		'transform': 'rotate(' + $body.scrollTop() + 'deg)'
	});
});
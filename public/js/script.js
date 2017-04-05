$(function() {
	$(".open_layer").click(function(e) {
		e.preventDefault();
		$(this).next().addClass("on");
	});
	$(".layer .close").click(function(e) {
		e.preventDefault();
		$(this).parent().removeClass("on");
	});
	$(document).keydown(function(e) {
		var code = e.keyCode ? e.keyCode : e.which;
		if (code === 27) {
			$(".layer.on").removeClass("on");
	    }
	});

});
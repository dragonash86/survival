$(function() {
	$(".open_layer").click(function(e) {
		e.preventDefault();
		$(this).next().addClass("on");
	});
	$(".layer .close").click(function(e) {
		e.preventDefault();
		$(this).parent().removeClass("on");
	});
});
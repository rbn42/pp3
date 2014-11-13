function initMouseBind(canvas) {
	var mousePosition = vec2.fromValues(0, 0);
	function MoveMouse(x, y) {
		mousePosition[0] = x / $(canvas).width();
		mousePosition[1] = y / $(canvas).height();
	}

	function onDocumentMouseMove(event) {
		MoveMouse(event.clientX, event.clientY);
	}

	function onDocumentTouchMove(event) {
		if (event.touches.length == 1) {
			event.preventDefault();
			MoveMouse(event.touches[0].clientX, event.touches[0].clientY);
		}
	} 

	$(window).bind('mousemove', onDocumentMouseMove);
	$(window).bind('touchstart', onDocumentTouchMove);
	$(window).bind('touchmove', onDocumentTouchMove);
	return mousePosition;
}

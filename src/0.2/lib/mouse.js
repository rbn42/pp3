function initMouseBind(canvas) {
	var mousePosition = vec2.fromValues(0, 0);
	function MoveMouse(x, y) {
		mousePosition[0] = x / $(canvas).width();
		mousePosition[1] = y / $(canvas).height();
	}

	function onDocumentTouchMove(event) {
		if (event.touches.length > 1)
			return;
		event.preventDefault();
		var touchobj = event.touches[0];
		MoveMouse(touchobj.clientX, touchobj.clientY);
	}

	function onDocumentTouchStart(event) {
		if (event.touches.length > 1)
			return;
		var touchobj = event.touches[0];
		MoveMouse(touchobj.clientX, touchobj.clientY);
	}

	function onDocumentMouseMove(event) {
		var touchobj = event;
		MoveMouse(touchobj.clientX, touchobj.clientY);
	}


	window.addEventListener('mousemove', onDocumentMouseMove, false);
	canvas.addEventListener('touchstart', onDocumentTouchStart, false);
	canvas.addEventListener('touchmove', onDocumentTouchMove, false);
	return mousePosition;
}

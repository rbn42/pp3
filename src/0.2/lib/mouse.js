function initMouseBind(canvas) {
	var mousePosition = vec2.fromValues(0, 0);
	function MoveMouse(x, y) {
		mousePosition[0] = x / $(canvas).width();
		mousePosition[1] = y / $(canvas).height();
	}

	function onDocumentTouchMove(event) {
		// touchobj;
		if (event.touches&&event.touches.length > 0)
	 		var  touchobj = event.touches[0];  
		else if (event.changedTouches&&event.changedTouches.length > 0)
			var touchobj = event.changedTouches[0];
		else if(event.clientX)
			var  touchobj = event;
		MoveMouse(touchobj.clientX, touchobj.clientY);  
	} 
	window.addEventListener('mousemove', onDocumentTouchMove, false); 
	window.addEventListener('touchstart', onDocumentTouchMove, false);
	window.addEventListener('touchmove', onDocumentTouchMove, false);
	return mousePosition;
}

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                         
	xDown = evt.touches[0].clientX;                                      
        yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
	if ( ! xDown || ! yDown ) {
		return;
	}

	var xUp = evt.touches[0].clientX;                                    
	var yUp = evt.touches[0].clientY;

	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
		if ( xDiff > 0 ) {
			elem = document.elementFromPoint(xUp, yUp);
			//elem.style.color = newColor;
			console.log('left swipe ' + elem.id) 
		} else {
			console.log('right swipe')
		}                       
	} else {
	        if ( yDiff > 0 ) {
	            console.log('up swipe') 
		} else { 
	            console.log('down swipe')
		}                                                                 
	}
	/* reset values */
	xDown = null;
        yDown = null; 
}


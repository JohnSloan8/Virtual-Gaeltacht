export default function dealWithCSSExpressionGestureEvent(emotionGesture, expression, start) {
	if (start) {
		$('.' + emotionGesture + '-button-live').css('opacity', '0.5')
		$('.' + emotionGesture + '-button-live').removeClass('border')
		$('#' + expression).parent().css('opacity', '1')
		$('#' + expression).parent().removeClass('bg-dark')	
		$('#' + expression).parent().addClass('border')	
		$('#' + expression).parent().addClass('bg-light')	
	} else {
		$('.' + emotionGesture + '-button-live').css('opacity', '1')
		$('#' + expression).parent().removeClass('bg-light')	
		$('#' + expression).parent().addClass('bg-dark')	
		if(emotionGesture === 'gesture') {
			$('#' + expression).parent().removeClass('border')	
		}
	}
}


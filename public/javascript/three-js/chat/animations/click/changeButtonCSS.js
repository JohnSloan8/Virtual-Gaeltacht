export default function dealWithCSSExpressionGestureEvent(emotionGesture, expression, start) {
	if (start) {
		$('#' + expression).parent().removeClass('bg-dark')	
		$('#' + expression).parent().addClass('bg-light')	
	} else {
		$('#' + expression).parent().removeClass('bg-light')	
		$('#' + expression).parent().addClass('bg-dark')	
	}
}


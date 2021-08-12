import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
const easingDict = {
	'linear': TWEEN.Easing.Linear.None,
	'quadraticIn': TWEEN.Easing.Quadratic.In,
	'quadraticOut': TWEEN.Easing.Quadratic.Out,
	'cubicInOut': TWEEN.Easing.Cubic.InOut,
	'cubicIn': TWEEN.Easing.Cubic.In,
	'cubicOut': TWEEN.Easing.Cubic.Out,
	'quinticIn': TWEEN.Easing.Quintic.In,
	'quinticOut': TWEEN.Easing.Quintic.Out,
	'backIn': TWEEN.Easing.Back.In,
	'backOut': TWEEN.Easing.Back.Out
}

export default easingDict

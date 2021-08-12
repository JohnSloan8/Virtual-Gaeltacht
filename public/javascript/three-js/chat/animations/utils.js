import { participants } from "../models/components/avatar.js";

window.beginAction = beginAction;
window.getActionFromName = getActionFromName;
var playing;

export default function beginAction(
	actionName,
	pNo,
	startTime,
	weight,
	timeScale
) {
	let action = getActionFromName(actionName, pNo);
	resetAllActionWeights(pNo);
	action.setEffectiveWeight(0.3)
	console.log('isRunning:', action.isRunning())
	console.log('action:', action)
	//setWeight(action, startTime, weight, timeScale);
	//action.fadeIn(weight)
	action.fadeTo(0.8)
}

function resetAllActionWeights(pNo) {
	participants[pNo]["allActions"].forEach(function(a) {
		a.reset();
		a.setEffectiveWeight(0);
	});
	return;
}

function getActionFromName(actionName, pNo) {
	let action_ = participants[pNo]["allActions"].find((obj) => {
		return obj._clip.name === actionName;
	});
	return action_;
}

function setWeight(action, startTime, weight, timeScale) {
	action.enabled = true;
	//if(timeScale === -1) {
	//action.time = action.getClip().duration;
	//console.log('duration:', action.time)
	//} else {
	//action.setWeight = startTime;
	//}
	action.setEffectiveTimeScale(timeScale);
	action.setEffectiveWeight(weight);
}

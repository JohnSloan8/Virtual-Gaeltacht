const baseActions = {
	//idle: { weight: 1 },
};
const additiveActions = {
	neutral_arm_pose: { weight: 1 },
	right_hand_up_pose: { weight: 0 },
	thinking_pose: { weight: 0 },
	face_palm_pose: { weight: 0 },
	x_pose: { weight: 0 },
	dunno_pose: { weight: 0 },
};

export {
	baseActions,
	additiveActions,
}

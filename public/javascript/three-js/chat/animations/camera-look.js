import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { c } from '../../../setup/chat/init.js'

const cameraLookAt = (toWhom, duration) => {
  try {
    c.participantList.forEach(function(p) {
      c.p[p].model.traverse(function(object) {
        if (object.isMesh) {
          if (object.name !== "Wolf3D_Glasses") {
            if (p !== toWhom) {
              object.material.color = {
                r: 0.667,
                g: 0.667,
                b: 0.667,
                isColor: true
              }
            } else {
              object.material.color = {
                r: 1.33,
                g: 1.33,
                b: 1.33,
                isColor: true
              }
            }
          }
        }
      });
    })
  } catch {
    console.log('model not available')
  }
	if (duration === 1) {
    let cM = c.cameras.main.rotations[toWhom]
    c.cameras.main.camera.rotation.set(cM.x, cM.y, cM.z)
  } else {
    let cameraTweenRotation = new TWEEN.Tween(c.cameras.main.camera.rotation).to(c.cameras.main.rotations[toWhom], duration)
    .easing(TWEEN.Easing.Quintic.Out)
    cameraTweenRotation.start()
  }
}

export { cameraLookAt }

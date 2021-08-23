import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { c } from '../../../setup/chat/init.js'

let headMeshes = ['eyeLeft', 'eyeRight', 'Wolf3D_Head', 'Wolf3D_Teeth', 'Wolf3D_Hair', 'Wolf3D_Beard', 'Wolf3D_Glasses', 'Wolf3D_Headwear']
let bodyMeshes = ['Wolf3D_Body', 'Wolf3D_Outfit_Top', 'Wolf3D_Outfit_Bottom_', 'Wolf3D_Outfit_Footwear','Wolf3D_Outfit_Body']
const cameraLookAt = (toWhom, duration, body) => {
  try {
    c.participantList.forEach(function(p) {
      c.p[p].model.traverse(function(object) {
        if (object.isMesh) {
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
            if (body) {
              bodyMeshes.forEach(function(bM) {
                if (object.name === bM) {
                  object.material.color = {
                    r: 1.33,
                    g: 1.33,
                    b: 1.33,
                    isColor: true
                  }
                }
              })
            } else {
              bodyMeshes.forEach(function(hM) {
                if (object.name === hM) {
                  object.material.color = {
                    r: 1.00,
                    g: 1.00,
                    b: 1.00,
                    isColor: true
                  }
                }
              })
            }
          }
        }
      });
    })
  } catch {
    console.log('model not available')
  }
  if (body) {
    toWhom += '_body'
  }
  console.log('toWhom:', toWhom)
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

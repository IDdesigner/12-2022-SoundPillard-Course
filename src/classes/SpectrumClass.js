import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

import spectrumFrag from '../shaders/spectrum.frag'
import spectrumVert from '../shaders/spectrum.vert'
import { TextureLoader } from 'three'

import MyGUI from '../utils/MyGUI'

import LoadingController from './LoadingController'

class SpectrumClass {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.textureLoader = new TextureLoader(LoadingController)
    }

    init(scene) {
        this.scene = scene

        this.uniforms = {
            uMatCap: {
                value: this.textureLoader.load('assets/textures/black_metal.png')
            },
            uSpecterSize: {
                value: 0.4
            },
            uTime: {
                value: 0
            },
            uWaveBorder: {
                value: .2
            },
            uWaveSpeed: {
                value: 0.1
            },
            uBorderColor: {
                value: new THREE.Color("hsl(287,80%,80%)")
            }
        }

        const shaderFolder = MyGUI.addFolder('Spectrum Folder')
        shaderFolder.open()
        shaderFolder.add(this.uniforms.uSpecterSize, "value", -1, 1).name("Specter Size")
        shaderFolder.add(this.uniforms.uWaveBorder, "value", 0, 1).name("Wave Border")
        shaderFolder.add(this.uniforms.uWaveSpeed, "value", 0, 1).name("Wave Speed")

        this.shaderMat = new THREE.ShaderMaterial({
            fragmentShader: spectrumFrag,
            vertexShader: spectrumVert,
            uniforms: this.uniforms,
            transparent: true
        })

        this.modelLoader.load('./assets/models/spectrum.glb', (glb) => {
            glb.scene.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.material = this.shaderMat
                    child.scale.multiplyScalar(2.5)
                    child.position.y = -2.5
                }
            })
            // console.log(glb)
            this.scene.add(glb.scene)
        })
    }

    update() {
        this.uniforms.uTime.value += 1;
    }

    bind() {

    }
}

const _instance = new SpectrumClass()
export default _instance
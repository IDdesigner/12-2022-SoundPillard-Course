import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/RAF'
import config from '../utils/config'
import MyGUI from '../utils/MyGUI'

import SpherePillards from './SpherePillardsClass'
import Floor from './FloorClass'
import Spectrum from './SpectrumClass'
import ParticleSystem from './ParticleSystem'
import CamParallax from './CamParallax'

// import simpleFrag from '../shaders/simple.frag'
// import simpleVert from '../shaders/simple.vert'

class MainThreeScene {
    constructor() {
        this.bind()
        this.camera
        this.scene
        this.renderer
        this.controls
    }

    init(container) {
        //RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        container.appendChild(this.renderer.domElement)

        //MAIN SCENE INSTANCE
        const color = new THREE.Color(0x151515);
        const fog = new THREE.Fog(color, 15, 25);
        this.scene = new THREE.Scene();
        this.scene.fog = fog;
        this.scene.background = color;

        //CAMERA AND ORBIT CONTROLLER
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 10)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = false
        this.controls.maxDistance = 30
        this.controls.minDistance = 10
        this.controls.minPolarAngle = 0
        this.controls.maxPolarAngle = Math.PI / 2 + .5
        CamParallax.init(this.scene)

        //DUMMY CUBE + SIMPLE GLSL SHADER LINKAGE
        // const shaderMat = new THREE.ShaderMaterial({
        //     vertexShader: simpleVert,
        //     fragmentShader: simpleFrag,
        // })
        // const cube = new THREE.Mesh(new THREE.BoxGeometry(), shaderMat)
        // this.scene.add(cube)

        SpherePillards.init(this.scene)
        Floor.init(this.scene)
        Spectrum.init(this.scene)
        ParticleSystem.init(this.scene)
        CamParallax.init(this.scene)

        MyGUI.hide()
        if (config.myGui)
            MyGUI.show()

        const camFolder = MyGUI.addFolder("Camera Folder")
        camFolder.open()
        camFolder.add(this.controls, "enabled").onChange(() => {
            if(this.controls.enabled) {
                CamParallax.active = false;
            }
        }).listen().name("Orbit Control")
        camFolder.add(CamParallax, "active").onChange(() => {
            if(CamParallax.active) {
                this.controls.enabled = false;
            }
        }).listen().name("Camera Parallax")

        camFolder.add(CamParallax.params, "intensity", 0.001, 0.01).name("Camear Parallax Intensity")
        camFolder.add(CamParallax.params, "ease", 0.01, 0.1).name("Camera Parallax Ease")

        //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
        window.addEventListener("resize", this.resizeCanvas)
        RAF.subscribe('threeSceneUpdate', this.update)
    }

    update() {
        this.renderer.render(this.scene, this.camera);
        this.scene.rotateY(0.001);
        SpherePillards.update();
        Spectrum.update();
        ParticleSystem.update();
        CamParallax.update();
    }

    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new MainThreeScene()
export default _instance
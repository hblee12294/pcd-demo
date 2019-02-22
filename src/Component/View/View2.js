import React, { Component } from 'react'
import './View.css'

/* THREE Libs */
import 'three/examples/js/loaders/PCDLoader'
import 'three/examples/js/controls/OrbitControls'

/* TEST DATA */
// import data from './data/test.pcd'
// import data from './data/Zaghetto.pcd'
// import data from './data/pcd_tiny/pcds/15474569195.pcd'
// import data from './data/pointcloud.pcd'
// import data from './data/pcd_new/1548920189844127.pcd'
import data from './data/pcd_new/1548920192048413.pcd'

class View extends Component {
  constructor(props) {
    super(props)

    this.container
    this.canvas
    this.scene
    this.camera
    this.renderer
    this.controls
  }

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    this.container.removeChild(this.canvas)
  }

  init = () => {
    this.createCanvas()
    this.bindEventListeners()
    this.buildScene()
    this.buildCamera()
    this.buildRenderer()
    this.buildSubject()
    this.buildHelpers()
    this.buildControls()

    requestAnimationFrame(this.animate)
  }

  createCanvas = () => {
    this.canvas = document.createElement('canvas')
    this.container.append(this.canvas)
  }

  bindEventListeners = () => {
    window.onresize = this.onWindowResize
    window.setTimeout(this.onWindowResize, 0) // Hack here, to be figured out
  }

  onWindowResize = () => {
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'

    let canvasWidth = this.canvas.offsetWidth
    let canvasHeight = this.canvas.offsetHeight

    this.canvas.width = canvasWidth
    this.canvas.height = canvasHeight

    this.camera.aspect = canvasWidth / canvasHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(canvasWidth, canvasHeight)
  }

  buildScene = () => {
    this.scene = new THREE.Scene()
  }

  buildCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.width / this.canvas.height,
      0.01,
      1000
    )
    this.camera.position.z = 100
  }

  buildRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(this.canvasWidth, this.canvasHeight)
  }

  buildSubject = () => {
    let loader = new THREE.PCDLoader()
    loader.load(
      data,
      mesh => {
        this.scene.add(mesh)
      },
      xhr => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      // called when loading has errors
      error => {
        console.log(error)
      }
    )
  }

  buildHelpers = () => {
    this.scene.add(new THREE.GridHelper())
    this.scene.add(new THREE.AxesHelper(2))
  }

  buildControls = () => {
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    )

    this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 0
    this.controls.maxDistance = 500
  }

  animate = () => {
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate)
  }

  render() {
    return (
      <div className="view">
        <div
          className="main-view"
          ref={container => {
            this.container = container
          }}
        />
      </div>
    )
  }
}

export default View

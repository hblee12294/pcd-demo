import React, { Component } from 'react'

import 'three/examples/js/loaders/PCDLoader'
import 'three/examples/js/controls/OrbitControls'
import './View.css'
// import data from './data/test.pcd'
// import data from './data/Zaghetto.pcd'
import data from './data/pcd_tiny/pcds/15474569199.pcd'

class View extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewHeight: null,
      viewWidth: null
    }
    this.mount
    this.scene
    this.camera
    this.renderer
    this.controls
    this.frameId
  }

  componentDidMount() {
    this.width = this.mount.clientWidth
    this.height = this.mount.clientHeight
    console.log({
      width: this.mount.clientWidth,
      height: this.mount.clientHeight
    })

    this.init()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId)
    this.mount.removeChild(this.renderer.domElement)
  }

  init = () => {
    this.buildScene()
    this.buildCamera()
    this.buildRenderer()
    this.buildSubject()
    this.buildHelpers()
    this.buildControls()

    this.frameId = requestAnimationFrame(this.animate)
  }

  createCanvas = () => {
    const canvasEl = document.createElement('canvas')
    return canvasEl
  }

  buildScene = () => {
    this.scene = new THREE.Scene()
  }

  buildCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      0.01,
      400
    )
    this.camera.position.z = 4
  }

  buildRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(this.width, this.height)
    this.mount.appendChild(this.renderer.domElement)
  }

  buildSubject = () => {
    let loader = new THREE.PCDLoader()
    loader.load(data, mesh => {
      console.log(mesh)
      this.scene.add(mesh)
    })
  }

  buildHelpers = () => {
    const gridHelper = new THREE.GridHelper()
    this.scene.add(gridHelper)

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
    this.renderScene()
    requestAnimationFrame(this.animate)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div className="view">
        <div
          className="main-view"
          style={{ width: '100vw', height: '100vh' }}
          ref={mount => {
            this.mount = mount
          }}
        />
        <div className="side-views">
          <div className="primary-view" />
          <div className="secondary-view" />
        </div>
      </div>
    )
  }
}

export default View

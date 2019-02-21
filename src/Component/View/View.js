import React, { Component } from 'react'

import 'three/examples/js/loaders/PCDLoader'
import './View.css'
import data from './data/Zaghetto.pcd'

class View extends Component {
  constructor(props) {
    super(props)

    this.mount
    this.scene
    this.camera
    this.renderer
  }

  componentDidMount() {
    this.width = this.mount.clientWidth
    this.height = this.mount.clientHeight

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

    requestAnimationFrame(this.animate)
  }

  buildScene = () => {
    this.scene = new THREE.Scene()
  }

  buildCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      15,
      this.width / this.height,
      0.01,
      40
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

  animate = () => {
    this.renderScene()
    requestAnimationFrame(this.animate)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div
        style={{ width: '100vw', height: '100vh' }}
        ref={mount => {
          this.mount = mount
        }}
      />
    )
  }
}

export default View

import React, { Component } from 'react'
import './MultipleCanvases.css'

import 'three/examples/js/controls/OrbitControls'

const TOP = 0
const SIDE = 1
const REAR = 2

class MultipleCanvases2 extends Component {
  constructor(props) {
    super(props)

    this.scene, this.renderer
    this.views = [
      {
        name: 'top',
        container: null,
        canvas: null,
        camera: null,
        context: null,
        width: 0,
        height: 0,
        eye: [0, 300, 1800],
        up: [0, 1, 0],
        fov: 30,
        control: true,
        render: () => {}
      },
      {
        name: 'side',
        container: null,
        canvas: null,
        camera: null,
        context: null,
        width: 0,
        height: 0,
        eye: [2000, 300, 0],
        up: [0, 1, 0],
        fov: 30,
        render: () => {}
      },
      {
        name: 'rear',
        container: null,
        canvas: null,
        camera: null,
        context: null,
        width: 0,
        height: 0,
        eye: [0, 1800, 0],
        up: [0, 1, 0],
        fov: 30,
        render: () => {}
      }
    ]
  }

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    this.views.forEach(view => {
      view.container.removeChild(view.canvas)
    })
  }

  init = () => {
    this.createCanvases()
    this.createRenderer()
    this.createScene()
    this.createLight()
    this.createSubjects()
    this.createShadow()

    setTimeout(this.onWindowResize, 0)
    setTimeout(this.createViews, 0)
    setTimeout(this.animate, 0)
  }

  createCanvases = () => {
    this.views.forEach(view => {
      view.canvas = document.createElement('canvas')

      view.container.append(view.canvas)
    })

    this.bindEventListeners()
  }

  bindEventListeners = () => {
    window.onresize = this.onWindowResize
  }

  onWindowResize = () => {
    this.views.forEach(view => {
      const canvas = view.canvas

      canvas.style.width = '100%'
      canvas.style.height = '100%'

      view.width = canvas.clientWidth
      view.height = canvas.clientHeight
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
    })
  }

  createRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
  }

  createScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)
  }

  createLight() {
    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(0, 0, 1)
    this.scene.add(light)
  }

  createSubjects = () => {
    const radius = 200

    const geometry1 = new THREE.IcosahedronBufferGeometry(radius, 1)
    const count = geometry1.attributes.position.count
    geometry1.addAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    )

    const geometry2 = geometry1.clone()
    const geometry3 = geometry1.clone()

    const color = new THREE.Color()
    const positions1 = geometry1.attributes.position
    const positions2 = geometry2.attributes.position
    const positions3 = geometry3.attributes.position
    const colors1 = geometry1.attributes.color
    const colors2 = geometry2.attributes.color
    const colors3 = geometry3.attributes.color

    for (let i = 0; i < count; i++) {
      color.setHSL((positions1.getY(i) / radius + 1) / 2, 1.0, 0.5)
      colors1.setXYZ(i, color.r, color.g, color.b)
      color.setHSL(0, (positions2.getY(i) / radius + 1) / 2, 0.5)
      colors2.setXYZ(i, color.r, color.g, color.b)
      color.setRGB(1, 0.8 - (positions3.getY(i) / radius + 1) / 2, 0)
      colors3.setXYZ(i, color.r, color.g, color.b)
    }

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      vertexColors: THREE.VertexColors,
      shininess: 0
    })

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true
    })

    let mesh = new THREE.Mesh(geometry1, material)
    let wireframe = new THREE.Mesh(geometry1, wireframeMaterial)
    mesh.add(wireframe)
    mesh.position.x = -400
    mesh.rotation.x = -1.87
    this.scene.add(mesh)
    mesh = new THREE.Mesh(geometry2, material)
    wireframe = new THREE.Mesh(geometry2, wireframeMaterial)
    mesh.add(wireframe)
    mesh.position.x = 400
    this.scene.add(mesh)
    mesh = new THREE.Mesh(geometry3, material)
    wireframe = new THREE.Mesh(geometry3, wireframeMaterial)
    mesh.add(wireframe)
    this.scene.add(mesh)
  }

  createShadow = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128

    const context = canvas.getContext('2d')
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    )
    gradient.addColorStop(0.1, 'rgba(0,0,0,0.15)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    const shadowTexture = new THREE.CanvasTexture(canvas)
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true
    })
    const shadowGeo = new THREE.PlaneBufferGeometry(300, 300, 1, 1)

    let shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial)
    shadowMesh.position.y = -250
    shadowMesh.rotation.x = -Math.PI / 2
    this.scene.add(shadowMesh)

    shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial)
    shadowMesh.position.x = -400
    shadowMesh.position.y = -250
    shadowMesh.rotation.x = -Math.PI / 2
    this.scene.add(shadowMesh)

    shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial)
    shadowMesh.position.x = 400
    shadowMesh.position.y = -250
    shadowMesh.rotation.x = -Math.PI / 2
    this.scene.add(shadowMesh)
  }

  createViews = () => {
    this.views.forEach(view => {
      const camera = new THREE.PerspectiveCamera(
        view.fov,
        view.width / view.height,
        0.1,
        10000
      )
      camera.position.fromArray(view.eye)
      camera.up.fromArray(view.up)

      view.camera = camera
      view.context = view.canvas.getContext('2d')

      if (view.control) {
        this.addControl(view)
      }

      view.render = () => {
        camera.lookAt(this.scene.position)
        camera.aspect = view.width / view.height
        camera.updateProjectionMatrix()

        this.renderer.setSize(view.width, view.height)
        this.renderer.render(this.scene, view.camera)

        view.context.drawImage(this.renderer.domElement, 0, 0)
      }
    })
  }

  addControl(view) {
    this.controls = new THREE.OrbitControls(
      view.camera,
      view.canvas
    )

    // this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    // this.controls.dampingFactor = 0.25
    this.controls.screenSpacePanning = true
    // this.controls.minDistance = 0
    // this.controls.maxDistance = 500
  }

  animate = () => {
    this.views.forEach(view => {
      view.render()
    })

    requestAnimationFrame(this.animate)
  }

  render() {
    return (
      <div className="view">
        <div
          className="top-view"
          ref={container => (this.views[TOP].container = container)}
        >
          {/* <canvas
            // style={{ width: '100%', height: '100%' }}
            ref={canvas => (this.views[TOP].canvas = canvas)}
          /> */}
        </div>
        <div
          className="side-view"
          ref={container => (this.views[SIDE].container = container)}
        >
          {/* <canvas
            // style={{ width: '100%', height: '100%' }}
            ref={canvas => (this.views[SIDE].canvas = canvas)}
          /> */}
        </div>
        <div
          className="rear-view"
          ref={container => (this.views[REAR].container = container)}
        >
          {/* <canvas
            // style={{ width: '100%', height: '100%' }}
            ref={canvas => (this.views[REAR].canvas = canvas)}
          /> */}
        </div>
      </div>
    )
  }
}

export default MultipleCanvases2

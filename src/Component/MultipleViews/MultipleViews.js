import React, { Component } from 'react'

import '../View/View.css'

class MultipleViews extends Component {
  constructor(props) {
    super(props)

    this.container
    this.canvas
    this.scene
    this.camera
    this.renderer
    this.controls
    ;(this.mouseX = 0), (this.mouseY = 0)

    this.views = [
      {
        left: 0,
        top: 0,
        width: 0.5,
        height: 1.0,
        background: new THREE.Color(0.5, 0.5, 0.7),
        eye: [0, 300, 1800],
        up: [0, 1, 0],
        fov: 30,
        updateCamera: (camera, scene, mouseX) => {
          camera.position.x += mouseX * 0.05
          camera.position.x = Math.max(Math.min(camera.position.x, 2000), -2000)
          camera.lookAt(scene.position)
        }
      },
      {
        left: 0.5,
        top: 0.5,
        width: 0.5,
        height: 0.5,
        background: new THREE.Color(0.7, 0.5, 0.5),
        eye: [0, 1800, 0],
        up: [0, 0, 1],
        fov: 90,
        updateCamera: (camera, scene, mouseX) => {
          camera.position.x -= mouseX * 0.05
          camera.position.x = Math.max(Math.min(camera.position.x, 2000), -2000)
          camera.lookAt(camera.position.clone().setY(0))
        }
      },
      {
        left: 0.5,
        top: 0,
        width: 0.5,
        height: 0.5,
        background: new THREE.Color(0.5, 0.7, 0.7),
        eye: [1400, 800, 1400],
        up: [0, 1, 0],
        fov: 30,
        updateCamera: function(camera, scene, mouseX) {
          camera.position.y -= mouseX * 0.05
          camera.position.y = Math.max(Math.min(camera.position.y, 1600), -1600)
          camera.lookAt(scene.position)
        }
      }
    ]
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
    this.buildLight()
    this.buildRenderer()
    this.buildSubject()
    // this.buildHelpers()
    this.buildShadow()

    requestAnimationFrame(this.animate)
  }

  createCanvas = () => {
    this.canvas = document.createElement('canvas')
    this.container.append(this.canvas)
  }

  bindEventListeners = () => {
    window.onresize = this.onWindowResize
    window.onmousemove = this.onDocumentMouseMove
    window.setTimeout(this.onWindowResize, 0)
  }

  onWindowResize = () => {
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'

    let canvasWidth = this.canvas.offsetWidth
    let canvasHeight = this.canvas.offsetHeight

    this.canvas.width = canvasWidth
    this.canvas.height = canvasHeight

    // this.camera.aspect = canvasWidth / canvasHeight
    // this.camera.updateProjectionMatrix()

    this.renderer.setSize(canvasWidth, canvasHeight)
  }

  onDocumentMouseMove = event => {
    this.mouseX = event.clientX - this.canvas.width / 2
    this.mouseY = event.clientY - this.canvas.height / 2
  }

  buildScene = () => {
    this.scene = new THREE.Scene()
  }

  buildCamera = () => {
    this.views.map(view => {
      const camera = new THREE.PerspectiveCamera(
        view.fov,
        this.canvas.width / this.canvas.height,
        0.1,
        10000
      )
      camera.position.fromArray(view.eye)
      camera.up.fromArray(view.up)
      view.camera = camera
    })
  }

  buildRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize(this.canvas.width, this.canvas.height)
  }

  buildLight = () => {
    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(0, 0, 1)
    this.scene.add(light)
  }

  buildSubject = () => {
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

  buildHelpers = () => {
    this.scene.add(new THREE.GridHelper())
    this.scene.add(new THREE.AxesHelper(2))
  }

  animate = () => {
    this.views.map(view => {
      const camera = view.camera
      view.updateCamera(camera, this.scene, this.mouseX, this.mouseY)
      const left = Math.floor(this.canvas.clientWidth * view.left)
      const top = Math.floor(this.canvas.clientHeight * view.top)
      const width = Math.floor(this.canvas.clientWidth * view.width)
      const height = Math.floor(this.canvas.clientHeight * view.height)

      this.renderer.setViewport(left, top, width, height)
      this.renderer.setScissor(left, top, width, height)
      this.renderer.setScissorTest(true)
      this.renderer.setClearColor(view.background)

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      this.renderer.render(this.scene, camera)
    })

    requestAnimationFrame(this.animate)
  }

  buildShadow = () => {
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

export default MultipleViews

import React, { Component } from 'react'
import './MultipleCanvases.css'

const TOP = 0
const SIDE = 1
const REAR = 2

class MultipleCanvases extends Component {
  constructor(props) {
    super(props)

    this.scene
    this.renderer
    this.views = [
      {
        name: 'top',
        container: null,
        canvas: null,
        camera: null,
        context: null,
        eye: [0, 300, 1800],
        up: [0, 1, 0],
        fov: 30,
        render: () => {}
      },
      {
        name: 'side',
        container: null,
        canvas: null,
        camera: null,
        context: null,
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
    this.createScene()
    this.createLight()
    this.createSubjects()
    this.createShadow()
    this.createRenderer()
    this.createViews()

    this.animate()
  }

  createCanvases = () => {
    this.views.forEach(view => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      view.container.append(canvas)
      view.canvas = canvas
      view.context = context
    })

    this.bindEventListeners()
  }

  bindEventListeners = () => {
    window.onresize = this.onWindowResize
    window.setTimeout(this.onWindowResize, 0)
  }

  onWindowResize = () => {
    this.views.forEach(view => {
      const canvas = view.canvas

      canvas.style.width = '100%'
      canvas.style.height = '100%'

      console.log(
        'width: ' + canvas.clientWidth + ' height: ' + canvas.clientHeight
      )

      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    })
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
  createShadow() {
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

  createRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // this.renderer.setSize(canvas.width, canvas.height)
  }

  createViews = () => {
    this.views.forEach(view => {
      const camera = new THREE.PerspectiveCamera(
        view.fov,
        view.canvas.width / view.canvas.height,
        0.1,
        10000
      )
      camera.position.fromArray(view.eye)
      camera.up.fromArray(view.up)

      view.camera = camera

      view.render = () => {
        camera.lookAt(this.scene.position)
        // console.log(view.canvas.clientWidth)

        // this.renderer.setSize(view.canvas.clinetWidth, view.canvas.clientHeight)
        this.renderer.render(this.scene, view.camera)

        view.context.drawImage(this.renderer.domElement, 0, 0)
      }
    })
  }

  // createViews() {
  //   console.log('createViews')
  //   console.log(this.views)

  //   this.viewsProps.forEach(props => {
  //     this.views.push(new View(this.renderer, this.scene, props))
  //   })
  // }

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
          ref={container => {
            this.views[TOP].container = container
          }}
        />
        <div
          className="side-view"
          ref={container => {
            this.views[SIDE].container = container
          }}
        />
        <div
          className="rear-view"
          ref={container => {
            this.views[REAR].container = container
          }}
        />
      </div>
    )
  }
}

export default MultipleCanvases

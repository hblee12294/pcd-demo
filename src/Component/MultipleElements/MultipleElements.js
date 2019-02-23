import React, { Component } from 'react'
import './MultipleElements.css'

import 'three/examples/js/controls/OrbitControls'

const geometries = [
  new THREE.BoxBufferGeometry(1, 1, 1),
  new THREE.SphereBufferGeometry(0.5, 12, 8),
  new THREE.DodecahedronBufferGeometry(0.5),
  new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 12)
]

const NUM = 4

class MultipleElements extends Component {
  constructor(props) {
    super(props)

    this.container
    this.content
    this.canvas
    this.scenes = []
    this.renderer
    this.listRefs = []
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
    // this.buildScenes()
    this.buildRenderer()

    requestAnimationFrame(this.animate)
  }

  createCanvas = () => {
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'canvas'
    this.container.append(this.canvas)
  }

  bindEventListeners() {
    window.onresize = this.onWindowResize
    window.setTimeout(this.onWindowResize, 0)
  }

  onWindowResize = () => {
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'

    let canvasWidth = this.canvas.offsetWidth
    let canvasHeight = this.canvas.offsetHeight

    this.canvas.width = canvasWidth
    this.canvas.height = canvasHeight

    this.renderer.setSize(canvasWidth, canvasHeight)
  }

  buildScenes = () => {
    for (let i = 0; i < NUM; ++i) {
      const scene = new THREE.Scene()

      const camera = new THREE.PerspectiveCamera(50, 1, 1, 10)
      camera.position.z = 2
      scene.userData.camera = camera

      scene.userData.element = this.listRefs[i].querySelector('.scene')

      console.log(scene)

      const controls = new THREE.OrbitControls(
        scene.userData.camera,
        scene.userData.element
      )
      controls.minDistance = 2
      controls.maxDistance = 5
      controls.enablePan = false
      controls.enableZoom = false
      scene.userData.controls = controls

      const geometry = geometries[(geometries.length * Math.random()) | 0]
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random(), 1, 0.75),
        roughness: 0.5,
        metalness: 0,
        flatShading: true
      })

      scene.add(new THREE.Mesh(geometry, material))
      scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444))

      const light = new THREE.DirectionalLight(0xffffff, 0.5)
      light.position.set(1, 1, 1)
      scene.add(light)

      this.scenes.push(scene)
    }
  }

  buildRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
  }

  animate = () => {
    this.canvas.style.transform = `translateY(${window.scrollY}px)`

    this.renderer.setClearColor(0xffffff)
    this.renderer.setScissorTest(false)
    this.renderer.clear()

    this.renderer.setClearColor(0xe0e0e0)
    this.renderer.setScissorTest(true)

    this.scenes.forEach(scene => {
      // scene.children[0].rotation.y = Date.now() * 0.001

      const element = scene.userData.element
      const rect = element.getBoundingClientRect()
      if (
        rect.bottom < 0 ||
        rect.top > this.canvas.clientHeight ||
        rect.right < 0 ||
        rect.left > this.renderer.clientWidth
      ) {
        return
      }

      const width = rect.right - rect.left
      const height = rect.bottom - rect.top
      const left = rect.left
      const top = rect.top

      this.renderer.setViewport(left, top, width, height)
      this.renderer.setScissor(left, top, width, height)

      const camera = scene.userData.camera
      this.renderer.render(scene, camera)

      requestAnimationFrame(this.animate)
    })
  }

  render() {
    console.log('from render')
    const list = []
    for (let i = 0; i < NUM; ++i) {
      list.push(
        <div className="list-item" key={i} ref={el => this.listRefs.push(el)}>
          <div className="scene" />
          <div className="description">{`scene ${i + 1}`}</div>
        </div>
      )
    }

    return (
      <div
        className="view"
        ref={container => {
          this.container = container
        }}
      >
        <div
          className="content"
          ref={el => {
            this.content = el
          }}
        >
          {list}
        </div>
      </div>
    )
  }
}

export default MultipleElements

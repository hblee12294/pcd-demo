import SceneManager from './SceneManager'

export default container => {
  const canvas = createCanvas(document, container)
  const sceneManager = new SceneManager(canvas)

  let canvasHalfWidth
  let canvasHalfHeight

  bindEventListeners()
  resizeCanvas()
  render()

  function createCanvas(document, container) {
    const canvasEl = document.createElement('canvas')
    container.appendChild(canvasEl)
    return canvasEl
  }

  function bindEventListeners() {
    window.onresize = resizeCanvas
    window.onmouseover = mouseMove
    resizeCanvas()
  }

  function resizeCanvas() {
    canvas.style.width = '100%'
    canvas.style.height = '100%'

    console.log(canvas.offsetWidth)
    console.log(canvas.offsetHeight)

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    canvasHalfWidth = Math.round(canvas.offsetWidth / 2)
    canvasHalfHeight = Math.round(canvas.offsetHeight / 2)

    sceneManager.onWindowResize()
  }

  function mouseMove(position) {
    console.log(position)
  }

  function render() {
    requestAnimationFrame(render)
    sceneManager.update()
  }
}

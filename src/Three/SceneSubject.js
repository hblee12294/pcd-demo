export default scene => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
  const cube = new THREE.Mesh(geometry, material)

  scene.add(cube)

  function update() {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }

  return {
    update
  }
}

import React, { Component } from 'react'

import ThreeEntryPoint from '../../Three/ThreeEntryPoint'
import './View.css'

class View extends Component {
  componentDidMount() {
    ThreeEntryPoint(this.threeRootElement)
  }

  render() {
    return <div className="view" ref={element => (this.threeRootElement = element)} />
  }
}

export default View

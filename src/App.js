import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

// import View from './Component/View/View2'
// import View from './Component/MultipleViews/MultipleViews'
// import View from './Component/MultipleElements/MultipleElements'
// import View from './Component/MultipleCanvases/MultipleCanvases'
import View from './Component/MultipleCanvases/MultipleCanvases2'

class App extends Component {
  render() {
    return (
      <div className="App">
        <View />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }
}

export default App

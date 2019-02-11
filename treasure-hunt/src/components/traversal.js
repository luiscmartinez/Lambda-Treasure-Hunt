import React, { Component } from 'react'
import config from '../secrets'

// const config = {
//   headers: { Authorization: config.myToken }
// }
export default class Traversal extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return <h1>{config.myToken}</h1>
  }
}

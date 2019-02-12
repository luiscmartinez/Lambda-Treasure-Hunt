import React, { Component } from 'react'
import axios from 'axios'
import config from '../secrets'

axios.defaults.headers.common['Authorization'] = config.token
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default class Traversal extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    const headers = { headers: { Authorization: config.token } }
    axios
      .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/')
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error.response.data)
      })
  }

  render () {
    return <h1>hello</h1>
  }
}

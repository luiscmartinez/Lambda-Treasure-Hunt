import React, { Component } from 'react'
import axios from 'axios'
import config from '../secrets'

axios.defaults.headers.common['Authorization'] = config.token
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default class Traversal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      coordinates: {},
      graph: {},
      room_id: 0,
      cooldown: 0
    }
  }

  componentDidMount () {
    if (localStorage.hasOwnProperty('graph')) {
      const graph = JSON.parse(localStorage.getItem('graph'))
      this.setState({ graph })
    }
    axios
      .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/')
      .then((res) => {
        console.log(res.data)
        const { room_id, coordinates, exits, cooldown } = res.data
        this.setState({ room_id, cooldown })
        const prev_room_id = this.state.room_id
        console.log(this.state.room_id)
        const graph = this.updateGraph(
          room_id,
          this.parseCoordinates(coordinates),
          exits,
          prev_room_id
        )
        this.setState({ graph })
      })
      .catch((error) => {
        console.error(error.response.data)
      })
  }

  handleMovement = (move) => {
    axios
      .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/move/', {
        direction: move
      })
      .then((res) => {
        const { room_id, coordinates, exits, cooldown } = res.data
        const prev_room_id = this.state.room_id
        const graph = this.updateGraph(
          room_id,
          this.parseCoordinates(coordinates),
          exits,
          prev_room_id,
          move
        )
        this.setState({
          room_id,
          coordinates: this.parseCoordinates(coordinates),
          cooldown,
          graph
        })
        console.log(this.state.graph)
        console.log(res.data)
      })
      .catch((err) => console.error(err))
  }

  updateGraph = (id, coordinates, exits, prev_room_id = null, move = null) => {
    let graph = Object.assign({}, this.state.graph)
    if (!this.state.graph[id]) {
      const payload = {}
      payload['coordinates'] = coordinates
      const moves = {}
      for (let exit of exits) {
        moves[exit] = '?'
      }
      payload['exits'] = moves
      graph = { ...graph, [id]: payload }
    }
    if (prev_room_id && move) {
      console.log(graph[prev_room_id]['exits'][move])
      const inverseDirection = this.get_inverseDirection(move)
      graph[prev_room_id]['exits'][move] = id
      graph[id]['exits'][inverseDirection] = prev_room_id
    }
    localStorage.setItem('graph', JSON.stringify(graph))
    return graph
  }
  get_inverseDirection = (move) => {
    const inverseDir = { n: 's', s: 'n', w: 'e', e: 'w' }
    return inverseDir[move]
  }
  parseCoordinates = (coordinates) => {
    const x = coordinates.replace(/[%^()]/g, '').split(',')[0]
    const y = coordinates.replace(/[%^()]/g, '').split(',')[1]
    const coordsObject = { x, y }
    return coordsObject
  }

  render () {
    return (
      <div>
        <h1>hello</h1>
        <h2 onClick={() => this.handleMovement('s')}>south</h2>
        <h2 onClick={() => this.handleMovement('n')}>north</h2>
        <h2 onClick={() => this.handleMovement('w')}>west</h2>
        <h2 onClick={() => this.handleMovement('e')}>east</h2>

        <button>AutoTraverse!</button>
      </div>
    )
  }
}

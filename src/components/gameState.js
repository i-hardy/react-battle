import React, { Component } from 'react'
import PlayerForm from './playerForm'
import PlayerDisplay from './playerDisplay'
import { Game } from '../logic/game'
import { Player } from '../logic/player'
import { Attack } from '../logic/attack'
import { AttackButton, RestartButton, PoisonButton } from './buttons'

class GameState extends Component {
  constructor (props) {
    super(props)
    this.handleStartClick = this.handleStartClick.bind(this)
    this.handleAttackClick = this.handleAttackClick.bind(this)
    this.handlePoisonClick = this.handlePoisonClick.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
    this.state = { isRunning: false, game: null }
  }

  handleStartClick (player1name, player2name) {
    this.setState({ isRunning: true,
      game: new Game(new Player(player1name), new Player(player2name))
    })
  }

  handleAttackClick () {
    Attack.run(this.state.game.currentOpponent())
    this.afterAttack()
  }

  handlePoisonClick () {
    if (!this.state.game.currentOpponent().isPoisoned()) {
      Attack.getPoisoned(this.state.game.currentOpponent())
    }
    this.afterAttack()
  }

  handleResetClick () {
    this.setState({ isRunning: false,
      game: null
    })
  }

  handlePoisonedPlayers () {
    var poisonedPlayers = this.state.game.poisonedPlayers()
    poisonedPlayers.forEach((player) => {
      Attack.run(player, 'poison')
      player.getPoisoned()
    })
  }

  afterAttack () {
    this.handlePoisonedPlayers()
    this.state.game.switchTurns()
    this.setState()
  }

  render () {
    const isRunning = this.state.isRunning

    let players = null
    if (!isRunning) {
      players = <section className='main'><PlayerForm onSubmit={this.handleStartClick} /></section>
    } else {
      players = <section className='player-container'>
        <PlayerDisplay player={this.state.game.player1()} />
        <PlayerDisplay player={this.state.game.player2()} />
      </section>
    }

    let gameplay = null
    if (this.state.game) {
      if (this.state.game.isOver()) {
        gameplay = <section className='game-over'>
          <p> GAME OVER!!! {this.state.game.loser().getName()} was defeated! </p>
          <p> <RestartButton onClick={this.handleResetClick} /> </p>
        </section>
      } else {
        gameplay = <section>
          <table>
            <tr>
              <td> {this.state.game.currentTurn().getName()}{"'s turn"}</td>
            </tr>
            <tr>
              <td> <AttackButton onClick={this.handleAttackClick} /> </td>
              <td> <PoisonButton onClick={this.handlePoisonClick} /> </td>
            </tr>
          </table>
        </section>
      }
    }

    return (
      <section className='main'>
        {players}
        <center>
          {gameplay}
        </center>
      </section>
    )
  }
}

export default GameState

import './App.css'
import { useState } from 'react'
import useGameState from './hooks/useGameState'
import { useWallet } from './hooks/useBlockchain'

function App() {
  const gameState = useGameState()
  const wallet = useWallet()

  return (
    <div className="App">
      {gameState.screen === 'menu' && (
        <MenuScreen 
          setScreen={gameState.setScreen} 
          wallet={wallet}
        />
      )}
      {gameState.screen === 'game' && (
        <GameScreen 
          setScreen={gameState.setScreen} 
          score={gameState.score} 
          handleTap={gameState.handleTap} 
        />
      )}
      {gameState.screen === 'leaderboard' && (
        <LeaderboardScreen 
          setScreen={gameState.setScreen} 
          leaderboard={gameState.leaderboard} 
        />
      )}
      {gameState.screen === 'checkin' && (
        <CheckinScreen 
          setScreen={gameState.setScreen} 
          checkins={gameState.checkins}
          multiplier={gameState.multiplier}
          timeLeft={gameState.timeLeft}
          handleCheckin={gameState.handleCheckin}
          formatTime={gameState.formatTime}
        />
      )}
      {gameState.screen === 'wallet' && (
        <WalletScreen 
          setScreen={gameState.setScreen} 
          wallet={wallet}
        />
      )}
    </div>
  )
}

const MenuScreen = ({ setScreen, wallet }) => {
  return (
    <div className="menu-screen">
      <h1>Bunny Tapper</h1>
      <button className="menu-btn" onClick={() => setScreen('leaderboard')}>
        Leaderboard
      </button>
      <button className="menu-btn" onClick={() => setScreen('checkin')}>
        Daily Check-in
      </button>
      <button className="menu-btn" onClick={() => setScreen('wallet')}>
        Wallet Connection
      </button>
      <button className="menu-btn" onClick={() => setScreen('game')}>
        Start Tapping
      </button>
    </div>
  )
}

const GameScreen = ({ setScreen, score, handleTap }) => {
  return (
    <div className="game-screen">
      <div className="score">Score: {score}</div>
      <div className="bunny" onClick={handleTap}>
        🐰
      </div>
      <button className="back-btn" onClick={() => setScreen('menu')}>
        Back to Menu
      </button>
    </div>
  )
}

const LeaderboardScreen = ({ setScreen, leaderboard }) => {
  return (
    <div className="leaderboard-screen">
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map(user => (
          <li key={user.id}>{user.name}: {user.score} points</li>
        ))}
      </ul>
      <button className="back-btn" onClick={() => setScreen('menu')}>
        Back to Menu
      </button>
    </div>
  )
}

const CheckinScreen = ({ setScreen, checkins, multiplier, timeLeft, handleCheckin, formatTime }) => {
  return (
    <div className="checkin-screen">
      <h2>Daily Check-in</h2>
      <p>Check-ins: {checkins} days</p>
      <p>Multiplier: {(multiplier).toFixed(1)}x</p>
      <p>Next check-in in: {formatTime(timeLeft)}</p>
      <button className="checkin-btn" onClick={handleCheckin}>
        Claim Today's Check-in
      </button>
      <button className="back-btn" onClick={() => setScreen('menu')}>
        Back to Menu
      </button>
    </div>
  )
}

const WalletScreen = ({ setScreen, wallet }) => {
  return (
    <div className="wallet-screen">
      <h2>Wallet Connection</h2>
      {wallet.wallet ? (
        <div>
          <p>Connected: {wallet.wallet.address.substring(0, 6)}...{wallet.wallet.address.substring(wallet.wallet.address.length - 4)}</p>
          <p>Balance: {wallet.balance ? wallet.balance.toFixed(4) : '0.0000'} ETH</p>
          <button className="back-btn" onClick={wallet.disconnectWallet}>
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div>
          <p>Not connected</p>
          <button 
            className="menu-btn" 
            onClick={wallet.connectWallet} 
            disabled={wallet.isConnecting}
          >
            {wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      )}
      <button className="back-btn" onClick={() => setScreen('menu')}>
        Back to Menu
      </button>
    </div>
  )
}

export default App

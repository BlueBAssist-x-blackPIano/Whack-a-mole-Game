

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Mole from './Components/Mole';

function App() {
  const [score, setScore] = useState(0);
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [gameActive, setGameActive] = useState(false);
  const [timer, setTimer] = useState(60);
  const gameInterval = useRef(null);
  const timerInterval = useRef(null);

  // Function to handle starting the game
  const startGame = () => {
    if (gameActive) return;
    
    setScore(0);
    setMoles(Array(9).fill(false));
    setTimer(60);
    setGameActive(true);
    
    // Set up the timer countdown
    timerInterval.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(timerInterval.current);
          clearInterval(gameInterval.current);
          setGameActive(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    // Set up the mole appearance interval
    gameInterval.current = setInterval(() => {
      showRandomMole();
    }, 1000);
  };

  // Function to handle resetting/stopping the game
  const resetGame = () => {
    clearInterval(gameInterval.current);
    clearInterval(timerInterval.current);
    setGameActive(false);
    setMoles(Array(9).fill(false));
    setTimer(60);
    setScore(0);
  };

  // Function to show a mole at a random position
  const showRandomMole = () => {
    // Hide all moles first
    const newMoles = Array(9).fill(false);
    
    // Choose a random hole
    const randomIndex = Math.floor(Math.random() * 9);
    newMoles[randomIndex] = true;
    
    setMoles(newMoles);
    
    // Hide the mole after a random time between 0.5 and 1.5 seconds
    setTimeout(() => {
      if (gameActive) {
        setMoles(prevMoles => {
          const updatedMoles = [...prevMoles];
          updatedMoles[randomIndex] = false;
          return updatedMoles;
        });
      }
    }, Math.random() * 1000 + 500);
  };

  // Function to handle whacking a mole
  const whackMole = (index) => {
    if (moles[index] && gameActive) {
      setScore(prevScore => prevScore + 1);
      
      // Hide the mole immediately after whacking
      const newMoles = [...moles];
      newMoles[index] = false;
      setMoles(newMoles);
    }
  };

  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      clearInterval(gameInterval.current);
      clearInterval(timerInterval.current);
    };
  }, []);

  return (
    <div className="game-container">
      <h1>Whack-a-Mole</h1>
      
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {timer}s</div>
      </div>
      
      <div className="controls">
        <button 
          className="start-button" 
          onClick={startGame}
          disabled={gameActive}
        >
          Start Game
        </button>
        <button 
          className="reset-button" 
          onClick={resetGame}
          disabled={!gameActive}
        >
          Stop/Reset
        </button>
      </div>
      
      <div className="game-grid">
        {moles.map((isMoleVisible, index) => (
          <Mole 
            key={index} 
            isVisible={isMoleVisible} 
            onClick={() => whackMole(index)} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;

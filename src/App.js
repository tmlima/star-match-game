import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const NumPadKey = props => (
  <button 
    className="number" 
    style={{backgroundColor: colors[props.status]}}
    onClick={() => props.onClick(props.number)}>
    {props.number}
  </button>
)

const StarsPanel = props => (
  <React.Fragment>
    {utils.range(1, props.stars).map(startId => (
      <div key={startId} className="star"/>
    ))}
  </React.Fragment>
)

const PlayAgain = props => (
  <div className="game-done">
    <button onClick={props.onClick}>Play Again</button>
  </div>
)

const StarMatch = () => {

  const [stars, setStars] = React.useState(utils.random(1,9));

  const numbers = utils.range(1, 9);
  const [availableNumbers, setAvailableNumbers] = React.useState(numbers);
  const [wrongNumbers, setWrongNumbers] = React.useState([]);
  const [candidateNumbers, setCandidateNumbers] = React.useState([]);
  
  const gameIsDone = availableNumbers.length === 0;

  const resetGame = () => {
    setStars(utils.random(1,9));
    setAvailableNumbers(numbers);
    setWrongNumbers([]);
    setCandidateNumbers([]);
  }

  const numberStatus = (number) => {
    if (availableNumbers.includes(number))
      return 'available';
    else if (wrongNumbers.includes(number))
      return 'wrong';
    else if (candidateNumbers.includes(number))
      return 'candidate';
    else
      return 'used';
  }

  const onNumberClick = (number) => {
    if (availableNumbers.includes(number)) {
      const sum = utils.sum(candidateNumbers.concat(number));
      const newAvailableNumbers = availableNumbers.filter(n => n !== number);
      setAvailableNumbers(newAvailableNumbers);
      if (sum === stars) {
        setCandidateNumbers([]);
        setStars(utils.randomSumIn(newAvailableNumbers, 9));
        console.log(number);
      } else {
        if (sum > stars) {
          setWrongNumbers(candidateNumbers.concat(number));
          setCandidateNumbers([]);
        } else {
          setCandidateNumbers(candidateNumbers.concat(number));
        }
      } 
    }
  }

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          { gameIsDone ? (
            <PlayAgain onClick={resetGame}/>
          ) : (
            <StarsPanel stars={stars} />
          )}
        </div>
        <div className="right">
          { numbers.map(number => 
            <NumPadKey 
              key={number} 
              number={number}
              status={numberStatus(number)}
              onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: 10</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default StarMatch;
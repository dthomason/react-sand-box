/* eslint-disable no-bitwise */
/* eslint-disable react/jsx-no-comment-textnodes */
import './App.scss'
import React, { useState } from 'react'
import { Button, makeStyles } from '@material-ui/core';
import { Box } from './box';
import { times } from 'lodash';

const useStyles = makeStyles({
  root: {
    flex: 1,
  },
  boxContainer: {
    marginTop: 75,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    perspective: 1000,
  },
  box: {
    width: 36,
    height: 36,
    display: 'inline-flex',
    position: 'relative',
    margin: 10,
  },
  boxFace: {
    inset: 0,
    zIndex: 1,
    overflow: 'hidden',
    position: 'absolute',
  },
  level1: {
    backgroundColor: 'yellow',
  },
  level2: {
    backgroundColor: 'green',
  }
})


function App() {
  const classes = useStyles();
  const [color, setColor] = useState('red');

  const colors = ['red', 'yellow', 'green', 'silver', 'gold']

  const handleClick = () => {
    setColor(current => current === 'gold' ? 'red' : colors[colors.indexOf(color || 'red') + 1])
  }

  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
      <div className={classes.boxContainer}>
        {times(5, index => (
          <Box key={`index${index}`} color={color} />
        ))}
      </div>
      <Button onClick={handleClick}/>
    </div>
  )
}

export default App



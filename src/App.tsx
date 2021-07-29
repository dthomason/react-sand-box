/* eslint-disable react/no-array-index-key */
/* eslint-disable no-bitwise */
/* eslint-disable react/jsx-no-comment-textnodes */
import './App.scss'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimation, useMotionValue, useTransform, Variant } from 'framer-motion';
import d3 from 'd3-voronoi';
import clsx from 'clsx';
import { times } from 'lodash';
import { makeStyles } from '@material-ui/core';
import { ShatteredPiece, useVoronoiPieces } from './useVoronoiPieces';

const useStyles = makeStyles({
  root: {
    flex: 1,
  },
  boxContainer: {
    padding: '10rem',
    perspective: 1000,
  },
  box: {
    width: '250px',
    height: '250px',
    backgroundColor: 'green',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',

  },
  boxFace: {
    inset: 0,
    zIndex: 1,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: 'yellow',
  }
})


function App() {
  const classes = useStyles();
  const controls = useAnimation();
  const [animate, setAnimate] = useState(false);
  const { shatteredPieces } = useVoronoiPieces({
    height: 250,
    width: 250,
    numPieces: 32,
  })

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
    initial: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
    },
    break: (piece: ShatteredPiece) =>({
      rotate: [0, -1, 1, 0, 1, -1, 2, -1],
      x: (piece.x / 200) * 3,
      y: (piece.y / 200) * 3,
      transition: { 
        duration: .5, 
        staggerChildren: .1,
        repeat: 1,
      }
    }),
    grow: {
      scale: 1.5,
      transition: {
        duration: 0.5,
        type: 'spring',
      }
    },
    shake: {
      scale: 1,
      rotate: [0, -1, 1, 0, 1],
      transition: {
        duration: 0.5,
        repeat: 2,
      }
    },
    explode: (piece: ShatteredPiece) => ({
      x: piece.x,
      y: piece.y,
      scale: 1.8,
      opacity: 1,
      transition: {
        duration: 1.0,
        type: 'spring',
      },
    }),
    rollIn: {
      x: 1000,
      opacity: 1,
      rotate: 360,
      transition: {
        duration: 1,
        repeat: 1,
        repeatType: 'mirror',
      }
    } as Variant,
  }

  function randomHsl() {
    return `hsla(${  Math.random() * 360  }, 100%, 50%, 1)`;
  }

  const handleTap = () => {
    setAnimate(true);
  }

  useEffect(() => {
    const sequence = async () => {
      // await controls.start('grow');
      await controls.start('shake')
      await controls.start('break');
      await controls.start('explode');
      // await controls.start('shake');
      // await controls.start('visible');
      setAnimate(false);
    }
    if (animate) sequence();

  }, [animate, controls, setAnimate])

  return (
    <div className={classes.boxContainer}>
      <motion.div className={classes.box}>
        <AnimatePresence>
          {shatteredPieces.map((piece, index) => (
            <motion.div
              initial="initial"
              custom={piece}
              animate={controls}
              className={classes.boxFace}
              key={piece.clipPath}
              onTap={handleTap}
              style={{ clipPath: piece.clipPath }}
              variants={variants}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default App


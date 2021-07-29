/* eslint-disable no-bitwise */
/* eslint-disable react/jsx-no-comment-textnodes */
import './App.scss'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimation, useMotionValue, Variant } from 'framer-motion';
import { makeStyles } from '@material-ui/core';
import { staticShatter } from './staticShatter';
import { ShatteredPiece, useVoronoiPieces } from './useVoronoiPieces';

const useStyles = makeStyles({
  root: {
    flex: 1,
  },
  boxContainer: {
    marginTop: 250,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    perspective: 1000,
  },
  box: {
    width: 200,
    height: 200,
    // backgroundColor: 'green',
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
    // backgroundColor: 'yellow',
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
  const controls = useAnimation();
  const [animate, setAnimate] = useState(false);
  const { shatteredPieces } = useVoronoiPieces({
    height: 200,
    width: 200,
    numPieces: 32,
  })

  console.log({ shatteredPieces})


  const variants = {
    hidden: { opacity: 0 },
    initial: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
    },
    grow: {
      scale: 1.5,
      transition: {
        duration: 0.5,
        type: 'spring',
      }
    },
    shake: {
      scale: 1,
      rotate: [0, -1, 1, 0, 1, -1],
      opacity: 1,
      transition: {
        duration: 0.5,
        repeat: 1,
      }
    },
    crack: (piece: ShatteredPiece) =>({
      rotate: piece ? [0, -1, 1, 0, 1, -2, 2, -1] : 0,
      x: piece ? (piece.x / 200) * 2 : 0,
      y: piece ? (piece.y / 200) * 2 : 0,
      opacity: 1,
      transition: {
        duration: .8,
        staggerChildren: .3,
      }
    }),
    explode: (piece: ShatteredPiece) => ({
      x: piece ? piece.x : 0,
      y: piece ? piece.y : 0,
      scale: piece ? 2 : 1,
      opacity: 1,
      transition: {
        duration: .8,
        type: 'spring',
      }
    }),
    fade: (piece: ShatteredPiece) => ({
      opacity: piece ? 0 : 1,
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

  const backgroundColor = useMotionValue('red');

  const handleTap = () => {
    setAnimate(true);
  }

  useEffect(() => {
    const sequence = async () => {
      await controls.start('shake')
      backgroundColor.set('blue')
      await controls.start('crack');
      await controls.start('explode');
      await controls.start('fade');

      setAnimate(false);
    }
    if (animate) sequence();

  }, [animate, backgroundColor, controls, setAnimate])

  return (
    <div className={classes.boxContainer}>
      <div className={classes.box} >
        <motion.div
          initial="initial"
          animate={controls}
          onTap={handleTap}
          className={classes.boxFace}
          style={{ backgroundColor }}
          variants={variants}
        />
        <AnimatePresence>
          {staticShatter.map(piece => (
            <motion.div
              initial="hidden"
              custom={piece}
              animate={controls}
              className={classes.boxFace}
              key={piece.clipPath}
              onTap={handleTap}
              style={{ clipPath: piece.clipPath, backgroundColor: 'red' }}
              variants={variants}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App



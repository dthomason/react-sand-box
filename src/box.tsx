/* eslint-disable no-bitwise */
/* eslint-disable react/jsx-no-comment-textnodes */
import './App.scss'
import React, { FC, useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useMotionValue, Variant } from 'framer-motion';
import { makeStyles } from '@material-ui/core';
import { staticShatter } from './staticShatter';
import { ShatteredPiece, useVoronoiPieces } from './useVoronoiPieces';

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

interface Props {
  color: string
}

export const Box: FC<Props> = ({ color }) => {
  const classes = useStyles();
  const latest = color;
  const previous = useRef(latest);
  const controls = useAnimation();
  const [animate, setAnimate] = useState(false);
  const { shatteredPieces } = useVoronoiPieces({
    height: 26,
    width: 26,
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

  const backgroundColor = useMotionValue(previous.current);

  useEffect(() => {
    if (previous.current !== latest) {
      setAnimate(true);
    }
  }, [latest, setAnimate])

  useEffect(() => {
    const sequence = async () => {
      await controls.start('shake')
      backgroundColor.set(latest)
      await controls.start('crack');
      await controls.start('explode');
      await controls.start('fade');

      previous.current = latest;
    }
    if (animate) sequence();

  }, [animate, backgroundColor, controls, latest])

  return (
          <motion.div 
            animate={controls}
            className={classes.box} 
            initial="initial"
            variants={variants}
            >
            <motion.div
              className={classes.boxFace}
              style={{ backgroundColor }}
            />
              {staticShatter.map(piece => (
                <motion.div
                  animate={controls}
                  className={classes.boxFace}
                  custom={piece}
                  initial="hidden"
                  key={piece.clipPath}
                  style={{ clipPath: piece.clipPath, backgroundColor: 'red' }}
                  variants={variants}
                />
              ))}
          </motion.div>)
}



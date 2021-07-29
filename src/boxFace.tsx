import { makeStyles } from '@material-ui/core'
import { AnimationControls, motion } from 'framer-motion'
import React, { FC } from 'react'

const useStyles = makeStyles({
  boxFace: {
    inset: 0,
    zIndex: 1,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: 'yellow',
  }
})

// export interface CustomValues {
//   x: number;
//   y: number;
//   rotate: string;
//   rotateY: string;
// }

interface Props {
  animate: AnimationControls;
  clipPath: string;
}

export const BoxFace: FC<Props> = ({ animate, clipPath }) => {
  const classes = useStyles();
  // const values = {
  //   x: (Math.round(Math.random()) * 2 - 1) * 200,
  //   y: (Math.round(Math.random()) * 2 - 1) * 200,
  //   rotate: `${Math.round(Math.random() * 70)}deg`,
  //   rotateY: `${Math.round(Math.random() * 90)}deg`,
  // }

  return (<motion.div
    animate={animate}
    className={classes.boxFace}
    custom={Math.round(Math.random())}
    initial={{
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
    }}
    style={{ clipPath }}
  />)
}


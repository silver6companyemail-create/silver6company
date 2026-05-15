'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollAnimationProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}

export default function ScrollAnimation({
  children,
  delay = 0,
  className = '',
  y = 30,
  ...props
}: ScrollAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        bounce: 0.3,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

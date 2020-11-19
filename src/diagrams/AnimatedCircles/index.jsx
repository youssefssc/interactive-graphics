import React, { useState, useEffect, useRef } from 'react';

import { useInterval } from './../../hooks/useInterval';
import { useSpring, animated } from 'react-spring';

const generateCircles = n =>
  Array(n)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10));

const allCircles = generateCircles(10);

const AnimatedCircles = () => {
  const [visibleCircles, setVisibleCircles] = useState(allCircles);

  useInterval(() => {
    setVisibleCircles(generateCircles(6));
    // console.log(visibleCircles);
  }, 2000);

  return (
    <svg viewBox='0 0 100 20'>
      {allCircles.map(d => (
        <AnimatedCircle
          key={d.key}
          index={d}
          isShowing={visibleCircles.includes(d)}
        />
      ))}
    </svg>
  );
};

const AnimatedCircle = ({ index, isShowing }) => {
  const wasShowing = useRef(false);

  useEffect(() => {
    wasShowing.current = isShowing;
  }, [isShowing]);

  const style = useSpring({
    config: {
      duration: 800,
    },
    r: isShowing ? 2 : 0,
    opacity: isShowing ? 1 : 0,
  });

  return (
    <animated.circle
      {...style}
      cx={index * 5 + 20}
      cy='10'
      fill={
        !isShowing ? 'pink' : !wasShowing.current ? 'aquamarine' : 'lightgrey'
      }
    />
  );
};

export default AnimatedCircles;

import React, { useState, useEffect, useRef } from 'react';

// import {useInterval} from './../../hooks/useInterval';
import { useSpring, animated } from 'react-spring';

import { mockData } from './mockData';

import './stack.css';

const STACK_HEIGHT = 500;

const ZoomableStack = () => {
  const [visibleStack, setVisibleStack] = useState(mockData);
  const [zoomLevel, setZoomLevel] = useState(100);

  const minData = Math.min(...Object.values(mockData));
  const maxData = Math.max(...Object.values(mockData));

  const zoomToLevel = event => {
    const level = event.target.value;
    setZoomLevel(level);
    const zoomValue = (level / 100) * maxData + minData;
    const zoomObj = Object.fromEntries(
      Object.entries(mockData).filter(([key, value]) => value < zoomValue)
    );
    // console.log(zoomObj);
    setVisibleStack(zoomObj);
    return zoomObj;
  };

  const reMapHeight = (key, value) => {
    let height = 0;
    if (Object.keys(visibleStack).includes(key)) {
      height = 100;
    }

    const visibleValues = Object.values(visibleStack);
    const findSum = (accumulator, currentValue) => accumulator + currentValue;

    const sumVisibleValues = visibleValues.reduce(findSum);
    // console.log(sumVisibleValues);
    height = (value / sumVisibleValues) * STACK_HEIGHT;

    return height;
  };

  //  useInterval(() => {
  // setVisibleStack(zoomToLevel(Math.random() * 100));
  //  }, 1000)

  return (
    <div className='container'>
      <div className='zoom'>
        <input
          className='input-range'
          orient='vertical'
          type='range'
          step='1'
          min='1'
          max='100'
          value={zoomLevel}
          onChange={zoomToLevel}
        />
        <p>
          zoom level
          <br />
          {100 - zoomLevel}
        </p>
      </div>
      <div className='stack'>
        {Object.entries(mockData).map(([key, value], index) => (
          <AnimatedBar
            key={key}
            index={index}
            value={value}
            title={key}
            height={reMapHeight(key, value)}
            isShowing={Object.keys(visibleStack).includes(key)}
          />
        ))}
      </div>
    </div>
  );
};

const AnimatedBar = ({ title, value, index, height, isShowing }) => {
  const wasShowing = useRef(false);

  useEffect(() => {
    wasShowing.current = isShowing;
  }, [isShowing]);

  const props = useSpring({
    config: {
      duration: 300,
    },
    //  display: isShowing ? 'block' : 'none',
    opacity: isShowing ? 1 : 0,
    height: isShowing ? height : 0,
    backgroundColor:
      height < 30 ? '#333' : index % 2 === 0 ? '#abcccf' : '#f1faeb',
    width: 400,
  });

  /* 
    // <animated.div {...style}
    //   fill={
    //     !isShowing          ? "#222333" :
    //     !wasShowing.current ? "#ff0000" :
    //                           "#0000ff"
    // }
    > */

  return (
    <animated.div className='box' style={props}>
      {height > 30 && (
        <span>
          {' '}
          <b>{title}</b> {value}
        </span>
      )}
    </animated.div>
  );
};

export default ZoomableStack;

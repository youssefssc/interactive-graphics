/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';

import { useSpring, animated } from 'react-spring';

import { mockData } from './mockData';

import './stack.css';

const STACK_HEIGHT = 204;
const MIN_BAR_HEIGHT = 10;
const MAX_BAR_HEIGHT = 180;
const data= mockData;

const ZoomableStack = () => {  
 const initalHeights = Object.fromEntries(
    Object.entries(data).map(([key]) => [key, 0]),
  );

  const [visibleStack, setVisibleStack] = useState(data);
  const [barHeights, setBarHeights] = useState(initalHeights);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [areBarsExpanded, setAreBarsExpanded] = useState(false);

  useEffect(() => {
    setVisibleStack(data);
    setZoomLevel(100);
    calculateBarHeights(data);
  }, [data]);

  useEffect(() => {
    zoomToLevel(zoomLevel);
    if (zoomLevel > 50) {
      setAreBarsExpanded(false);
    }
  }, [zoomLevel]);

  useEffect(() => {
    if (zoomLevel <= 50) {
      calculateBarHeights(visibleStack);
    }
  }, [areBarsExpanded]);

  // const total = Object.values(data).reduce((acc, value) => acc + value, 0);
  const minData = Math.min(...Object.values(data));
  const maxData = Math.max(...Object.values(data));
  // const meanData = (minData + maxData) / 2;

  const zoomToLevel = level => {
    const zoomValue = (level / 100) * maxData + minData;
    const zoomObject = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value < zoomValue),
    );
    setVisibleStack(zoomObject);
    calculateBarHeights(zoomObject);
    return zoomObject;
  };

  const calculateBarHeights = barsObject => {
    setBarHeights(
      Object.fromEntries(
        Object.entries(barsObject).map(([key, value]) => [
          key,
          remapHeight(key, value),
        ]),
      ),
    );
  };

  const remapHeight = (key, value) => {
    let height = MIN_BAR_HEIGHT;

    const visibleValues = Object.values(visibleStack);
    const findSum = (accumulator, currentValue) => accumulator + currentValue;
    const sumVisibleValues = visibleValues.reduce(findSum);

    height = (value / sumVisibleValues) * STACK_HEIGHT;

    if (
      areBarsExpanded &&
      Object.keys(visibleStack).includes(key) &&
      height < 3 * MIN_BAR_HEIGHT
    ) {
      height = 3 * MIN_BAR_HEIGHT;
    }

    if (height > MAX_BAR_HEIGHT) {
      height = MAX_BAR_HEIGHT;
    }

    return height;
  };

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
        onChange={event => setZoomLevel(Number(event.target.value))}
        />
        <p>
          zoom level
          <br />
          {100 - zoomLevel}
        </p>
        <button
           onClick={() => setAreBarsExpanded(!areBarsExpanded)}
            disabled={zoomLevel > 50}
          >
            {areBarsExpanded ? 'Collpase' : 'Expand'}
        </button>
      </div>
      <div className='stack'>
        {Object.entries(mockData).map(([key, value], index) => (
          <AnimatedBar
            key={key}
            index={index}
            value={value}
            title={key}
            height={barHeights[key]}
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
   opacity: isShowing ? 1 : 0,
    height: isShowing ? height : 0,
    borderColor: height > 5 ? '#FFFFFF' : '#5D5D5D',
    backgroundColor:
      height < 30 ? '#5D5D5D' : index % 2 === 0 ? '#CDD6E2' : '#B1C3DB',
    width: 306,
  });

  return (
    <animated.div className='box' style={props}>
      {height >= 30 && (
        <span>
          <b>{title}</b> {value}
        </span>
      )}
    </animated.div>
  );
};

export default ZoomableStack;

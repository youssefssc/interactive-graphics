import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section>
      <h2> Interactive Graphics with React and D3 </h2>

      <p>
        This repo contains tests, trials, and tips for practices while adding D3
        graphs to a React app.
      </p>
      <p>
        Integrating a D3 graph into a React app means to build a React component
        for a visulaization that can 1. fetch data, and on user input 2. it can
        update its data smoothly and use it to animate its graph.
      </p>
      <p>
        Since the React component lifecycles and D3's data update{' '}
        <a href="https://github.com/d3/d3-selection/blob/main/README.md#joining-data">
          methods
        </a>{' '}
        are quite different, I chose to seperate the data fetch/update part from
        the visulaization/animation part. The pattern of main component for data
        handling with sub component for visulaization is used in the examples
        below.
      </p>
      <p>
        Another tip to reduce the friction between React and D3 component
        lifecycles is trying to minimize re-renders in the data viz
        subcomponent, specifically by using less React hooks that updates the
        state and causing a re-render like <code>useState</code> and using more
        lighter hooks like <code>useRef</code> and <code>useMemo</code>.
      </p>
      <p>
        I hope the demos here can help illustrate successful integration of
        React and D3 in terms of both smooth data handling and data viz
        animation.
      </p>
      <ul>
        <li>
          Simple: <Link to="/barChart">Bar Chart</Link>,{' '}
          <Link to="/animatedCircles">Animated Circles</Link>
        </li>
        <li>
          <Link to="/contour">Contour Plots</Link>
        </li>
        <li>
          <Link to="/links">Links</Link>
        </li>
        <li>
          Pie Charts: <Link to="/donut">Half Donut</Link>,{' '}
          <Link to="/2donut">Double Half Donuts</Link>
        </li>
      </ul>
    </section>
  );
};

export default Home;

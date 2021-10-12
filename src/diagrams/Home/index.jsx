import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section>
      <h2> Interactive Graphics </h2>

      <ul>
        <li>
          <Link to='/connections'>Connections</Link>
        </li>
        <li>
          <Link to='/zoomableStack'>Zoomable Stack</Link>
        </li>
        <li>
          <Link to='/animatedCircles'> Animated Circles</Link>
        </li>
      </ul>
    </section>
  );
};

export default Home;

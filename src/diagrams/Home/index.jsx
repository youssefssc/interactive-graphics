import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section>
      <h2> Interactive Graphics </h2>
      <ul>
        <li>
          <Link to="/connections">Connections</Link>
        </li>
        <li>
          <Link to="/zoomableStack">Zoomable Stack</Link>
        </li>
        <li>
          <Link to="/animatedCircles"> Animated Circles</Link>
        </li>
        <li>
          <Link to="/barChart">Bar Chart D3</Link>
        </li>
        <li>
          <Link to="/contour">Contour D3</Link>
        </li>
      </ul>
    </section>
  );
};

export default Home;

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './diagrams/Home';
import AnimatedCircles from './diagrams/AnimatedCircles';
// import Circles from './diagrams/Circles';
import ZoomableStack from './diagrams/ZoomableStack';
import Connections from './diagrams/Connections';
import Donut from './diagrams/Donut';
import DoubleDonut from './diagrams/Donut/DoubleDonut';
import BarChartD3 from './diagrams/BarChartD3';
import Contour from './diagrams/Contour';

import './App.scss';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/connections">
            <>
              <Nav />
              <Connections />
            </>
          </Route>
          <Route path="/2donut">
            <>
              <Nav />
              <DoubleDonut />
            </>
          </Route>
          <Route path="/donut">
            <>
              <Nav />
              <Donut />
            </>
          </Route>
          <Route path="/animatedCircles">
            <>
              <Nav />
              <AnimatedCircles />
            </>
          </Route>
          <Route path="/zoomableStack">
            <>
              <Nav />
              <ZoomableStack />
            </>
          </Route>

          <Route path="/barChart">
            <>
              <Nav />
              <BarChartD3 />
            </>
          </Route>
          <Route path="/contour">
            <>
              <Nav />
              <Contour />
            </>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

const Nav = () => {
  return (
    <nav>
      <Link to="/"> &larr; Back</Link>
    </nav>
  );
};

export default App;

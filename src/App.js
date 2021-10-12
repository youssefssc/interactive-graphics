import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './diagrams/Home';
import AnimatedCircles from './diagrams/AnimatedCircles';
// import Circles from './diagrams/Circles';
import ZoomableStack from './diagrams/ZoomableStack';
import Connections from './diagrams/Connections';

import './App.scss';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/animatedCircles'>
            <>
              <Nav />
              <AnimatedCircles />
            </>
          </Route>
          <Route path='/zoomableStack'>
            <>
              <Nav />
              <ZoomableStack />
            </>
          </Route>
          <Route path='/connections'>
            <>
              <Nav />
              <Connections />
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
      <Link to='/'> &larr; Back</Link>
    </nav>
  );
};

export default App;

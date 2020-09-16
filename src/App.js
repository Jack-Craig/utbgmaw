import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import GainTracker from './Gaintracker'
import LandingPage from './LandingPage'
import Navbar from './NavBar'
import PlanMaker from './PlanMaker'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Switch>
        <Route path='/gaintracker' component={GainTracker}/>
        <Route path='/planmaker' component={PlanMaker}/>
        <Route path='/' component = {LandingPage}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App

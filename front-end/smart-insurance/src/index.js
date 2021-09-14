import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import Dashboard from './Dashboard';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'


ReactDOM.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>,
  document.getElementById('root')
);

function Routing(){
  return(
    <Router>
      <Switch>
        <Route exact path="/">
            <App />
        </Route>
        <Route path="/dashboard">
            <Dashboard />
        </Route>
      </Switch>
    </Router>
  )
}
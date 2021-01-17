import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home/home';
import { Cookies } from 'react-cookie'


export default class Index extends Component {


  cookies = new Cookies();
  render() {
    return (
      <div>
        <Router>
          <Route path='/' exact>
            <Home />
          </Route>
          <Route path='/App' exact>
              <App />
            </Route>
        </Router>
      </div>
    )
  }
}


ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById('root')
);

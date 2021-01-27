import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home/home';
import { Cookies } from 'react-cookie'
import Bookmark from './App/bookmark';
import Settings from './App/settings';


export default class Index extends Component {


  cookies = new Cookies();
  render() {
    if(this.cookies.get('id') && this.cookies.get('id') !== 'anonymous'){
      return(
        <div>
          <Router>
            <Route path='/' exact>
              <Home />
            </Route>
            <Route path='/App' exact>
              <App />
            </Route>
            <Route path='/Bookmark' exact>
              <Bookmark />
            </Route>
            <Route path='/Settings' exact>
              <Settings />
            </Route>
          </Router>
        </div>
      )
    }else if(this.cookies.get('id') === 'anonymous'){
      return(
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
    return (
      <div>
        <Router>
          <Route path='/' exact>
            <Home />
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

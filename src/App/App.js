import React, { Component } from 'react'
import './App.css';
import {  hm } from '../functions'
import { db } from "../database"
import { Cookies } from 'react-cookie'
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }
  
  cookie = new Cookies();
  componentDidMount(){
    db.collection('Posts').doc(this.cookie.get('id')).onSnapshot(t=>{
      if(t.exists){
          this.setState({posts: [...t.data().posts]})
      }
    })
  }


  render() {
    return (
      <div className='w3-center'>
        <div style={{display: 'inline-block'}}>
          <form>
            <input type='search' placeholder='Search' id='search' className='w3-input w3-border w3-round w3-margin-top search' />
          </form>
        </div>

        <div className='w3-row w3-margin-top'>
          <div className='w3-col m3 l3 w3-hide-small'><br /></div>
          <div className='w3-col s12 m6 l6'>
            {
              hm.post()
            }

            {
              this.state.posts.map((arr,ind)=>{
                return(
                  <div key={ind}>
                    <div className='w3-row w3-card w3-round w3-margin-top'>
                      <div className='w3-col m6 l6 s6'><p>{arr.post}</p></div>
                      <div className='w3-col m6 l6 s6'><p>{arr.time}</p></div>
                    </div>

                    <div>
                      <div id='comment' className=''>
                        <form className='w3-container w3-padding' style={{display: 'inline-block'}}>
                          <input className='w3-input w3-border w3-round-large' placeholder='Your Opinoin' />
                        </form>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

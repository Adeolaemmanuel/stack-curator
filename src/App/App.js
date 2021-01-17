import React, { Component } from 'react'
import './App.css';
import { cu } from '../functions'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }
  
  componentDidMount(){
    this.setState({posts: cu.getTimeline()})
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
          <div className='w3-col m2 l2 w3-hide-small'><br /></div>
          <div className='w3-col s12 m8 l8'>
            <div className='w3-center' id='curate'>
              <button className='w3-btn w3-black w3-round w3-margin-top' onClick={e=>{cu.postQuestion(e,'curate')}}>Curate</button>
            </div>
            <div className='w3-padding w3-card-4 w3-round w3-margin-top w3-margin-bottom w3-hide' id='post'>
              <form className='w3-margin-top'>
                <input className='w3-input w3-border w3-round' type='text' placeholder="Tags" id='tags' />
                <textarea className='w3-input w3-border w3-round w3-margin-top' id='post' placeholder="What's on your mind..."></textarea>
                <div className=''>
                  <button className='w3-btn w3-black w3-round w3-margin-top'  onClick={e=>{cu.postQuestion(e,'post')}}>Send</button>
                </div>
              </form>
            </div>

            {
              this.state.posts.map(arr=>{
                return(
                  <div className='w3-row'>
                    <p>{arr.posts}</p>
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

import React, { Component } from 'react'
import './App.css';
import { cu, hm } from '../functions'

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
            {
              hm.post()
            }

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

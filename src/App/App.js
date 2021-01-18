import React, { Component } from 'react'
import './App.css';
import { cu } from '../functions'
import { db } from "../database"
import { Cookies } from 'react-cookie'
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comment: [],
      theme: {name: '', color: '', bgColor: ''},
    }
  }
  
  cookie = new Cookies();
  componentDidMount(){
    db.collection('Admin').doc('Users')
    .onSnapshot(u=>{
      let users = [...u.data().userId]
      for(let a=0; a<users.length; a++){
        db.collection('Posts').doc(users[a]).onSnapshot(t=>{
          if(t.exists){
            let post = []
            post.push(t.data().posts)
            this.setState({posts: post[0]})
            this.setState({comment: t.data().comment})
          }
        })
      }
      
    })

    if(localStorage.getItem('theme') === 'light'){
      this.setState({
        theme: {
          name: 'Dark',
          bgColor: '#161b22',
          color: 'white'
        }
      })
    }
    
  }

  theme = () => {
    let color = localStorage.getItem('theme')
    if(color === 'light'){
      this.setState({
        theme: {
          name: 'Light',
          bgColor: '#161b22',
          color: 'white'
        }
      })
      localStorage.setItem('theme', 'dark')
      document.body.style.backgroundColor = '#161b22';
      document.body.style.color = 'white'
    }else if(color === 'dark'){
      this.setState({
        theme: {
          name: 'Dark',
          bgColor: '#161b22',
          color: 'white'
        }
      })
      localStorage.setItem('theme', 'light')
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black'
    }
  }
  
  commentFilter = (arr,ind) => {
    if(ind === arr.id){
      return(
        <div className='w3-padding w3-small w3-margin-top w3-card w3-round-xlarge  w3-mobile' key={`${ind}`} style={{display:'block', maxWidth: '100%'}}>
          <span >{arr.comment}</span>
        </div>
      )
    }
  }


  render() {
    return (
      <div className='w3-center'>

        <div className='w3-row w3-margin-top'>
          <div className='w3-col m3 l3 w3-hide-small'><br /></div>
          <div className='w3-col s12 m6 l6'>
            <form className=''>
              <input type='search' placeholder='Search' id='search' className='w3-input w3-border w3-round w3-margin-top search w3-mobile' />
            </form>

            {
              cu.post()
            }

            {
              this.state.posts.map((arr,ind)=>{
                return(
                  <div key={ind}>
                    <div className='w3-row w3-card w3-round w3-margin-top w3-hover-blue  w3-mobile' onClick={()=>{cu.more(`${ind}C`)}} style={{cursor: 'pointer'}}>
                      <div className='w3-col m6 l6 s6'><p>{arr.post}</p></div>
                      <div className='w3-col m6 l6 s6'><p>{arr.time}</p></div>
                    </div>

                    <div className='w3-hide' id={`${ind}C`}>
                      {
                        this.state.comment.map((arr)=>{
                          return(
                            this.commentFilter(arr,ind)
                          )
                        })
                      }
                      <div id='comment'>
                        {
                          cu.comment(ind,arr.user)
                        }
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className='w3-col m3 l3 '>
            <div className='w3-row'>
              <div className='w3-col s6 m6 l6 w3-padding'>Theme</div>
              <div className='w3-col s6 m6 l6'><button className='w3-btn w3-round' style={{backgroundColor: this.state.theme.bgColor, color: this.state.theme.color}} onClick={this.theme}>{this.state.theme.name}</button></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}



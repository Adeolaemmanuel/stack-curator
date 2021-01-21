import React, { Component } from 'react'
import './App.css';
import { cu } from '../functions'
import { Cookies } from 'react-cookie'
import { Nav } from './nav';
import { db } from "../database"


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comment: [],
      theme: {name: '', color: '', bgColor: '', textColor: ''},
    }
  }
  
    cookie = new Cookies();
    componentDidMount() {
        db.collection('Admin').doc('Users')
            .onSnapshot(u => {
                let users = [...u.data().userId]
                for (let a = 0; a < users.length; a++) {
                    db.collection('Posts').doc(users[a]).onSnapshot(t => {
                        if (t.exists) {
                            let post = []
                            let comment = []
                            for (let p in t.data()['posts']) {
                                post.unshift(t.data()['posts'][p])
                                this.setState({ posts: post })
                            }
                            for (let p in t.data()['comment']) {
                                comment.unshift(t.data()['comment'][p])
                                this.setState({ comment: comment })
                            }
                            this.data = { post: post, comment: comment }
                        }
                    })
                }

            })
        
        
        this.setState({ theme: cu.themeCheck()})
    
    }


    theme = () => {
        let color = localStorage.getItem('theme')
        if (color === 'light') {
            this.setState({
                theme: {
                    name: 'Dark',
                    bgColor: '#161b22',
                    color: 'white',
                    textColor: 'white'
                }
            })
            localStorage.setItem('theme', 'dark')
            document.body.style.backgroundColor = '#161b22';
            window.location.reload()
        } else if (color === 'dark') {
            this.setState({
                theme: {
                    name: 'Light',
                    bgColor: '#161b22',
                    color: 'white',
                    textColor: 'black'
                }
            })
            localStorage.setItem('theme', 'light')
            document.body.style.backgroundColor = 'white';
            window.location.reload()
        }
    }
  
  
    commentFilter = (arr, com, theme) => {
    if(arr.id === com.id){
        return (
            <div className='w3-margin-left' >
                <span className='w3-padding w3-small w3-margin-top w3-card-4 w3-round-xlarge' style={{ display: 'inline-block', color: theme.color, backgroundColor: theme.textColor }}>{com.comment}</span>
            </div>
        )
    }
    }


    render() {
      return (
          <div className='w3-padding' style={{ width: '100%', maxWidth: '100%' }}>
            <Nav theme={this.theme} themeSettings={this.state.theme} />
        <div className='w3-row w3-margin-top '>
          <div className='w3-col m3 l3 w3-hide-small'><br /></div>
          <div className='w3-col s12 m6 l6'>
            <form className=''>
              <input type='search' placeholder='Search' id='search' className='w3-input w3-border w3-round w3-margin-top search w3-mobile' />
            </form>

            {
              cu.post(this.state.theme)
            }

            {
              this.state.posts.map((arr,ind)=>{
                return(
                  <div key={ind}>
                    <div className='w3-row w3-card w3-round w3-margin-top w3-hover-blue w3-mobile' onClick={()=>{cu.more(`${ind}C`)}} style={{cursor: 'pointer'}}>
                            <div className='w3-col m9 l9 s9 w3-padding'><p style={{ color: this.state.theme.textColor }}>{arr.post}</p></div>
                            <div className='w3-col m3 l3 s3 w3-padding'><p style={{ color: this.state.theme.textColor, overflowWrap: 'break-word' }}><span className='w3-margin-right'>{arr.time}</span>{arr.date}</p></div>
                    </div>

                        <div className='w3-hide' id={`${ind}C`}>
                        {
                            this.state.comment.map((com)=>{
                                return (
                                    this.commentFilter(arr, com, this.state.theme)
                                )
                            })
                        }
                        <div id='comment'>
                            {
                                cu.comment(arr.id, arr.user, this.state.theme)
                            }
                        </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className='w3-col m3 l3' style={{marginTop: '50px'}}>
            
          </div>
        </div>
      </div>
    )
  }
}
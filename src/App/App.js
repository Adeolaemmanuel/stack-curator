import React, { Component } from 'react'
import './App.css';
import { cu,st } from '../functions'
import { Cookies } from 'react-cookie'
import Nav from './nav';
import { db } from "../database"
import editB from '../assets/img/editB.svg'
import editW from '../assets/img/editW.svg'
import sighB from '../assets/img/sighB.svg'
import sighW from '../assets/img/sighW.svg'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        posts: [],
        comment: [],
        commentD: '',
        theme: { name: '', color: '', bgColor: '', textColor: '' },
        optionsModal: false,
        buttonPostUpdate: { title: 'Answer their sigh', action: 'post', comId: null, user: null, ind: null },
        svg: { edit: editB, sigh: sighB},
        hint: true,
    }
  }
  
    cookie = new Cookies();
    inputId = `${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}`

    componentDidMount() {
        let menuBarCheck = localStorage.getItem('theme')
        if (menuBarCheck === 'light') {
            this.setState({ svg: { edit: editB, sigh: sighB} })
        } else if (menuBarCheck === 'dark') {
            this.setState({ svg: { edit: editW, sigh: sighW } })
        }
        this.getPostComment()
        this.setState({ theme: cu.themeCheck()})
        db.collection('Users').doc(this.cookie.get('id')).get()
        .then(e=>{
            this.setState({hint: e.data().hint})
        })
    }

    getPostComment = () => {
        db.collection('Sighs').doc('all').onSnapshot(t => {
            if (t.exists) {
                let post = [], comment = []
                for (let p in t.data()['posts']) {
                    post.unshift(t.data()['posts'][p])
                }
                this.setState({ posts: post })
                for (let p in t.data()['comment']) {
                    comment.unshift(t.data()['comment'][p])
                }
                this.setState({ comment: comment })
                this.setState({ post: post })
            }
        })
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

    editSigh = (com, user, ind, commentD) => {
        if (this.cookie.get('id') === user) {
            db.collection('Sighs').doc('all').get()
                .then(e => {
                    let comments = [...e.data().comment]
                    for (let c of comments) {
                        if (c.id === com) {
                            document.querySelector(`#inp${ind}`).value = c.comment;
                            this.setState({ buttonPostUpdate: { title: 'Update sigh', action: 'edit', comId: com, user: user }, commentD: c, optionsModal: false })
                        }
                    }
                })
        } else {
            alert('Cant edit others sigh')
        }
    }

    functionState = (name,data) => {
        this.setState({[name]: data})
    }

    optionsModal = () => {
        if (this.state.optionsModal) {
            return (
                <>
                    <div className='w3-modal' style={{ display: 'block' }}>
                        <div className='w3-modal-container w3-padding' style={{ backgroundColor: this.state.theme.color }}>
                            <div className='w3-padding w3-center'>
                                <span className='w3-padding w3-large w3-bold' onClick={e => this.setState({ optionsModal: false })} style={{ color: this.state.theme.color, cursor: 'pointer', backgroundColor: this.state.theme.textColor }} >X</span>
                            </div>
                            <div className='w3-center'>
                                <span className='w3-padding w3-xlarge w3-bold' style={{ color: this.state.theme.textColor }}>OPTIONS</span>
                            </div>
                            <div className='w3-row-padding w3-margin-bottom'>
                                <div className='w3-col s2 l2 m2 w3-padding'>
                                    <img src={this.state.svg.edit} alt='edit' className='w3-padding' title='edit' style={{ width: '80px' }} onClick={() => { this.editSigh(this.state.buttonPostUpdate.comId, this.state.buttonPostUpdate.user, this.state.buttonPostUpdate.ind, this.state.commentD); this.setState({ optionsModal: false}) }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                )
        }
    }

    commentFilter = (arr, com, theme, edt, ind) => {
        if (arr.id === com.postId) {
            return (
                <>
                    
                    <div className='w3-margin-left'>
                        <span className='w3-padding w3-small w3-margin-top w3-card-4 w3-round-large' id={`#edt${edt}`} onDoubleClick={() => this.setState({ optionsModal: true, buttonPostUpdate: { title: 'Answer their sigh', action: 'post', comId: com.id, user: com.user, ind: ind } })} style={{ display: 'inline-block', color: theme.color, backgroundColor: theme.textColor }}><i>@{com.user}:</i> <br />{com.comment}</span>
                    </div>
                    
                </>
            )
        }
    }

    search = (e) => {
        let S = e.target.value.toLowerCase()
        console.log(S.length);
        let post = [...this.state.posts];
        let result = []
        if (S.length === 0) {
            this.getPostComment()
        }
        for (let s in post) {
            if (post[s].post.toLowerCase().includes(S) && S !== "") {
                result.push(post[s])
            }
        }
        this.setState({ posts: result })
        
    }
        


    render() {
      return (
          <div className='w3-padding' style={{ width: '100%', maxWidth: '100%' }}>
            <Nav theme={this.theme} themeSettings={this.state.theme} />
        <div className='w3-row w3-margin-top '>
          <div className='w3-col m3 l3 w3-hide-small'><br /></div>
          <div className='w3-col s12 m6 l6'>
            <form className=''>
                <input type='search' placeholder='Search' id='search' className='w3-input w3-border w3-round w3-margin-top search w3-mobile' onChange={this.search} />
            </form>

            {
              cu.post(this.state.theme)
            }
                      
            {
              this.state.posts.map((arr,ind)=>{
                return(
                    <div key={ind} id={`${ind}S`}>
                        <div className='w3-row w3-card w3-round w3-margin-top w3-hover-blue w3-mobile' onClick={() => { cu.more(`${ind}C`) }} style={{ cursor: 'pointer' }}>
                            <div className='w3-padding'><p style={{ color: this.state.theme.textColor }}>__{arr.user}: <br />{arr.post}</p></div>
                            <div className='w3-col m6 l6 s6 w3-padding w3-margin-top' style={{ color: this.state.theme.textColor }} ><code>{arr.comCount} Comments</code></div>
                            <div className='w3-col m6 l6 s6 w3-padding'><p className='w3-right' style={{ color: this.state.theme.textColor, overflowWrap: 'break-word' }}><code className='w3-margin-right'>{arr.time}</code><code>{arr.date}</code></p></div>
                        </div>

                            <div className='w3-hide' id={`${ind}C`}>
                                {
                                    this.state.comment.map((com,edt)=>{
                                        return (
                                            <>
                                                {
                                                    this.commentFilter(arr, com, this.state.theme, edt, ind)
                                                }
                                            </>
                                        )
                                    })
                                }
                                    <div id='comment'>
                                    {
                                        cu.comment(arr, this.state.commentD, `${ind}S`, this.state.theme, ind, this.state.buttonPostUpdate, this.functionState)
                                        }
                                    </div>
                                
                            </div>
                        {
                            this.optionsModal()
                        }
                        {
                            st.helpModal(this.state.hint,this.state.theme,this.functionState)
                        }
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
import React, { Component } from "react"
import { db } from "../database"
import { bm,cu } from "../functions"
import Nav from "./nav"
import { Cookies } from 'react-cookie'
import editB from '../assets/img/editB.svg'
import editW from '../assets/img/editW.svg'
import trashB from '../assets/img/trashB.svg'
import trashW from '../assets/img/trashW.svg'


export default class Bookmark extends Component {
    constructor(props) {
        super(props)
        this.state = {
            theme: { name: '', color: '', bgColor: '', textColor: '' },
            bookmaredSighers: [],
            posts: [],
            comment: [],
            buttonPostUpdate: { title: 'Answer their sigh', action: 'post', comId: null, user: null, ind: null },
            optionsModal: false,
            svg: { edit: editB, trash: trashB},
        }
    }

    componentDidMount() {
        this.setState({ theme: bm.themeCheck() })
        this.getBookmark()
        let menuBarCheck = localStorage.getItem('theme')
        if (menuBarCheck === 'light') {
            this.setState({ svg: { edit: editB, trash: trashB} })
        } else if (menuBarCheck === 'dark') {
            this.setState({ svg: { edit: editW, trash: trashW } })
        }
    }

    cookies = new Cookies();

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
            this.componentDidMount()
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
            this.componentDidMount()
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

    getBookmark = () => {
        db.collection('Bookmark').doc(this.cookies.get('id')).onSnapshot(b=>{
            if(b.exists){
                this.setState({bookmaredSighers: [...b.data().bookmark]})
            }
        })
        
        db.collection('Sighs').doc('all').get()
        .then(s=>{
            if(s.exists){
                let post = []
                let comment = []
                for(let p of s.data().posts){
                    if(p.user === this.cookies.get('id')){
                        post.unshift(p)
                    }
                }
                for(let p of s.data().comment){
                    comment.unshift(p)
                }
                this.setState({posts: post})
                this.setState({comment: comment})
            }
        })
    }

    selectSighers = (e,type) => {
        if(type === 'view'){
            db.collection('Sighs').doc('all').onSnapshot(s=>{
                if(s.exists){
                    let post = []
                    for(let p of s.data().posts){
                        if(p.user === e.target.id){
                            post.unshift(p)
                            console.log(post);
                        }
                    }
                    this.setState({posts: post})
                }
            })
        }else if(type === 'del'){
            db.collection('Bookmark').doc(this.cookies.get('id')).get()
            .then(b=>{
                if(e.target.id !== this.cookies.get('id')){
                    if(b.exists){
                        let all = [...b.data().bookmark]
                        let ind = all.indexOf(e.target.id)
                        all.splice(ind)
                        console.log(all);
                        db.collection('Bookmark').doc(this.cookies.get('id')).update({
                            bookmark: all
                        }).then(()=>{
                            db.collection('Users').doc(this.cookies.get('id')).get()
                            .then(b=>{
                                let count 
                                if(b.data().bookmarked !== 0){
                                    count = b.data().bookmarked -1
                                }else{
                                    count = 0
                                }
                                db.collection('Users').doc(this.cookies.get('id'))
                                .update({bookmarked: count})
                            })
                        })
                    }
                }else{
                    alert('You cant delete yourself')
                }
            })
            db.collection('Bookmark').doc(e.target.id).get()
            .then(b=>{
                if(e.target.id !== this.cookies.get('id')){
                    if(b.exists){
                        let all = [...b.data().bookmark]
                        let ind = all.indexOf(this.cookies.get('id'))
                        all.splice((ind-1), ind)
                        db.collection('Bookmark').doc(e.target.id).update({
                            bookmark: all
                        }).then(()=>{
                            db.collection('Users').doc(e.target.id).get()
                            .then(b=>{
                                let count 
                                if(b.data().bookmarked !==0){
                                    count = b.data().bookmarked -1
                                }else{
                                    count = 0
                                }
                                db.collection('Users').doc(e.target.id)
                                .update({bookmarked: count})
                            })
                        })
                    }
                }
            })
        }
    }

    sighersBookmark = () => {
        if(bm.mobileSettings()){
            return(
                <>
                    <div className='w3-center'>
                        <button onClick={()=>document.querySelector('#sighers').style.display = 'block'} className='w3-btn w3-round w3-margin-top' style={{ backgroundColor: this.state.theme.textColor, color: this.state.theme.color }}>View bookmarked sighers</button>
                    </div>

                    <div className='w3-modal' id='sighers'>
                        <div className='w3-modal-content' style={{backgroundColor: this.state.theme.color}}>
                            <div className='w3-center w3-margin-top w3-padding'>
                                <span onClick={()=>document.querySelector('#sighers').style.display = 'none'} className='w3-padding' style={{ backgroundColor: this.state.theme.textColor, color: this.state.theme.color }}>X</span>
                            </div>

                            <div className='w3-container w3-padding'>
                                {
                                    this.state.bookmaredSighers.map(arr=>{
                                        return(
                                            <>
                                                <div className='w3-row'>
                                                    <div className='w3-col s10 m7 l7'>
                                                        <button id={arr} onClick={(e)=>this.selectSighers(e,'view')} className='w3-btn w3-round w3-block w3-margin-top' style={{ backgroundColor: this.state.theme.textColor, color: this.state.theme.color }}>{arr}</button>
                                                    </div>
                                                    <div className='w3-rest'>
                                                        <img className='w3-padding w3-xlarge' id={`${arr}`} onClick={(e)=>this.selectSighers(e,'del')} src={this.state.svg.trash} alt='trash' style={{width: '60px', height: '60px', cursor: 'pointer'}} />
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </>
            )
        }else{
            return(
                <>
                    <div className='w3-margin-top w3-padding w3-center'>
                        <h4 style={{ color: this.state.theme.textColor }} >Bookmared Sighers</h4>
                    </div>

                    <div className='w3-container w3-padding w3-margin-top'>
                                {
                                    this.state.bookmaredSighers.map(arr=>{
                                        return(
                                            <>
                                                <div className='w3-row'>
                                                    <div className='w3-col s10 m9 l9'>
                                                        <button id={arr} onClick={e=>this.selectSighers(e,'view')} className='w3-btn w3-round w3-block w3-margin-top' style={{ backgroundColor: this.state.theme.textColor, color: this.state.theme.color }}>{arr}</button>
                                                    </div>
                                                    <div className='w3-rest'>
                                                        <img className='w3-padding w3-xlarge w3-right' id={`${arr}`} onClick={(e)=>this.selectSighers(e,'del')} src={this.state.svg.trash} alt='trash' style={{width: '65px', height: '65px', cursor: 'pointer'}} />
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                </>
            )
        }
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

    render() {
        return (
            <div>
                <Nav theme={this.theme} themeSettings={this.state.theme} />
                <div className='w3-row w3-margin-top' id='top'>
                    <div className='w3-col m3 l3 s12 w3-padding w3-border-right' >
                        <form id='bookmark' onSubmit={bm.bookmark}>
                            <input type='text' className='w3-input w3-padding' placeholder='Usename' name='username' id='bokMP' />

                            <div className='w3-center'>
                                <button className='w3-btn w3-round w3-margin-top' style={{ backgroundColor: this.state.theme.textColor, color: this.state.theme.color }}>Bookmark</button>
                            </div>
                        </form>
                        {
                            this.sighersBookmark()
                        }
                    </div>
                    <div className='w3-col s12 m6 l6 w3-padding'>
                        {
                            this.state.posts.map((arr,ind)=>{
                                return(
                                    <>
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
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            )
    }
}
import React, { Component } from 'react'
import bar from '../assets/img/menu.svg'
import barw from '../assets/img/menuw.svg'
import bokMB from '../assets/img/bokMB.svg'
import bokMW from '../assets/img/bokMW.svg'
import setB from '../assets/img/setB.svg'
import setW from '../assets/img/setW.svg'
import sighB from '../assets/img/sighB.svg'
import sighW from '../assets/img/sighW.svg'
import upB from '../assets/img/upB.svg'
import upW from '../assets/img/upW.svg'
import { Link } from "react-router-dom";
import { Cookies } from 'react-cookie'
import './App.css'
import {db} from '../database'
export default class Nav extends Component {

    constructor(props) {
        super(props)
        this.state = {
            up: upB,
            menuBar: bar,
            links: [{to: 'App', name: 'Sighs',img: sighB},{to: 'Bookmark', name: 'Bookmark', img: bokMB},{to: 'Settings', name: 'Settings',img: setB}],
            bookmarked: null,
        }
    }

    cookie = new Cookies();
    componentDidMount() {
        let menuBarCheck = localStorage.getItem('theme')
        if (menuBarCheck === 'light') {
            this.setState({ links: [{to: 'App', name: 'Sighs',img: sighB},{to: 'Bookmark', name: 'Bookmark', img: bokMB},{to: 'Settings', name: 'Settings',img: setB}], up: upB, menuBar: bar })
        } else if (menuBarCheck === 'dark') {
            this.setState({ links: [{to: 'App', name: 'Sighs',img: sighW},{to: 'Bookmark', name: 'Bookmark', img: bokMW},{to: 'Settings', name: 'Settings',img: setW}], up: upW,  menuBar: barw  }) 
        }
        this.user()
    }

    user = () => {
        db.collection('Users').doc(this.cookie.get('id')).onSnapshot(u=>{
            if(u.exists){
                this.setState({bookmarked: u.data().bookmarked})
            }
        })
    }

    nav = (e, pram) => {
        e.preventDefault()
        if (pram === 'open') {
            let check = document.querySelector('#sidebar').classList.contains('w3-hide')
            if (check) {
                document.querySelector('#sidebar').classList.remove('w3-hide');
            } else {
                document.querySelector('#sidebar').classList.add('w3-hide');
            }
        }
        if (pram === 'close') {
            document.querySelector('#sidebar').classList.add('w3-hide');
        }
    }


    render() {
        return (
            <div>
                <nav className='w3-bar'>
                    <div className='w3-bar-item '>
                        <img src={this.state.menuBar} onClick={e => this.nav(e, 'open')} alt='menu' style={{ width: '40px', height: '40px', color: this.props.themeSettings.color }} />
                    </div>
                    <div className='w3-center'>
                        <h4 className='w3-bold' style={{ color: this.props.themeSettings.textColor }}>A CURATOR SIGHS</h4>
                    </div>
                </nav>
                <div className='w3-sidebar w3-bar-block w3-hide w3-animate-left' id='sidebar' style={{ backgroundColor: this.props.themeSettings.color, position: 'relative', left: '0' }}>
                    <div className='w3-padding w3-center'>
                        <span className='w3-padding w3-large w3-bold' onClick={e=>this.nav(e,'close')} style={{ color: this.props.themeSettings.color, cursor: 'pointer', backgroundColor: this.props.themeSettings.textColor }} >X</span>
                    </div>
                    <div className='w3-row w3-bar-item w3-block w3-margin-top'>
                        <div className='w3-col s6 m6 l6 w3-padding' style={{ color: this.props.themeSettings.textColor }}>Theme</div>
                        <div className='w3-col s6 m6 l6'><button className='w3-btn w3-round' style={{ backgroundColor: this.props.themeSettings.textColor, color: this.props.themeSettings.color }} onClick={()=>{this.props.theme(); this.componentDidMount(); document.querySelector('#sidebar').classList.add('w3-hide')}}>{this.props.themeSettings.name}</button></div>
                    </div>
                    <div>
                        {
                            this.state.links.map(l=>{
                                return(
                                    <div className='w3-row w3-bar-item w3-block w3-margin-top' key={l.to}>
                                        <div className='w3-col s6 m6 l6 w3-padding' style={{ color: this.props.themeSettings.textColor }}>
                                            <img src={l.img} onClick={e => this.nav(e, 'open')} alt='settings' style={{ width: '40px', height: '40px', color: this.props.themeSettings.color }} />
                                        </div>
                                        <div className='w3-col s6 m6 l6 w3-margin-top'>
                                            <Link to={`/${l.to}`} className='w3-padding w3-bold' style={{ color: this.props.themeSettings.textColor }} >{l.name}</Link>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    

                    <div className='w3-bar-item w3-block w3-margin-top'>
                        <div className='w3-row w3-center'>
                            <div className='w3-col s6 m6 l6'>
                                <h6 style={{ color: this.props.themeSettings.textColor }} ><code>Username: </code></h6>
                            </div>
                            <div className='w3-col s6 m6 l6'>
                                <h6><code style={{ color: this.props.themeSettings.textColor }} >{new Cookies().get('id')}</code></h6>
                            </div>
                        </div>
                        <div className='w3-row w3-center'>
                            <div className='w3-col s6 m6 l6'>
                                <h6 style={{ color: this.props.themeSettings.textColor }} ><code>Bookmarks: </code></h6>
                            </div>
                            <div className='w3-col s6 m6 l6'>
                                <h6><code style={{ color: this.props.themeSettings.textColor }} >{this.state.bookmarked}</code></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <a href='#top' className='w3-padding top'>
                    <img src={this.state.up} alt='up' style={{width: '50px', height: '50px'}} />
                </a>
            </div>
        )
    }
}
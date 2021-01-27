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
export default class Nav extends Component {

    constructor(props) {
        super(props)
        this.state = {
            menuBar: bar,
            bookmark: bokMB,
            settings: setB,
            sigh: sighB,
            up: upB
        }
    }

    componentDidMount() {
        let menuBarCheck = localStorage.getItem('theme')
        if (menuBarCheck === 'light') {
            this.setState({ menuBar: bar, bookmark: bokMB, settings: setB, sigh: sighB, up: upB })
        } else if (menuBarCheck === 'dark') {
            this.setState({ menuBar: barw, bookmark: bokMW, settings: setW, sigh: sighW, up: upW }) 
        }
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
                        <div className='w3-col s6 m6 l6'><button className='w3-btn w3-round' style={{ backgroundColor: this.props.themeSettings.textColor, color: this.props.themeSettings.color }} onClick={this.props.theme}>{this.props.themeSettings.name}</button></div>
                    </div>
                    <div className='w3-row w3-bar-item w3-block w3-margin-top'>
                        <div className='w3-col s6 m6 l6 w3-padding' style={{ color: this.props.themeSettings.textColor }}>
                            <img src={this.state.sigh} onClick={e => this.nav(e, 'open')} alt='sigh' style={{ width: '40px', height: '40px', color: this.props.themeSettings.color }} />
                        </div>
                        <div className='w3-col s6 m6 l6 w3-margin-top'>
                            <Link to='/App' className='w3-padding w3-bold' style={{ color: this.props.themeSettings.textColor }} >Sighs</Link>
                        </div>
                    </div>
                    <div className='w3-row w3-bar-item w3-block w3-margin-top'>
                        <div className='w3-col s6 m6 l6 w3-padding' style={{ color: this.props.themeSettings.textColor }}>
                            <img src={this.state.bookmark} onClick={e => this.nav(e, 'open')} alt='bookmark' style={{ width: '40px', height: '40px', color: this.props.themeSettings.color }} />
                        </div>
                        <div className='w3-col s6 m6 l6 w3-margin-top'>
                            <Link to='/Bookmark' className='w3-padding w3-bold' style={{ color: this.props.themeSettings.textColor }} >Bookmark</Link>
                        </div> 
                    </div>
                    <div className='w3-row w3-bar-item w3-block w3-margin-top'>
                        <div className='w3-col s6 m6 l6 w3-padding' style={{ color: this.props.themeSettings.textColor }}>
                            <img src={this.state.settings} onClick={e => this.nav(e, 'open')} alt='settings' style={{ width: '40px', height: '40px', color: this.props.themeSettings.color }} />
                        </div>
                        <div className='w3-col s6 m6 l6 w3-margin-top'>
                            <Link to='/Settings' className='w3-padding w3-bold' style={{ color: this.props.themeSettings.textColor }} >Settings</Link>
                        </div>
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
                    </div>
                </div>
                <a href='#top' className='w3-padding top'>
                    <img src={this.state.up} alt='up' style={{width: '50px', height: '50px'}} />
                </a>
            </div>
        )
    }
}
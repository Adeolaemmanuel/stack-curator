﻿import { Component } from "react"
import bar from '../assets/img/menu.svg'


export class Nav extends Component {


    nav = (e,pram) => {
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
                        <img src={bar} onClick={e => this.nav(e, 'open')} alt='menu' style={{ width: '40px', height: '40px', color: this.props.themeSettings.color }} />
                    </div>
                    <div className='w3-center'>
                        <h4 className='w3-bold'>A CURATOR SIGHS</h4>
                    </div>
                </nav>
                <div className='w3-sidebar w3-bar-block w3-hide w3-animate-left' id='sidebar' style={{ backgroundColor: this.props.themeSettings.color }}>
                    <div className='w3-row w3-bar-item w3-block w3-margin-top'>
                        <div className='w3-col s6 m6 l6 w3-padding' style={{ color: this.props.themeSettings.textColor }}>Theme</div>
                        <div className='w3-col s6 m6 l6'><button onClick={e => this.nav(e, 'close')} className='w3-btn w3-round' style={{ backgroundColor: this.props.themeSettings.bgColor, color: this.props.themeSettings.color }} onClick={this.props.theme}>{this.props.themeSettings.name}</button></div>
                    </div>
                </div>
            </div>
            )
    }
}
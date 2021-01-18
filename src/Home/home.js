import React, { Component } from 'react'
import './home.css'
import { fn, hm } from '../functions'
import any from '../assets/img/anonymous.svg'

export default class home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }
    

    componentDidMount(){
        fn.mobileSettings('r')
    }

    
    render() {
        return (
            <>
                <div className="header">

                    <div className="inner-header flex">
                        
                        <div className='w3-center' id='login'>
                            <div style={{display: 'inline-block', width: '380px', marginTop: '200px'}} className='w3-card-4 w3-white'>
                                <form className='w3-padding' onSubmit={e=>{hm.home(e,'login')}}>
                                    <input className='w3-input w3-margin-top' placeholder='Username' id='username' type='text' />
                                    <input className='w3-input w3-margin-top' placeholder='Password' id='password' type='password' />
                                    <button className='w3-black w3-btn w3-padding w3-margin-top w3-margin-bottom w3-round'>Login</button>
                                    <p className='w3-text-blue' style={{cursor: 'pointer'}} onClick={e=>{hm.home(e,'create')}}>Create free account</p>
                                </form>
                            </div>
                        </div>

                        <div className='w3-center w3-hide' id='register'>
                            <div style={{display: 'inline-block', width: '380px', marginTop: '200px'}} className='w3-card-4 w3-white'>
                                <form className='w3-padding' onSubmit={e=>{hm.home(e,'register')}}>
                                    <input className='w3-input w3-margin-top' placeholder='Username' id='rusername' type='text' />
                                    <input className='w3-input w3-margin-top' placeholder='Password' id='rpassword' type='password' />
                                    <button className='w3-black w3-btn w3-padding w3-margin-top w3-margin-bottom w3-round'>Register</button>
                                    <p className='w3-text-blue' style={{cursor: 'pointer'}}  onClick={e=>{hm.home(e,'log')}}>Login</p>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div>
                        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                        <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                        </defs>
                        <g className="parallax">
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                        </g>
                        </svg>
                    </div>
                </div>

                <div className="content flex">
                    <p>Adeola Kittan | {this.state.date.getFullYear()}</p>
                    <img src={any} alt='Anonymous login' className='w3-padding' title='Anonymous login' style={{cursor: 'pointer', width: '70px', height: '70px'}} />
                </div>
            </>
        )
    }
}

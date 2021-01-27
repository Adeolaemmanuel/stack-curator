import React, { Component } from 'react'
import { Cookies } from 'react-cookie';
import { db } from '../database';
import { st } from '../functions';
import './App.css'
import Nav from './nav';


export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: { name: '', color: '', bgColor: '', textColor: '' },
        }
    }
    
    componentDidMount() {
        this.setState({ theme: st.themeCheck() })
        db.collection('Users').doc(this.cookies.get('id')).get()
        .then(e=>{
            document.querySelector('#hint').checked = e.data().hint
        })
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

    options = (type) => {
        if( type === 'hint'){
            console.log(document.querySelector('#hint').checked);
            if(document.querySelector('#hint').checked === false){
                db.collection('Users').doc(this.cookies.get('id'))
                .update({
                    hint: true
                })
            }

            if(document.querySelector('#hint').checked === true){
                db.collection('Users').doc(this.cookies.get('id'))
                .update({
                    hint: false
                })
            }
        }
    }


    render() {
        return (
            <div>
                <Nav theme={this.theme} themeSettings={this.state.theme} />
                <div className='w3-row-padding'>
                    <div className='w3-col s6 m6 l6 w3-padding'>
                        <h2 style={{color: this.state.theme.textColor}}>Hint</h2>
                    </div>
                    <div className='w3-col s6 m6 l6 w3-padding w3-margin-top'>
                        <label className="switch w3-right w3-margin-right">
                            <input type="checkbox" id='hint' />
                            <span className="slider round" onClick={()=>{this.options('hint')}}></span>
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}

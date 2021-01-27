import React, { Component } from "react"
import { db } from "../database"
import { bm } from "../functions"
import Nav from "./nav"
import { Cookies } from 'react-cookie'

export default class Bookmark extends Component {
    constructor(props) {
        super(props)
        this.state = {
            theme: { name: '', color: '', bgColor: '', textColor: '' },
            bookmaredSighers: [],
        }
    }

    componentDidMount() {
        this.setState({ theme: bm.themeCheck() })
        this.getBookmark()
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

    

    getBookmark = () => {
        db.collection('Bookmark').doc(this.cookies.get('id')).onSnapshot(b=>{
            if(b.exists){
                this.setState({bookmaredSighers: ['Your Sighs',...b.data().bookmark]})
                let sighers = [...b.data().bookmark]
                //let post = []
                for(let b of sighers) {
                    console.log(b);
                }
            }
        })
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
                                                <button className='w3-btn w3-round w3-block w3-margin-top' style={{ backgroundColor: this.state.theme.textColor, color: this.state.theme.color }}>{arr}</button>
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
                                                <button className='w3-btn w3-round w3-block w3-margin-top' style={{ backgroundColor: this.state.theme.textColor, color: this.state.theme.color }}>{arr}</button>
                                            </>
                                        )
                                    })
                                }
                            </div>
                </>
            )
        }
    }

    render() {
        return (
            <div>
                <Nav theme={this.theme} themeSettings={this.state.theme} />
                <div className='w3-row w3-margin-top'>
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
                </div>
            </div>
            )
    }
}
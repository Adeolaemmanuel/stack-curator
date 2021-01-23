import React, { Component } from "react"
import { cu } from "../functions"
import Nav from "./nav"


export default class Bookmark extends Component {
    constructor(props) {
        super(props)
        this.state = {
            theme: { name: '', color: '', bgColor: '', textColor: '' },
        }
    }

    componentDidMount() {
        this.setState({ theme: cu.themeCheck() })
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

    bookmark = (e) => {
        e.preventDefault();
        let form = new FormData(document.querySelector('#bookmark'))
        console.log(form)
    }

    render() {
        return (
            <div>
                <Nav theme={this.theme} themeSettings={this.state.theme} />
                <div className='w3-row w3-margin-top'>
                    <div className='w3-col m3 l3 w3-hide-small w3-padding w3-border-right'>
                        <form id='bookmark' onSubmit={this.bookmark}>
                            <input type='text' className='w3-input w3-padding' placeholder='Usename' id='bokMP' />

                            <div className='w3-center'>
                                <button className='w3-btn w3-round w3-margin-top' style={{ backgroundColor: this.state.theme.textColor, color: this.state.theme.color }}>Bookmark</button>
                            </div>
                        </form>

                        <div className='w3-margin-top w3-padding w3-center'>
                            <h4 style={{ color: this.state.theme.textColor }} >Bookmared Sighers</h4>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}
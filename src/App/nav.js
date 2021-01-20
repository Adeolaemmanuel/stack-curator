import { Component } from "react"
import bar from '../assets/img/menu.svg'
import barw from '../assets/img/menuw.svg'


export class Nav extends Component {

    constructor(props) {
        super(props)
        this.state = {
            menuBar: bar,
            theme: { name: '', color: '', bgColor: '', textColor: '' },
        }
        this.theme = this.theme.bind(this)
    }

    componentDidMount() {
        if (localStorage.getItem('theme') === 'light') {
            this.setState({
                theme: {
                    name: 'Dark',
                    bgColor: '#161b22',
                    color: 'white',
                    textColor: '#161b22'
                }
            })
            this.setState({ menuBar: bar })
        } else if (localStorage.getItem('theme') === 'dark') {
            this.setState({
                theme: {
                    name: 'Light',
                    bgColor: '#161b22',
                    color: '#161b22',
                    textColor: 'white'
                }
            })
            this.setState({ menuBar: barw })
            document.body.style.backgroundColor = '#161b22';
        }
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
        }
        this.props.theme()
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
                        <img src={this.state.menuBar} onClick={e => this.nav(e, 'open')} alt='menu' style={{ width: '40px', height: '40px', color: this.state.theme.color }} />
                    </div>
                    <div className='w3-center'>
                        <h4 className='w3-bold' style={{ color: this.state.theme.textColor}}>A CURATOR SIGHS</h4>
                    </div>
                </nav>
                <div className='w3-sidebar w3-bar-block w3-hide w3-animate-left' id='sidebar' style={{ backgroundColor: this.state.theme.color, position: 'relative', left:'0' }}>
                    <div className='w3-row w3-bar-item w3-block w3-margin-top'>
                        <div className='w3-col s6 m6 l6 w3-padding' style={{ color: this.state.theme.textColor }}>Theme</div>
                        <div className='w3-col s6 m6 l6'><button onClick={e => this.nav(e, 'close')} className='w3-btn w3-round' style={{ backgroundColor: this.state.theme.textColor, color: this.state.theme.color }} onClick={this.theme}>{this.state.theme.name}</button></div>
                    </div>
                </div>
            </div>
            )
    }
}
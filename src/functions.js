import { db, firebase } from "./database"
import { Cookies } from 'react-cookie'

class Functions {

    //Ideas jott down
    //change theme
    
    cookie = new Cookies();
    date = new Date();


    mobileSettings = (pram) =>{
        if(window.matchMedia("(max-width: 767px)").matches){
            
        }
    }

    
}

const fn = new Functions();

class Home extends Functions {

    home = (e, pram) =>{
        e.preventDefault();
        let login = document.getElementById('login')
        let register = document.getElementById('register')
        if(pram === 'create'){
            login.classList.add('w3-hide')
            register.classList.remove('w3-hide')
        }
        if(pram === 'log'){
            login.classList.remove('w3-hide')
            register.classList.add('w3-hide')
        }

        if(pram === 'login'){
            let data = {
                username: e.target.elements.username.value,
                password: e.target.elements.password.value,
            }
            db.collection('Users').doc(data.username).get()
            .then(x=>{
                if(x.exists){
                    if(data.username === x.data().user && data.password === x.data().pass){
                        this.cookie.set('id', data.username)
                        window.location.assign("/App")
                        localStorage.setItem('theme', 'light')
                    }
                }
            })
        }

        if(pram === 'register'){
            e.preventDefault();
            let data = {
                username: e.target.elements.rusername.value,
                password: e.target.elements.rpassword.value,
            }

            db.collection('Users').doc(data.username).set({
                user: data.username,
                pass: data.password
            })
            .then(()=>{
                db.collection('Admin').doc('Users').get()
                .then(c=>{
                    if(c.exists){
                        let all = [c.data().userId]
                        if(all.indexOf(data.username) === -1){
                            db.collection('Admin').doc('Users').update({
                                userId: firebase.firestore.FieldValue.arrayUnion(data.username)
                            }).then(()=>{
                                this.cookie.set('id', data.username)
                                window.location.assign("/App")
                                localStorage.setItem('theme', 'light')
                            })
                        }
                    }else{
                        db.collection('Admin').doc('Users').set({
                            userId: [data.username]
                        }).then(()=>{
                            this.cookie.set('id', data.username)
                            window.location.assign("/App")
                            localStorage.setItem('theme', 'light')
                        })
                    }
                })
            })
        }
    }

    anymousLogin = () => {
        this.cookie.set('id', 'anonymous')
        localStorage.setItem('theme', 'light')
        window.location.assign('/App')
    }
}

const hm = new Home();

class Curate extends Functions {

    postSigh = (e,pram) =>{
        e.preventDefault();
        if(pram === 'curate'){
            document.getElementById('curate').classList.add('w3-hide')
            document.getElementById('post').classList.remove('w3-hide')
        }

        if(pram === 'post'){
            e.preventDefault()
            let [month, date, year] = new Date().toLocaleDateString("en-US").split("/")
            let [hour, minute] = new Date().toLocaleTimeString("en-US").split(/:| /)


            let data = {
                time: `${hour}:${minute}`,
                date: `${month}/${date}/${year}`,
                tags: document.getElementById('tags').value,
                post: document.getElementById('posts').value,
                user: this.cookie.get('id'),
                id: `${Math.floor(Math.random() * 4)}${Math.floor(Math.random() * 4)}${Math.floor(Math.random() * 4)}${Math.floor(Math.random() * 4)}${Math.floor(Math.random() * 4)}`
            }
            if (data.post !== '' && data.tag !== '') {
                db.collection('Posts').doc(this.cookie.get('id')).get()
                    .then(p => {
                        if (p.exists) {
                            let pC = p.data()['postCount'];
                            let cC = p.data()['commentCount'];
                            db.collection('Posts').doc(this.cookie.get('id')).update({
                                posts: firebase.firestore.FieldValue.arrayUnion(data),
                                postCount: pC + 1,
                                commentCount: cC + 1
                            }).then(() => {
                                document.getElementById('tags').value = ''
                                document.getElementById('posts').value = ''
                            })
                        } else {
                            db.collection('Posts').doc(this.cookie.get('id')).set({
                                posts: [data],
                                comment: [],
                                postCount: 1,
                                commentCount: 1,
                            }).then(() => {
                                document.getElementById('tags').value = ''
                                document.getElementById('posts').value = ''
                                document.getElementById('post').classList.add('w3-hide')
                                document.getElementById('curate').classList.remove('w3-hide')
                            })
                        }
                    })
            }
        }
    }

    post = (theme) => {
        if(this.cookie.get('id') !== 'anonymous'){
            return(
                <div>
                    <div className='w3-center' id='curate'>
                        <button className='w3-btn w3-round w3-margin-top' style={{ backgroundColor: theme.textColor, color: theme.color }} onClick={e=>{cu.postSigh(e,'curate')}}>Let out a Sigh</button>
                    </div>
                    <div className='w3-padding w3-card-4 w3-round w3-margin-top w3-margin-bottom w3-hide' id='post'>
                        <span className='w3-button w3-padding w3-right w3-margin-bottom' style={{backgroundColor: theme.textColor, color: theme.color}} onClick={()=>{document.getElementById('post').classList.add('w3-hide');document.getElementById('curate').classList.remove('w3-hide')}} >X</span>
                        <form className='w3-margin-top'>
                            <input className='w3-input w3-border w3-round' type='text' placeholder="Tag" id='tags' />
                            <textarea className='w3-input w3-border w3-round w3-margin-top' id='posts' placeholder="What's on your mind..."></textarea>
                            <div className=''>
                                <button className='w3-btn w3-round w3-margin-top' style={{ backgroundColor: theme.textColor, color: theme.color }}  onClick={e=>{cu.postSigh(e,'post')}}>Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
    }

    more = (pram) => {
        let check = document.getElementById(pram).classList.contains('w3-hide')
        if(check === true){
            document.getElementById(pram).classList.remove('w3-hide')
        }else if(check === false){
            document.getElementById(pram).classList.add('w3-hide')
        }
    }

    emojiSend = (e,inpId) => {
        let emoj = e.target.id
        let val = document.querySelector(`#${inpId}`).value 
        if (val) {
            document.querySelector(`#${inpId}`).value = `${document.querySelector(`#${inpId}`).value} ${document.querySelector(`#${emoj}`).innerHTML}`
        } else {
            document.querySelector(`#${inpId}`).value = document.querySelector(`#${emoj}`).innerHTML
 
        }
    }

    comment = (id,user,top,theme, ind) => {
        if(this.cookie.get('id') !== 'anonymous'){
            return (
                <form className='w3-container w3-padding' onSubmit={e => { this.sendComment(e, id, user, `inp${ind}`) }}>
                    <input className='w3-input w3-border w3-round-large' id={`inp${ind}`} name='com' placeholder='Your Opinoin' />
                    <div className='w3-row-padding'>
                        <div className='w3-col s2 m2 l2'>
                            <div className='w3-rest' style={{ cursor: 'pointer' }}><h3 id='relieved' onClick={e => this.emojiSend(e, `inp${ind}`)}>&#128524;</h3></div>
                        </div>
                        <div className='w3-col s2 m2 l2'>
                            <div className='w3-rest' style={{ cursor: 'pointer' }}><h3 id='dissapoint' onClick={e => this.emojiSend(e, `inp${ind}`)}>&#128542;</h3></div>
                        </div>
                        <div className='w3-col s2 m2 l2'>
                            <div className='w3-rest' style={{ cursor: 'pointer' }}><h3 id='worried' onClick={e => this.emojiSend(e, `inp${ind}`)}>&#128543;</h3></div>
                        </div>
                        <div className='w3-col s2 m2 l2'>
                            <div className='w3-rest' style={{ cursor: 'pointer' }}><h3 id='angry' onClick={e => this.emojiSend(e, `inp${ind}`)}>&#128545;</h3></div>
                        </div>
                        <div className='w3-col s2 m2 l2'>
                            <div className='w3-rest' style={{ cursor: 'pointer' }}><h3 id='triumph' onClick={e => this.emojiSend(e, `inp${ind}`)}>&#128548;</h3></div>
                        </div>
                        <div className='w3-col s2 m2 l2' style={{ cursor: 'pointer' }}><h3 id='hug' onClick={e => this.emojiSend(e, `inp${ind}`)}>&#129303;</h3></div>
                    </div>
                    
                    <div className='w3-center w3-hide-large w3-hide-medium'>
                        <button className='w3-btn w3-round w3-margin-top' style={{ backgroundColor: theme.textColor, color: theme.color }} >Comment</button>
                    </div>
                    <div className='w3-center w3-margin-top'>
                        <a href={`#${top}`} className='w3-text-blue w3-small w3-bold'>back to post</a>
                    </div>
                </form>
            )
        }
    }

    sendComment = (e, id, user, formId) => {
        e.preventDefault();
        let [month, date, year] = new Date().toLocaleDateString("en-US").split("/")
        let [hour, minute] = new Date().toLocaleTimeString("en-US").split(/:| /)
        console.log(document.querySelector(`#${formId}`).value)
        let data = {
            comment: document.querySelector(`#${formId}`).value,
            time: `${hour}:${minute}`,
            date: `${month}/${date}/${year}`,
            id: id,
            user: this.cookie.get('id')
        }

        db.collection('Posts').doc(user).update({
            comment: firebase.firestore.FieldValue.arrayUnion(data)
        }).then(() => {
            e.target.elements.com.value = ''
        })
    }

    themeCheck = () => {
        if (localStorage.getItem('theme') === 'light') {
            let theme = {
                name: 'Dark',
                bgColor: '#161b22',
                color: 'white',
                textColor: '#161b22'
            }
            return(theme)
        } else if (localStorage.getItem('theme') === 'dark') {
            let theme = {
                name: 'Light',
                bgColor: '#161b22',
                color: '#161b22',
                textColor: 'white'
            }
            document.body.style.backgroundColor = '#161b22';
            return(theme)
        }
    }

}

const cu = new Curate();

export { fn, cu, hm }
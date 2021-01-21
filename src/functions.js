//import { db } from './database'

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

    postQuestion = (e,pram) =>{
        e.preventDefault();
        if(pram === 'curate'){
            document.getElementById('curate').classList.add('w3-hide')
            document.getElementById('post').classList.remove('w3-hide')
        }

        if(pram === 'post'){
            e.preventDefault()
            document.getElementById('post').classList.add('w3-hide')
            document.getElementById('curate').classList.remove('w3-hide')

            let data = {
                time: `${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`,
                date: `${this.date.getMonth()}/${this.date.getDay()}/${this.date.getFullYear()}`,
                tags: document.getElementById('tags').value,
                post: document.getElementById('posts').value,
                user: this.cookie.get('id')
            }
            if(data.post !== '' && data.tags !== ''){
                db.collection('Posts').doc(this.cookie.get('id')).get()
                .then(p=>{
                    if(p.exists){
                        db.collection('Posts').doc(this.cookie.get('id')).update({
                            posts: firebase.firestore.FieldValue.arrayUnion(data),
                            comment: firebase.firestore.FieldValue.arrayUnion(data),
                            postCount: +1,
                            commentCount: +1
                        }).then(()=>{
                            document.getElementById('tags').value = ''
                            document.getElementById('posts').value = ''
                        })
                    }else{
                        console.log(data);
                        db.collection('Posts').doc(this.cookie.get('id')).set({
                            posts: [data],
                            comment: [],
                            postCount: 1,
                            commentCount: 1,
                        }).then(()=>{
                            document.getElementById('tags').value = ''
                            document.getElementById('posts').value = ''
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
                        <button className='w3-btn w3-black w3-round w3-margin-top' onClick={e=>{cu.postQuestion(e,'curate')}}>Let out a Sigh</button>
                    </div>
                    <div className='w3-padding w3-card-4 w3-round w3-margin-top w3-margin-bottom w3-hide' id='post'>
                        <span className='w3-button w3-padding w3-right w3-margin-bottom' style={{backgroundColor: theme.bgColor, color: theme.color}} onClick={()=>{document.getElementById('post').classList.add('w3-hide');document.getElementById('curate').classList.remove('w3-hide')}} >X</span>
                        <form className='w3-margin-top'>
                            <input className='w3-input w3-border w3-round' type='text' placeholder="Tags" id='tags' />
                            <textarea className='w3-input w3-border w3-round w3-margin-top' id='posts' placeholder="What's on your mind..."></textarea>
                            <div className=''>
                                <button className='w3-btn w3-black w3-round w3-margin-top'  onClick={e=>{cu.postQuestion(e,'post')}}>Send</button>
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

    comment = (id,user) => {
        if(this.cookie.get('id') !== 'anonymous'){
            return(
                <form className='w3-container w3-padding' onSubmit={e=>{this.sendComment(e,id,user)}}>
                    <input className='w3-input w3-border w3-round-large' id='com' placeholder='Your Opinoin' />
                    <div className='w3-center w3-hide-large w3-hide-medium'>
                        <button className='w3-btn w3-black w3-round w3-margin-top'>Comment</button>
                    </div>
                </form>
            )
        }
    }

    sendComment = (e,id,user) => {
        e.preventDefault();
        let data = {
            comment: e.target.elements.com.value,
            time: `${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`,
            date: `${this.date.getMonth()}/${this.date.getDay()}/${this.date.getFullYear()}`,
            id: id
        }
        db.collection('Posts').doc(user).update({
            comment: firebase.firestore.FieldValue.arrayUnion(data)
        }).then(()=>{
            e.target.elements.com.value = ''
        })
    }

}

const cu = new Curate();

export { fn, cu, hm }
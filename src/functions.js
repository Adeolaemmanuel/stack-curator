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
            console.log('yes');
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
                            })
                        }
                    }else{
                        db.collection('Admin').doc('Users').set({
                            userId: [data.username]
                        }).then(()=>{
                            this.cookie.set('id', data.username)
                            window.location.assign("/App")
                        })
                    }
                })
            })
        }
    }
}

const hm = new Home();

class Curate extends Functions {

    getTimeline = () => {
        let post = []
        db.collection('Post').doc(this.cookie.get('id')).onSnapshot(t=>{
            if(t.exists){
                post = [...t.data().posts]
            }
        })
        return post
    }

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
                post: document.getElementById('post').value
            }
            if(data.post !== '' && data.tags !== ''){
                db.collection('Post').doc(this.cookie.get('id')).get()
                .then(p=>{
                    if(p.exists){
                        db.collection('Posts').doc(this.cookie.get('id')).update({
                            posts: firebase.firestore.FieldValue.arrayUnion(data),
                            postCount: +1,
                            comment: +1
                        })
                    }else{
                        db.collection('Posts').doc(this.cookie.get('id')).set({
                            posts: [data],
                            postCount: 0,
                            comment: 0,
                        })
                    }
                })
            }
        }
    }
}

const cu = new Curate();

export { fn, cu, hm }
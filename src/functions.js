import { db, firebase } from "./database"
import { Cookies } from 'react-cookie'

class Functions {

    //Ideas jott down
    //change theme
    
    cookie = new Cookies();
    date = new Date();


    mobileSettings = (pram) =>{
        if(window.matchMedia("(max-width: 767px)").matches){
            return true
        }else{
            return false
        }
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
                    if(data.username === x.data().username && data.password === x.data().password){
                        this.cookie.set('id', data.username)
                        window.location.assign("/App")
                        if (!localStorage.getItem('theme')) {
                            localStorage.setItem('theme', 'light')
                        }
                    }
                }
            })
        }

        if(pram === 'register'){
            e.preventDefault();
            let data = {
                username: e.target.elements.rusername.value,
                password: e.target.elements.rpassword.value,
                hint: true,
                bookmarkmed: 0,
            }

            db.collection('Admin').doc('Users').get()
                .then(c => {
                    if (c.exists) {
                        let all = [...c.data().userId]
                        if (all.indexOf(data.username) === -1) {
                            db.collection('Users').doc(data.username).set(data)
                                .then(() => {
                                    db.collection('Admin').doc('Users').update({
                                        userId: firebase.firestore.FieldValue.arrayUnion(data.username)
                                    }).then(() => {
                                        this.cookie.set('id', data.username)
                                        window.location.assign("/App")
                                        localStorage.setItem('theme', 'light')
                                    })
                                })
                        }else{
                            alert('Sigher Exist')
                        }
                    }
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
    setState = (name,data) => {
        return ({[name]: data})
    }

    formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }


    postSigh = (e,pram) =>{
        e.preventDefault();
        if(pram === 'curate'){
            document.getElementById('curate').classList.add('w3-hide')
            document.getElementById('post').classList.remove('w3-hide')
        }

        if(pram === 'post'){
            e.preventDefault()
            let [month, date, year] = new Date().toLocaleDateString("en-US").split("/")


            let data = {
                time: this.formatAMPM(new Date()),
                date: `${month}/${date}/${year}`,
                tags: document.getElementById('tags').value,
                post: document.getElementById('posts').value,
                user: this.cookie.get('id'),
                comCount: 0,
                id: null
            }
            if (data.post !== '' && data.tag !== '') {
                db.collection('Sighs').doc('all').get()
                    .then(p => {
                        if (p.exists) {
                            let pC = [...p.data()['posts']].length;
                            data.id = pC + 1;
                            db.collection('Sighs').doc('all').update({
                                posts: firebase.firestore.FieldValue.arrayUnion(data),
                            }).then(() => {
                                document.getElementById('tags').value = ''
                                document.getElementById('posts').value = ''
                                document.getElementById('post').classList.add('w3-hide')
                                document.getElementById('curate').classList.remove('w3-hide')
                            })
                        } else {
                            db.collection('Sighs').doc('all').set({
                                posts: [data],
                                comment: [],
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
                            <textarea className='w3-input w3-border w3-round w3-margin-top' id='posts' onChange={e => { this.inpuctSize(e) }} placeholder="What's on your mind..."></textarea>
                            <div className='w3-center'>
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

    inputSize = (e) => {
        console.log(e.target.id)
        let id = document.querySelector(`#${e.target.id}`).value
        if (id.length === 200 && id.length !== 0) {
            document.querySelector(`#${e.target.id}`).style.height = '100px'
        }
    }

    comment = (postDetails,commentDetails,goTop,theme, ind, postSettings, state) => {
        if(this.cookie.get('id') !== 'anonymous'){
            return (
                <form className='w3-container w3-padding' onSubmit={e => { this.sendComment(e, postDetails, commentDetails,  `inp${ind}`, postSettings,state) }}>
                    <textarea className='w3-input w3-border w3-round-large' id={`inp${ind}`} name='com' placeholder='Your opinion' onChange={e => { this.inputSize(e) }} type='text'></textarea>
                    <div className='w3-row-padding'>
                        <div className='w3-col s6 m6 l6'>
                            <div className='w3-right' style={{ cursor: 'pointer' }}><h3 id='angry' className='w3-small w3-padding' style={{ color: theme.textColor }} onClick={e => this.emojiSend(e, `inp${ind}`)}>༼ つ ͠° ͟ ͟ʖ ͡° ༽つ</h3></div>
                        </div>
                        <div className='w3-col s6 m6 l6' style={{ cursor: 'pointer' }}><h3 id='hug' className='w3-small w3-padding' style={{ color: theme.textColor }} onClick={e => this.emojiSend(e, `inp${ind}`)}>(づ｡◕‿‿◕｡)づ</h3></div>
                    </div>
                    
                    <div className='w3-center'>
                        <button className='w3-btn w3-round w3-margin-top' style={{ backgroundColor: theme.textColor, color: theme.color }} >{postSettings.title}</button>
                    </div>
                    <div className='w3-center w3-margin-top'>
                        <a href={`#${goTop}`} className='w3-text-blue w3-small w3-bold'>back to sigh</a>
                    </div>
                </form>
            )
        }
    }

    sendComment = (e, postDetails, commentDetails, formId, postSettings,state) => {
        e.preventDefault();
        let [month, date, year] = new Date().toLocaleDateString("en-US").split("/")
        let data = {
            comment: document.querySelector(`#${formId}`).value,
            time: this.formatAMPM(new Date()),
            date: `${month}/${date}/${year}`,
            postId: postDetails.id,
            id: null,
            user: this.cookie.get('id')
        }
        if (postSettings.action === 'post') {
            if (data.comment !== "") {
                db.collection('Sighs').doc('all').get()
                    .then(l => {
                        let commentLength = [...l.data().comment]
                        data.id = commentLength.length + 1
                        let post = [...l.data().posts]
                        for(let p of post) {
                            if(p.id === postDetails.id){
                                p.comCount +=1
                                db.collection('Sighs').doc('all').update({
                                    posts: post
                                })
                            }
                        }
                        db.collection('Sighs').doc('all').update({
                            comment: firebase.firestore.FieldValue.arrayUnion(data)
                        }).then(() => {
                            e.target.elements.com.value = ''
                        })
                    })
            }
        } else if (postSettings.action === 'edit') {
            let comment = []
            db.collection('Sighs').doc('all').get().then(t => {
                if (t.exists) {
                    for (let p of t.data()['comment']) {
                        comment.push(p)
                        if (p.id === commentDetails.id) {
                            p.comment = data.comment
                        }
                    }
                    db.collection('Sighs').doc('all').update({ comment: comment }).then(() => {
                        e.target.elements.com.value = ''
                        state('buttonPostUpdate', { title: 'Answer their sigh', action: 'post', comId: null, user: null, ind: null })
                    })
                }
            })
        }
    }

}

const cu = new Curate();

class Bookmark extends Functions {
    bookmark = (e) => {
        e.preventDefault();
        db.collection('Admin').doc('Users').get()
        .then(u=>{
            if(u.exists) {
                let users = [...u.data().userId]
                if(users.indexOf(e.target.elements.bokMP.value) !== -1) {
                    db.collection('Bookmark').doc(this.cookies.get('id')).get()
                    .then(g=>{
                        if(g.exists) {
                            db.collection('Bookmark').doc(this.cookies.get('id')).update({
                                bookmark: firebase.firestore.FieldValue.arrayUnion(e.target.elements.bokMP.value)
                            }).then(()=>{
                                db.collection('Users').doc(e.target.elements.bokMP.value).get()
                                .then(b=>{
                                    let count = b.data().bookmarked +1
                                    db.collection('Users').doc(e.target.elements.bokMP.value)
                                    .update({bookmarked: count})
                                })
                                
                            })
                        }else {
                            db.collection('Bookmark').doc(this.cookies.get('id')).set({
                                bookmark: [e.target.elements.bokMP.value]
                            }).then(()=>{e.target.elements.bokMP.value = ""})
                        }
                    })                   
                }
            }
        })
    }
}

const bm = new Bookmark();
class Settings extends Functions {
    helpModal = (state,theme,func) => {
        if(state){
            return(
                <>
                    <div className='w3-modal' style={{display: 'block'}}>
                        <div className='w3-modal-container w3-padding' style={{ color: theme.color, backgroundColor: theme.color }}>
                            <div className='w3-padding w3-center'>
                                <span className='w3-padding w3-large w3-bold' onClick={e => func('hint',false)} style={{ color: theme.color, cursor: 'pointer', backgroundColor: theme.textColor }} >X</span>
                            </div>

                            <div className='w3-padding w3-container w3-margin-top w3-center'>
                                <h2 className='w3-center w3-margin-top w3-margin-bottom' style={{ color: theme.textColor }}>Welcome to the curators sigh</h2>
                                <p style={{ color: theme.textColor }}>This guide will help you on things you should know about this site and how you can use it effectively</p>
                                <ol style={{ color: theme.textColor }}>
                                    <li>To edit you comment double click on your comment and an option pop up menu will appear</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }
}

const st = new Settings();
export { fn, cu, hm, bm, st }
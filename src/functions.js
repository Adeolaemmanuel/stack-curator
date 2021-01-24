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
            }

            db.collection('Admin').doc('Users').get()
                .then(c => {
                    if (c.exists) {
                        let all = [c.data().userId]
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
                id: null
            }
            if (data.post !== '' && data.tag !== '') {
                db.collection('Sighs').doc('all').get()
                    .then(p => {
                        if (p.exists) {
                            let pC = [...p.data()['posts']].length;
                            data.id = pC + 1;
                            let cC = p.data()['commentCount'];
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

    inpuctSize = (e) => {
        console.log(e.target.id)
        let id = document.querySelector(`#${e.target.id}`).value
        if (id.length === 200 && id.length !== 0) {
            document.querySelector(`#${e.target.id}`).style.height = '100px'
        }
    }

    comment = (postDetails,commentDetails,goTop,theme, ind, postSettings) => {
        if(this.cookie.get('id') !== 'anonymous'){
            return (
                <form className='w3-container w3-padding' onSubmit={e => { this.sendComment(e, postDetails, commentDetails,  `inp${ind}`, postSettings) }}>
                    <textarea className='w3-input w3-border w3-round-large' id={`inp${ind}`} name='com' placeholder='Your opinion' onChange={e => { this.inpuctSize(e) }} type='text'></textarea>
                    <div className='w3-row-padding'>
                        <div className='w3-col s3 m2 l2'>
                            <div className='w3-rest' style={{ cursor: 'pointer' }}><h3 id='angry' className='w3-small' style={{ color: theme.textColor }} onClick={e => this.emojiSend(e, `inp${ind}`)}>༼ つ ͠° ͟ ͟ʖ ͡° ༽つ</h3></div>
                        </div>
                        <div className='w3-col s3 m2 l2' style={{ cursor: 'pointer' }}><h3 id='hug' className='w3-tiny' style={{ color: theme.textColor }} onClick={e => this.emojiSend(e, `inp${ind}`)}>(づ｡◕‿‿◕｡)づ</h3></div>
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

    sendComment = (e, postDetails, commentDetails, formId, postSettings) => {
        e.preventDefault();
        let [month, date, year] = new Date().toLocaleDateString("en-US").split("/")
        let [hour, minute] = new Date().toLocaleTimeString("en-US").split(/:| /)
        let data = {
            comment: document.querySelector(`#${formId}`).value,
            time: `${hour}:${minute}`,
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
                    db.collection('Sighs').doc('all').update({ comment: comment }).then(() => {})
                }
            })
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

const cu = new Curate();

export { fn, cu, hm }
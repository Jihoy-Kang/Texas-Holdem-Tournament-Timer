const firebaseConfig = {
    apiKey: "AIzaSyA6dLMgUpD9k_pOftb2Cd1JqCKaNhnR7cc",
    authDomain: "texas-holdem-timer.firebaseapp.com",
    projectId: "texas-holdem-timer",
    storageBucket: "texas-holdem-timer.appspot.com",
    messagingSenderId: "512330409634",
    appId: "1:512330409634:web:fe30a4072728479ce799fb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()


window.addEventListener('hashchange', router)
document.getElementById("stop").style.display = "none"

//변수모음

//Blind Structure
let blindList = []
let theStructure = []

//시간
let btn = false
let g_status = true
let time = 0
let blind_time = 0
let break_time = 0
let blind_time_key = ""
let break_time_key = ""
let hour = "";
let min = "";
let sec = "";

//블라인드
let level = 1
let blind = ""
let ante = ""
let break_level = 0
let total_level = 0
let sb = ""
let bb = ""
let at = ""
let n_sb = ""
let n_bb = ""
let n_at = ""


//콜백
function getData(cb){
    blindList = []
    db.collection("Blind Structure").get()
    .then((response)=>{response.forEach((doc)=>{
        blindList.push({
            id : doc.id,
            structure : doc.data()
        })
    })
    cb(blindList)
    })
}

//route
function router(){
    let routePath = location.hash;
            if (routePath == ''){
                load_list()
            } else{
                load_structure()    
            }
}
router()


function load_list(){
    let lists = []  
    getData(function(blindList){
        for(let i = 0 ; i < blindList.length ; i++){
            lists.push(` <li><a class="dropdown-item text-center" href="#${blindList[i].id}">${blindList[i].structure.title}</a></li>
            `)
        }
        lists.push('<li><a class="dropdown-item text-center" href="#" style="border-top:1px solid black"><b>Setting</b></a></li>')
        document.getElementById("setList").innerHTML = lists.join("")
    })
}


function load_structure(){
    load_list()
    let theId = location.hash.substring(1)
    getData(function(blindList){
        theStructure = blindList.find(doc => doc.id == theId)

        //블라인드
        let sb_key = 'sb'+ level
        let bb_key = 'bb'+ level
        let at_key = 'at'+ level
        let n_sb_key = 'sb'+ Number(level + 1)
        let n_bb_key = 'bb'+ Number(level + 1)
        let n_at_key = 'at'+ Number(level + 1)
        
        sb = theStructure.structure[sb_key]
        bb = theStructure.structure[bb_key]
        at = theStructure.structure[at_key]
        n_sb = theStructure.structure[n_sb_key]
        n_bb = theStructure.structure[n_bb_key]
        n_at = theStructure.structure[n_at_key]
        break_level = theStructure.structure.break_num
        total_level = theStructure.structure.level_num

        blind = Number(sb).toLocaleString() + " / " + Number(bb).toLocaleString()
        ante = Number(at).toLocaleString()
        next = Number(n_sb).toLocaleString() + " / " + Number(n_bb).toLocaleString() + "(" + Number(n_at).toLocaleString() + ")"

        document.getElementById("nav_title").innerHTML = theStructure.structure.title
        document.getElementById("level").innerHTML = 'Level' +" "+ level
        document.getElementById("blind").innerHTML = blind
        document.getElementById("ante").innerHTML = ante
        document.getElementById("next").innerHTML = next

        //시간
        blind_time_key = 'time' + level
        break_time_key = 'b_time' + level

        blind_time = theStructure.structure[blind_time_key] * 60
        break_time = theStructure.structure[break_time_key] * 60
        time = blind_time
        console.log(theStructure)
        console.log(blind_time)
        console.log(break_time)
        console.log(time)

        hour = parseInt(time/3600);
        min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
        sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
        
        document.getElementById("main_timer").innerHTML = min + ':' + sec
    })
}


function timer(){
    console.log(time)
    g_status = true
    let start = setInterval(function(){
        if(btn == true){
            hour = parseInt(time/3600);
            min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
            sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
            time --;

            document.getElementById("main_timer").innerHTML = min + ':' + sec ;
            document.getElementById("play").style.display = "none"
            document.getElementById("stop").style.display = "block"

        } else{
            clearInterval(start)
            document.getElementById("play").style.display = "block"
            document.getElementById("stop").style.display = "none"
        }

        if(time < 0 && level % break_level != 0 ){
            level ++
            blind_time_key = 'time' + level
            time = theStructure.structure[blind_time_key] * 60
            
        }

        if(time < 0 && level % break_level == 0 ){
            clearInterval(start)
            break_time_key = 'b_time' + level
            time = theStructure.structure[break_time_key] * 60
            b_timer()
        }

    },1000)
}

function b_timer(){
    console.log(time)
    g_status = false
    let b_start = setInterval(function(){
        if(btn == true){
            hour = parseInt(time/3600);
            min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
            sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
            time --;

            document.getElementById("main_timer").innerHTML = min + ':' + sec ;
            document.getElementById("play").style.display = "none"
            document.getElementById("stop").style.display = "block"

        } else{
            clearInterval(start)
            document.getElementById("play").style.display = "block"
            document.getElementById("stop").style.display = "none"
        }

        if(time < 0){
            level++
            clearInterval(b_start)
            timer()
        }
    },1000)
}

function play(){
    btn = true
    timer()
}

function stop(){
    btn = false
}

function reset(){

}
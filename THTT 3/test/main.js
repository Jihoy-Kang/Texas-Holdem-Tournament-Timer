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
let beep = new Audio('beep.wav') 


//시간
let btn = false
let blind_break_status = true
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
let num = level
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
        lists.push('<li><a class="dropdown-item text-center" href="./blind Structure/blind_structure.html" style="border-top:1px solid black"><b>Setting</b></a></li>')
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

        hour = parseInt(time/3600);
        min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
        sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
        
        document.getElementById("main_timer").innerHTML = min + ':' + sec
    })
}



function change_structure(){
    let theId = location.hash.substring(1)
    getData(function(blindList){
        let sb_key = 'sb'+ level
        let bb_key = 'bb'+ level
        let at_key = 'at'+ level
        let n_sb_key = 'sb'+ Number(level + 1)
        let n_bb_key = 'bb'+ Number(level + 1)
        let n_at_key = 'at'+ Number(level + 1)
                
        theStructure = blindList.find(doc => doc.id == theId)
        
        let sb = theStructure.structure[sb_key]
        let bb = theStructure.structure[bb_key]
        let at = theStructure.structure[at_key]
        let n_sb = theStructure.structure[n_sb_key]
        let n_bb = theStructure.structure[n_bb_key]
        let n_at = theStructure.structure[n_at_key]
        blind = Number(sb).toLocaleString() + " / " + Number(bb).toLocaleString()
        ante = Number(at).toLocaleString()
        next = Number(n_sb).toLocaleString() + " / " + Number(n_bb).toLocaleString() + "(" + Number(n_at).toLocaleString() + ")"

        document.getElementById("level").innerHTML = 'Level' +" "+ level
        document.getElementById("blind").innerHTML = blind
        document.getElementById("ante").innerHTML = ante
        document.getElementById("next").innerHTML = next

        
    })
}

let break_starter = false
function timer(){
    blind_break_status = true
    let start = setInterval(function(){
        num = level
        if(btn == true){
            min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
            sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
            time --;

            document.getElementById("main_timer").innerHTML = min + ':' + sec ;
            document.getElementById("play").style.display = "none"
            document.getElementById("stop").style.display = "block"

            if(time == blind_time-1){
                change_structure()
            }

            if(time < 5){
                document.getElementById("main_timer").style.color = "red"
                beep.play()
            }else{
                document.getElementById("main_timer").style.color = "white"
            }
    
            if(time < 0 && level % break_level != 0 ){
                level ++
                blind_time_key = 'time' + level
                blind_time = theStructure.structure[blind_time_key] * 60
                time = theStructure.structure[blind_time_key] * 60
            }
    
            if(time < 0 && level % break_level == 0 ){
                break_starter = true
                console.log("브레이크 on")
            }

            if(break_starter == true){
                clearInterval(start)
                break_time_key = 'b_time' + level
                break_time = theStructure.structure[break_time_key] * 60
                time = theStructure.structure[break_time_key] * 60
                b_timer()
            }
    
            

        } else{
            clearInterval(start)
            document.getElementById("play").style.display = "block"
            document.getElementById("stop").style.display = "none"
        }

    },1000)
}

function b_timer(){
    blind_break_status = false
    
    let b_start = setInterval(function(){
        if(btn == true){
            min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
            sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
            time --;

            document.getElementById("main_timer").innerHTML = min + ':' + sec ;
            document.getElementById("play").style.display = "none"
            document.getElementById("stop").style.display = "block"

            if(time == break_time-1){
                document.getElementById("level").innerHTML = 'Break'
            }

            if(time < 5){
                document.getElementById("main_timer").style.color = "red"
            }else{
                document.getElementById("main_timer").style.color = "white"
            }
            
            if(time < 0){
                break_starter = false
                console.log("브레이크 off")
            }

            if(break_starter == false){
                clearInterval(b_start)
                level++
                blind_time_key = 'time' + level
                blind_time = theStructure.structure[blind_time_key] * 60
                time = theStructure.structure[blind_time_key] * 60
                timer()
            }
            

        } else{
            clearInterval(start)
            document.getElementById("play").style.display = "block"
            document.getElementById("stop").style.display = "none"
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
    if(blind_break_status = true){
        time = theStructure.structure[blind_time_key] * 60
    }else{
        time = theStructure.structure[break_time_key] * 60    
        
    }
    
    if(btn == false){
        min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
        sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
        document.getElementById("main_timer").style.color = "white"
        document.getElementById("main_timer").innerHTML = min + ':' + sec
    }
}


//Setting

//setting area
let buy_in_chip = 0
let Re_buy_in_chip = 0
let add_on_chip = 0
let buy_in_cash = 0
let Re_buy_in_cash = 0
let add_on_cash = 0
let first_prize_pct = 0
let second_prize_pct = 0
let third_prize_pct = 0
let total_prize_pct = 0
let fourth_prize_pct = 0
let fifth_prize_pct = 0
let sixth_prize_pct = 0
let seventh_prize_pct = 0
let eighth_prize_pct = 0
let ninth_prize_pct = 0
let totalCash = 0



function level_plus(){
    num = num + 1
    
    if(num != 1 && num%break_level == 1){
        console.log("휴식")
        console.log("num" + num)
        document.getElementById("level").innerHTML = 'Break'
        break_starter = true
        console.log("브레이크 on")

        break_time_key = 'b_time' + level
        time = theStructure.structure[break_time_key] * 60
    }else{
        level = level +1
        num = level
        break_starter = false
        console.log("브레이크 off")

        console.log("플레이")
        console.log("num" + num)
        console.log("레벨" + level)

        
        blind_time_key = 'time' + level
        time = theStructure.structure[blind_time_key] * 60
        document.getElementById("level").innerHTML = 'Level' +" "+ level
        change_structure()
    }
    
    min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
    sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);

    document.getElementById("main_timer").innerHTML = min + ':' + sec ;

}

function level_minus(){
    num = num - 1 <= 1 ? 1 : num -1

    if(num%break_level == 0){
        level = level -1 <= 1 ? 1 : level -1
        break_starter = true
        console.log("브레이크 on")


        console.log("휴식")
        console.log("num" + num)
        console.log("레벨" + level)

        break_time_key = 'b_time' + level
        time = theStructure.structure[break_time_key] * 60
        document.getElementById("level").innerHTML = 'Break'
    }else{
        level = level -1 <= 1 ? 1 : level -1
        break_starter = false
        console.log("브레이크 off")

        console.log("플레이")
        console.log("num" + num)
        console.log("레벨" + level)

        
        blind_time_key = 'time' + level
        time = theStructure.structure[blind_time_key] * 60
        document.getElementById("level").innerHTML = 'Level' +" "+ level
        change_structure()
    }
    
    min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
    sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);

    document.getElementById("main_timer").innerHTML = min + ':' + sec ;
}
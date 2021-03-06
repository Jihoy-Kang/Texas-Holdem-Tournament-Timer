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
let break_starter = false
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
let level_btn_click = level
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
            lists.push(` <li><a class="dropdown-item text-center" href="#/structure/${blindList[i].id}">${blindList[i].structure.title}</a></li>
            `)
        }
        lists.push('<li><a class="dropdown-item text-center" href="./blind Structure/blind_structure.html" style="border-top:1px solid black"><b>Setting</b></a></li>')
        document.getElementById("setList").innerHTML = lists.join("")
    })
}


function load_structure(){
    load_list()
    let theId = location.hash.substring(12)
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

        /* document.getElementById("nav_title").innerHTML = theStructure.structure.title */
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
    let theId = location.hash.substring(12)
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

        
        document.getElementById("blind").innerHTML = blind
        document.getElementById("ante").innerHTML = ante
        document.getElementById("next").innerHTML = next

        
    })
}


function timer(){
    blind_break_status = true
    let start = setInterval(function(){
        level_btn_click = level
        if(btn == true){
            min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
            sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
            time --;

            document.getElementById("main_timer").innerHTML = min + ':' + sec ;
            document.getElementById("play").style.display = "none"
            document.getElementById("stop").style.display = "block"

            if(time == blind_time-1){
                change_structure()
                document.getElementById("level").innerHTML = 'Level' +" "+ level
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
    console.log("블라인드타이머")
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

            if(time < 5){
                document.getElementById("main_timer").style.color = "red"
                beep.play()
            }else{
                document.getElementById("main_timer").style.color = "white"
            }
            if(time == break_time-1){
                document.getElementById("level").innerHTML = 'Break'
            }
            if(time < 0){
                break_starter = false
                level++
                
            }

            if(break_starter == false){
                clearInterval(b_start)
                blind_time_key = 'time' + level
                blind_time = theStructure.structure[blind_time_key] * 60
                time = theStructure.structure[blind_time_key] * 60
                timer()
            }

        } else{
            clearInterval(b_start)
            document.getElementById("play").style.display = "block"
            document.getElementById("stop").style.display = "none"
        }
        
    },1000)
    console.log("브레이크타이머")
}

function play(){
    let routePath = location.hash;
    if(routePath.indexOf("structure") != -1){
        btn = true
    timer()
    }
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

function set_button(){
    buy_in_chip = Number(document.getElementById("buy_in_chip").value)
    Re_buy_in_chip = Number(document.getElementById("Re_buy_in_chip").value)
    add_on_chip = Number(document.getElementById("add_on_chip").value)
    buy_in_cash = Number(document.getElementById("buy_in_cash").value)
    Re_buy_in_cash = Number(document.getElementById("Re_buy_in_cash").value)
    add_on_cash = Number(document.getElementById("add_on_cash").value)
    first_prize_pct = Number(document.getElementById("first_prize").value)
    second_prize_pct = Number(document.getElementById("second_prize").value)
    third_prize_pct = Number(document.getElementById("third_prize").value)
    fourth_prize_pct = Number(document.getElementById("fourth_prize").value)
    fifth_prize_pct = Number(document.getElementById("fifth_prize").value)
    sixth_prize_pct = Number(document.getElementById("sixth_prize").value)
    /* seventh_prize_pct = Number(document.getElementById("seventh_prize").value)
    eighth_prize_pct = Number(document.getElementById("eighth_prize").value)
    ninth_prize_pct = Number(document.getElementById("ninth_prize").value) */
    total_prize_pct = first_prize_pct+second_prize_pct+third_prize_pct+fourth_prize_pct+fifth_prize_pct+sixth_prize_pct/* +seventh_prize_pct+eighth_prize_pct+ninth_prize_pct */


    document.getElementById("show_buy_in_chip").innerHTML = buy_in_chip.toLocaleString() 
    document.getElementById("show_Re_buy_in_chip").innerHTML = Re_buy_in_chip.toLocaleString() 
    document.getElementById("show_add_on_chip").innerHTML = add_on_chip.toLocaleString() 
/*     document.getElementById("show_first_prize").innerHTML = first_prize_pct +'%'
    document.getElementById("show_second_prize").innerHTML = second_prize_pct +'%'
    document.getElementById("show_third_prize").innerHTML = third_prize_pct +'%' */

    cash_update()
}


//status area

let entries = 0
let players = 0
let rebuys = 0
let addons = 0
let total_chips = 0
let avg_chips = 0
let total_cash= 0
let extra_chip = 0
let extra_cash = 0

function entries_plus(){
    entries = entries +1
    players = players +1 
    console.log("엔트리" + entries)

    document.getElementById("player_num").innerHTML = players + "/" + entries 
    document.getElementById("player_num_bottom").innerHTML = players + "/" + entries
    cash_update()
    chip_update()
}


function entries_minus(){
    entries = entries -1  <= 0 ? 0 : entries -1
    players = players -1 <= 0 ? 0 : players -1
    console.log("엔트리" + entries)
    document.getElementById("player_num").innerHTML = players + "/" + entries 
    document.getElementById("player_num_bottom").innerHTML = players + "/" + entries
    cash_update()
    chip_update()
}
function players_plus(){
    players = players +1 >= entries ? entries : players +1

    console.log("플레이어" + players)
    document.getElementById("player_num").innerHTML = players + "/" + entries 
    document.getElementById("player_num_bottom").innerHTML = players + "/" + entries
    cash_update()
    chip_update()
}
function players_minus(){
    players = players -1 <= 0 ? 0 : players -1

    console.log("플레이어" + players)
    document.getElementById("player_num").innerHTML = players + "/" + entries 
    document.getElementById("player_num_bottom").innerHTML = players + "/" + entries
    cash_update()
    chip_update()
}

function rebuys_plus(){
    rebuys = rebuys +1
    console.log("리바이인" + rebuys)
    document.getElementById("re_buy").innerHTML = rebuys
    cash_update()
    chip_update()
}

function rebuys_minus(){
    rebuys = rebuys -1 <= 0 ? 0 : rebuys -1
    console.log("리바이인" + rebuys)

    document.getElementById("re_buy").innerHTML = rebuys
    cash_update()
    chip_update()
}

function addons_plus(){
    addons = addons +1
    console.log("에드온" + addons)
    document.getElementById("add_on").innerHTML = addons
    cash_update()
    chip_update()
}

function addons_minus(){
    addons = addons -1 <= 0 ? 0 : addons -1
    console.log("에드온" + addons)

    document.getElementById("add_on").innerHTML = addons
    cash_update()
    chip_update()
}



function level_plus(){
    level_btn_click = level_btn_click + 1

    if(break_starter == true && level_btn_click%break_level == 1){
        break_starter = false
        level = level +1

        blind_time_key = 'time' + level
        console.log("키"+blind_time_key)
        time = theStructure.structure[blind_time_key] * 60
        console.log("시간"+time)
        document.getElementById("level").innerHTML = 'Level' +" "+ level
        change_structure()

    }else if(break_starter == false && level_btn_click != 1 && level_btn_click%break_level == 1){
        break_starter = true
        break_time_key = 'b_time' + level
        time = theStructure.structure[break_time_key] * 60
        document.getElementById("level").innerHTML = 'Break'
    }else{
        level = level +1
        level_btn_click = level
        break_starter = false
        blind_time_key = 'time' + level
        time = theStructure.structure[blind_time_key] * 60
        document.getElementById("level").innerHTML = 'Level' +" "+ level
        change_structure()
    }

    min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
    sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);

    document.getElementById("main_timer").innerHTML = min + ':' + sec ;
    console.log("레벨",level)
    console.log("num",level_btn_click)
    console.log(break_starter)
}

function level_minus(){
    /* level = level_btn_click */
    level_btn_click = level_btn_click - 1 <= 1 ? 1 : level_btn_click -1
    
    if(break_starter == true && level_btn_click%break_level == 0){
        break_starter = false
        blind_time_key = 'time' + level
        time = theStructure.structure[blind_time_key] * 60

        change_structure()
        document.getElementById("level").innerHTML = 'Level' +" "+ level

    }else if(break_starter == false && level_btn_click%break_level == 0){
        level = level -1 <= 1 ? 1 : level -1
        break_starter = true
        

        break_time_key = 'b_time' + level_btn_click
        time = theStructure.structure[break_time_key] * 60

        
        document.getElementById("level").innerHTML = 'Break'
        change_structure()

    }else if(break_starter == true){
        level_btn_click = level
        break_starter = false

        blind_time_key = 'time' + level
        time = theStructure.structure[blind_time_key] * 60

        change_structure()
        document.getElementById("level").innerHTML = 'Level' +" "+ level
    }else{
        level = level -1 <= 1 ? 1 : level -1
        level_btn_click = level
        break_starter = false
        

        blind_time_key = 'time' + level
        time = theStructure.structure[blind_time_key] * 60

        change_structure()
        document.getElementById("level").innerHTML = 'Level' +" "+ level
    }
    min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
    sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);

    document.getElementById("main_timer").innerHTML = min + ':' + sec ;
    console.log("레벨",level)
    console.log("num",level_btn_click)
    console.log(break_starter)
}



function chip_in(){
    extra_chip = extra_chip + Number(document.getElementById("extra_chip").value)
    console.log("추가",extra_chip)
    document.getElementById("extra_chip").value = ""
    chip_update()
}
function chip_out(){
    extra_chip = extra_chip - Number(document.getElementById("extra_chip").value)
    console.log("추가",extra_chip)
    document.getElementById("extra_chip").value = ""
    chip_update()
}

function cash_in(){
    extra_cash += Number(document.getElementById("extra_cash").value)
    console.log("추가",extra_cash)
    document.getElementById("extra_cash").value = ""
    cash_update()
}

function cash_out(){
    extra_cash -= Number(document.getElementById("extra_cash").value)
    console.log("추가",extra_cash)
    document.getElementById("extra_cash").value = ""
    cash_update()
}

function cash_update(){
    totalPrize = ((buy_in_cash * entries) + (Re_buy_in_cash*rebuys) + (add_on_cash*addons) + extra_cash)*(total_prize_pct/100)
    document.getElementById("total_prize").innerHTML = totalPrize.toLocaleString()

    totalCash = (buy_in_cash * entries) + (Re_buy_in_cash*rebuys) + (add_on_cash*addons) + extra_cash
    document.getElementById("total_cash_bottom").innerHTML = totalCash.toLocaleString()

    let first_prize = totalCash * (first_prize_pct / 100) 
    let second_prize = totalCash * (second_prize_pct / 100)
    let third_prize = totalCash * (third_prize_pct / 100)
    let fourth_prize = totalCash * (fourth_prize_pct / 100)
    let fifth_prize = totalCash * (fifth_prize_pct / 100)
    let sixth_prize = totalCash * (sixth_prize_pct / 100)
    let seventh_prize = totalCash * (seventh_prize_pct / 100)
    let eighth_prize = totalCash * (eighth_prize_pct / 100)
    let ninth_prize = totalCash * (ninth_prize_pct / 100)

    document.getElementById("top_first_prize").innerHTML = first_prize.toLocaleString()
    document.getElementById("top_second_prize").innerHTML = second_prize.toLocaleString()
    document.getElementById("top_third_prize").innerHTML = third_prize.toLocaleString()
    document.getElementById("top_fourth_prize").innerHTML = fourth_prize.toLocaleString()
    document.getElementById("top_fifth_prize").innerHTML = fifth_prize.toLocaleString()
    document.getElementById("top_sixth_prize").innerHTML = sixth_prize.toLocaleString()
   /*  document.getElementById("top_seventh_prize").innerHTML = seventh_prize.toLocaleString()
    document.getElementById("top_eighth_prize").innerHTML = eighth_prize.toLocaleString()
    document.getElementById("top_ninth_prize").innerHTML = ninth_prize.toLocaleString() */

}

function chip_update(){
    let totalChips = (buy_in_chip * entries) + (Re_buy_in_chip*rebuys) + (add_on_chip*addons) + extra_chip
    avgChips = totalChips == 0 && players == 0 ? 0 : totalChips / players

    document.getElementById("avg_chips").innerHTML = Math.ceil(avgChips).toLocaleString()
    document.getElementById("avg_chips_bottom").innerHTML = Math.ceil(avgChips).toLocaleString()
    document.getElementById("total_chips").innerHTML = totalChips.toLocaleString()

}

set_button()


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

document.getElementById("stop").style.display = "none"

let time = 0
let btn = false
let hour = "";
let min = "";
let sec = "";
let g_status = true



//Blind Structure
let theStructure = []
let blindList = []

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
window.addEventListener('hashchange', router)

function router(){
    let routePath = location.hash;
            if (routePath == ' '){
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
            console.log(blindList[i].structure.title)
            lists.push(` <li><a class="dropdown-item text-center" href="#${blindList[i].id}">${blindList[i].structure.title}</a></li>
            `)
        }
        lists.push('<li><a class="dropdown-item text-center" href="#" style="border-top:1px solid black"><b>Setting</b></a></li>')
        document.getElementById("setList").innerHTML = lists.join("")
    })
}

let level = 1
let blind = ""
let ante = ""
function load_structure(){
    load_list()
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

        document.getElementById("nav_title").innerHTML = theStructure.structure.title
        document.getElementById("level").innerHTML = 'Level' +" "+ level
        document.getElementById("blind").innerHTML = blind
        document.getElementById("ante").innerHTML = ante
        document.getElementById("next").innerHTML = next

        let blind_time_key = 'time' + level

        let time = theStructure.structure[blind_time_key] /* * 60 */

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
//Timer


function play(){
    btn = true
    console.log(btn)
    timer()
}

function stop(){
    btn = false
    console.log(btn)
}

function reset(){
    let theId = location.hash.substring(1)
    hour = parseInt(time/3600);
    min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
    sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
    getData(function(blindList){
        theStructure = blindList.find(doc => doc.id == theId)

        let blind_time_key = 'time' + level
        let break_time_key = 'b_time' + level
        let break_time = theStructure.structure[break_time_key]  * 60 
        let blind_time = theStructure.structure[blind_time_key]  * 60 
        

    if(g_status == true){
        time = blind_time
        console.log("블라인드" + time)
        
    }else{
        console.log("브레이크" + time)
        time = break_time
    }
    setTimeout(() => {
        document.getElementById("main_timer").innerHTML = min + ':' + sec ;
    },500);
    })
}


function timer(){
    g_status = true
    let theId = location.hash.substring(1)
    getData(function(blindList){
        theStructure = blindList.find(doc => doc.id == theId)

        let blind_time_key = 'time' + level
        let blind_time = theStructure.structure[blind_time_key]  /* * 60 */ 
        time = blind_time
        let break_level = theStructure.structure.break_num
        console.log(theStructure)
        console.log(break_level)
    
        
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
                time = blind_time
                
            }

            if(time < 0 && level % break_level == 0 ){
                clearInterval(start)
                b_timer()
            }

            if(time == blind_time-1){
                change_structure()
            }


        },1000)
        
        
    })
}

function b_timer(){
    g_status = false
    let theId = location.hash.substring(1)
    getData(function(blindList){
        theStructure = blindList.find(doc => doc.id == theId)

        let break_time_key = 'b_time' + level
        let break_time = theStructure.structure[break_time_key]  /* * 60 */ 
        time = break_time
        console.log(time)
        
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
                clearInterval(b_start)
                document.getElementById("play").style.display = "block"
                document.getElementById("stop").style.display = "none"
            }
            

            if(time < 0){
                level++
                clearInterval(b_start)
                timer()
                
            }
        },1000)
    })
    document.getElementById("level").innerHTML = 'Break'
}


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
let totalPrize = 0
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
    total_prize_pct = first_prize_pct + second_prize_pct + third_prize_pct



    document.getElementById("show_buy_in_chip").innerHTML = buy_in_chip.toLocaleString() 
    document.getElementById("show_Re_buy_in_chip").innerHTML = Re_buy_in_chip.toLocaleString() 
    document.getElementById("show_add_on_chip").innerHTML = add_on_chip.toLocaleString() 
    document.getElementById("show_first_prize").innerHTML = first_prize_pct +'%'
    document.getElementById("show_second_prize").innerHTML = second_prize_pct +'%'
    document.getElementById("show_third_prize").innerHTML = third_prize_pct +'%'

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
    level = level +1
    console.log("레벨" + level)
    document.getElementById("level").innerHTML = 'Level' +" "+ level
    change_structure()
}

function level_minus(){
    level = level -1 <= 1 ? 1 : level -1
    console.log("레벨" + level)
    document.getElementById("level").innerHTML = 'Level' +" "+ level
    change_structure()
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

    document.getElementById("top_first_prize").innerHTML = first_prize.toLocaleString()
    document.getElementById("top_second_prize").innerHTML = second_prize.toLocaleString()
    document.getElementById("top_third_prize").innerHTML = third_prize.toLocaleString()
}

function chip_update(){
    let totalChips = (buy_in_chip * entries) + (Re_buy_in_chip*rebuys) + (add_on_chip*addons) + extra_chip
    avgChips = totalChips == 0 && players == 0 ? 0 : totalChips / players

    document.getElementById("avg_chips").innerHTML = avgChips.toLocaleString()
    document.getElementById("avg_chips_bottom").innerHTML = avgChips.toLocaleString()
    document.getElementById("total_chips").innerHTML = totalChips.toLocaleString()

}

set_button()
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
let level = 1
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
}

function level_minus(){
    level = level -1 <= 1 ? 1 : level -1
    console.log("레벨" + level)
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
    console.log("총 바이인 : " + total_cash)
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
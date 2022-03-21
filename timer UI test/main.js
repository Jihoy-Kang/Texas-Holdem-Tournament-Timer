/* 개선사항
1. Reset 버튼 -> 브레이크일때 브레이크 리셋 / 블라인드일때 블라인드 리셋
2. 블라인드 테이블
3. 프라이즈 자동 변경
4. 시작 전 시간 반영
 */



//변동값
const blind_time = 360
const break_time = 300
const break_level = 5
const next_break = (blind_time*break_level)
let time = blind_time
let b_time = break_time
let break_remaining = next_break

let entry_cost = 50000
let reBuy_cost = 50000
let addon_cost = 50000
let start_chips = 40000
let reBuy_chips = 50000
let addon_chips = 100000
let prize_percentage = 0.8


let level = 1
let sb = 100
let bb = 200

let entries = 0
let players = 0
let reBuys = 0
let addons = 0
let totalChips = 0
let avgChips = 0
let totalPrize = 0


let btn = false
let hour = "";
let min = "";
let sec = "";
let b_hour = "";
let b_min = "";
let b_sec = "";

document.getElementById("stop").style.display = "none"

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
    if(level%break_level != 0){
        time = blind_time
        break_remaining = next_break
    }else{
        break_remaining = next_break + break_time
        b_time = break_time
    }
}


function timer(){
    let start = setInterval(function(){
        if(btn == true){
            hour = parseInt(time/3600);
            min = parseInt(time/60) % 60 < 10 ? '0' + parseInt(time/60) % 60 : parseInt(time/60) % 60;
            sec = parseInt(time%60) < 10 ? '0' + parseInt(time%60) : parseInt(time%60);
    
            b_hour = parseInt(break_remaining/3600);
            b_min = parseInt(break_remaining/60) % 60 < 10 ? '0' + parseInt(break_remaining/60) % 60 : parseInt(break_remaining/60) % 60;
            b_sec = parseInt(break_remaining%60) < 10 ? '0' + parseInt(break_remaining%60) : parseInt(break_remaining%60);
    
    
            document.getElementById("play").style.display = "none"
            document.getElementById("stop").style.display = "block"
    
            document.getElementById("level").innerHTML = "LEVEL" + " "+ level
            document.getElementById("timer").innerHTML = min + ':' + sec ;
            document.getElementById("break_time").innerHTML = b_hour + ":" + b_min + ":" + b_sec ;
    
            time --;
            break_remaining --;
        } else{
            clearInterval(start)
            document.getElementById("play").style.display = "block"
            document.getElementById("stop").style.display = "none"
        }
    
        if(time <= 0){
            level++
            time = blind_time
        }
    
        if(break_remaining <= 0){
            clearInterval(start)
            break_remaining = next_break + break_time
            b_time = break_time
            break_timer()
        }
    }, 1000);
}

function break_timer(){
    let _break = setInterval(function(){
        if(btn == true){

            hour = parseInt(b_time/3600);
            min = parseInt(b_time/60) % 60 < 10 ? '0' + parseInt(b_time/60) % 60 : parseInt(b_time/60) % 60;
            sec = parseInt(b_time%60) < 10 ? '0' + parseInt(b_time%60) : parseInt(b_time%60);

            b_hour = parseInt(break_remaining/3600);
            b_min = parseInt(break_remaining/60) % 60 < 10 ? '0' + parseInt(break_remaining/60) % 60 : parseInt(break_remaining/60) % 60;
            b_sec = parseInt(break_remaining%60) < 10 ? '0' + parseInt(break_remaining%60) : parseInt(break_remaining%60);


            document.getElementById("play").style.display = "none"
            document.getElementById("stop").style.display = "block"

            document.getElementById("level").innerHTML = "LEVEL" + " "+ level
            document.getElementById("timer").innerHTML = min + ':' + sec ;
            document.getElementById("break_time").innerHTML = b_hour + ":" + b_min + ":" + b_sec ;

            b_time --;
            break_remaining --;
        } else{
            clearInterval(_break)
            document.getElementById("play").style.display = "block"
            document.getElementById("stop").style.display = "none"
        }

        if(b_time <= 0){
            clearInterval(_break)
            time = blind_time
            timer()
        }
    },1000)
}





//button

function entries_plus(){
    entries = entries +1
    players = players +1 
    console.log("엔트리" + entries)

    document.getElementById("player_num").innerHTML = players + "/" + entries 
    document.getElementById("player_num_bottom").innerHTML = players + "/" + entries
    prize_update()
    chip_update()

}


function entries_minus(){
    entries = entries -1  <= 0 ? 0 : entries -1
    players = players -1 <= 0 ? 0 : players -1
    console.log("엔트리" + entries)
    document.getElementById("player_num").innerHTML = players + "/" + entries 
    document.getElementById("player_num_bottom").innerHTML = players + "/" + entries
    prize_update()
    chip_update()

}
function players_plus(){
    players = players +1 >= entries ? entries : players +1

    console.log("플레이어" + players)
    document.getElementById("player_num").innerHTML = players + "/" + entries 
    document.getElementById("player_num_bottom").innerHTML = players + "/" + entries
    chip_update()
}
function players_minus(){
    players = players -1 <= 0 ? 0 : players -1

    console.log("플레이어" + players)
    document.getElementById("player_num").innerHTML = players + "/" + entries 
    document.getElementById("player_num_bottom").innerHTML = players + "/" + entries
    chip_update()
}
function rebuys_plus(){
    reBuys = reBuys +1
    console.log("리바이인" + reBuys)
    document.getElementById("re_buy").innerHTML = reBuys
    prize_update()
    chip_update()


}
function rebuys_minus(){
    reBuys = reBuys -1 <= 0 ? 0 : reBuys -1
    console.log("리바이인" + reBuys)

    document.getElementById("re_buy").innerHTML = reBuys
    prize_update()
    chip_update()
}
function addons_plus(){
    addons = addons +1
    console.log("에드온" + addons)
    document.getElementById("add_on").innerHTML = addons
    prize_update()
    chip_update()

}
function addons_minus(){
    addons = addons -1 <= 0 ? 0 : addons -1
    console.log("에드온" + addons)

    document.getElementById("add_on").innerHTML = addons
    prize_update()
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



function prize_update(){
    console.log("상금 : " + totalPrize)
    totalPrize = ((entry_cost * entries) + (reBuy_cost*reBuys) + (addon_cost*addons))*prize_percentage
    document.getElementById("total_prize").innerHTML = totalPrize.toLocaleString()
    document.getElementById("total_prize_bottom").innerHTML = totalPrize.toLocaleString()
}

function chip_update(){
    totalChips = ((start_chips * entries) + (reBuy_chips*reBuys) + (addon_chips*addons))
    avgChips = totalChips/players

    document.getElementById("avg_chips").innerHTML = avgChips.toLocaleString()
    document.getElementById("avg_chips_bottom").innerHTML = avgChips.toLocaleString()
    document.getElementById("total_chips").innerHTML = avgChips.toLocaleString()

}
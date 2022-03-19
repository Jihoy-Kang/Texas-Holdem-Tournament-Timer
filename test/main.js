let time = 3600;
let hour = "";
let min = "";
let sec = "";
let level = 1

function timer(){
    hour = parseInt(time/3600)
    min = parseInt(time/60) % 60
    sec = parseInt(time%60);

    document.getElementById("level").innerHTML = level
    document.getElementById("timer").innerHTML =hour + '시' + min + '분' + sec + "초";
    time --;

    if (time < 0){
        level ++
        clearInterval(timer)
    }
}

function play(){
    let start = setInterval(timer,1000)
        
}


function stop(){
    clearInterval(timer)
}

let btn = false
let time = 5;
let hour = "";
let min = "";
let sec = "";
let level = 1
let start = setInterval(timer, 1000);


function timer(){
    if(btn == true){
        hour = parseInt(time/3600)
        min = parseInt(time/60) % 60
        sec = parseInt(time%60);

        document.getElementById("level").innerHTML = level
        document.getElementById("timer").innerHTML =hour + '시' + min + '분' + sec + "초";
        time --;
    } else{
        clearInterval(start)
    }

    if(time < 0){
        level++
        time = 5
    }

}


function play(){
    btn = true
    start = setInterval(timer, 1000)
    console.log(btn)
}

function stop(){
    btn = false
    console.log(btn)
}




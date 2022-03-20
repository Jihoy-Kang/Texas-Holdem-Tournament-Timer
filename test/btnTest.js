let click = false;
let seconds = 0

let timer = setInterval(() => {
    if(click == true){
        seconds ++
        document.getElementById("timer").innerHTML = seconds
    }else{
        clearInterval(timer)
    }
    
}, 1000);

function play(){
    click = true
    timer = setInterval(() => {
        if(click == true){
            seconds ++
            document.getElementById("timer").innerHTML = seconds
        }else{
            clearInterval(timer)
        }
        
    }, 1000);  
}

function stop(){
    click = false
}
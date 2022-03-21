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


let dataList = []
let list_template = ""
db.collection('Blind Structure')
    .get()
    .then((response)=>{
        response.forEach((doc)=>{
            dataList.push({
                id : doc.id,
                other : doc.data(),
            })
        })
        console.log(dataList)
        for(let i = 0 ; i < dataList.length ;i++){
            list_template += `<div>${dataList[i].other.title}</div>`
        }
        
        document.getElementById("structure_list").innerHTML = list_template
    })
    .catch((error) => {
        console.log("Error onLoadData documents:", error);
    })

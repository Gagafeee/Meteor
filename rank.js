import {getScores} from "./database.js";

export function Init(){
    document.getElementById("return-button").addEventListener("click", ()=>{
        window.location = "./index.html"
    })
    var mainContainer = document.getElementById("main-content");
    getScores()
    .then((userList)=>{
        userList.forEach((user)=>{
            //for each user
            const card = document.createElement("div");
                card.className = "card"
                card.style.order = (user.val().score*-1)
                const content = document.createElement("div");
                content.className = "content"
                    const username = document.createElement("p");
                        username.className = "username";
                        username.innerText = user.key;
                        content.appendChild(username);
                    const date = document.createElement("p");
                        date.className = "date";
                        date.innerText = (new Date(user.val().date)).toString();//decode require
                        content.appendChild(date);
                    card.appendChild(content);
                const score = document.createElement("p");
                score.className = "score";
                score.innerText = user.val().score + "pts";
                card.appendChild(score);

            mainContainer.appendChild(card);
        })
        mainContainer.querySelector("img").remove()
    })
    .catch((err)=>{

    })
}
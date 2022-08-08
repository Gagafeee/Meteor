var globalSpeed = 3;
var player = document.getElementById("player");
var game_content = document.getElementById("game-content");
var deadPanel = document.getElementById("dead-panel");
var difficulty = 10;
var pgenerated = document.getElementById("generated-planete");
var scoreDisplay = document.getElementById("score-displayer");
var score = 0;

import { saveScore } from "./database.js"

export function Load() {
    var scoreTitle = document.getElementById("score");
    var playButton = document.getElementById("play");
    var rankButton = document.getElementById("ranking");
    scoreTitle.innerText = "Last Score : " + (getCookie("score") != "" ? getCookie("score") : 0)
    if (getCookie("score") == 0) {
        document.getElementById("sharebutton").style.display = "none";
    }
    if(getCookie("username") != ""){
        document.getElementById("usernameField").value = getCookie("username")
    }
    playButton.addEventListener("click", () => {
        Play()
    })
    document.getElementById("sharebutton").addEventListener("click", () => {
        document.getElementById("score-container").dataset.open = "true";
    })
    document.getElementById("sendbutton").addEventListener("click", () => {
        share(parseInt(getCookie("score")));
    })
    document.getElementById("ranking").addEventListener("click", ()=>{
        window.location = "./rank.html"
    })
    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 38) {
            Move(-1)
            player.dataset.dir = "up"
            setTimeout(() => {
                if (player.dataset.dir == "up") player.dataset.dir = "none"
            }, 1000);

        } else if (event.keyCode == 40) {
            Move(1)
            player.dataset.dir = "down"
            setTimeout(() => {
                if (player.dataset.dir == "down") player.dataset.dir = "none"
            }, 1000);
        }
    });
}

function Play() {
    //setup
    score = 0;
    var planetes = document.getElementsByClassName("planete");
    var planetesgene = pgenerated.getElementsByClassName("planete-generated");
    game_content.style.setProperty("--speed", globalSpeed + "s");
    game_content.style.setProperty("--widght", game_content.clientWidth + "px");
    game_content.style.setProperty("--height", game_content.clientHeight + "px");
    document.getElementById("score-container").dataset.open = "false";
    //remove all planetes
    while (pgenerated.hasChildNodes()) {
        pgenerated.removeChild(pgenerated.firstChild);
    }
    $(player).animate({
        top: "40%",
        left: "42%"
    }, 100)



    //remove panel

    $({ blurRadius: 8.6, blurRadius2: 0 }).animate({
        blurRadius: 0,
        blurRadius2: 10,
        opacity: 0
    }, {
        duration: 500,
        easing: 'swing', // or "linear"
        // use jQuery UI or Easing plugin for more options
        step: function() {
            $(deadPanel).css({
                "backdrop-filter": "blur(" + this.blurRadius + "px)",
                "filter": "blur(" + this.blurRadius2 + "px)"
            });
        }
    });

    setTimeout(() => {

        game_content.dataset.running = "true";
        P()
            //game running
        var game = setInterval(() => {
            if (game_content.dataset.running == "false") { clearInterval(game) }
            //for move
            player.style.setProperty("--playerPos", player.offsetTop + "px")
            if (player.dataset.dir == "none") {
                $(player).animate({
                    opacity: 1
                }, {
                    step: function(now, fx) {
                        $(player).css('-webkit-transform', 'rotateZ(0deg) rotateY(180deg)');
                    },
                    duration: 100
                }, 100, () => {

                })
            }
            //get colision
            for (let i = 0; i < planetesgene.length; i++) {
                var pos = parseInt(getComputedStyle(planetesgene[i]).getPropertyValue("left"));
                if (pos < (game_content.clientWidth / 2) && pos > (game_content.clientWidth / 3) && (planetesgene[i].offsetTop > (player.offsetTop - 90) && (planetesgene[i].offsetTop < (player.offsetTop + 150)))) {
                    console.log(planetesgene[i]);
                    StopGame();


                }

            }
            for (let i = 0; i < planetesgene.length; i++) {
                if (planetesgene[i].offsetLeft == -100) {
                    planetesgene[i].style.display = 'none';
                    planetesgene[i].className += "-delete";
                } else if (game_content.dataset.running == "true") {
                    $(planetesgene[i]).animate({
                        left: -150 + 'px'
                    }, globalSpeed * 1000, "linear", () => {

                    })
                }


            }
            for (let i = 0; i < pgenerated.getElementsByClassName("planete-generated-delete").length; i++) {
                pgenerated.getElementsByClassName("planete-generated-delete")[i].remove()
            }

            //generating planetes
            if (parseInt(Math.random() * difficulty) == 0 && pgenerated.childElementCount < (difficulty - 3)) {

                var p = planetes[parseInt(Math.random() * planetes.length)].cloneNode(true);
                p.className += "-generated"
                p.style.left = game_content.clientWidth + "px"
                p.style.top = parseInt(Math.random() * game_content.clientHeight) + "px"

                p.style.display = "block";
                pgenerated.appendChild(p);

            }
            //add score
            score++;
            scoreDisplay.innerText = score;
        }, 100);
    }, 500);





}

function share(s) {
    console.log("sharing...");
    var uname = document.getElementById("usernameField").value;
    var btn = document.getElementById("sendbutton");
    btn.style.backgroundImage = "url(./icon/loader.svg)";
    saveScore(s, uname)
        .then(() => {
            btn.style.backgroundImage = "url(./icon/filled/done.png)";
            setCookie("username",uname, 1000)
        })
        .catch((err) => {
            //if(err == "not upper")
            btn.style.backgroundImage = "url(./icon/filled/cross.png)";
            console.log(err);
        })
}

function Move(direction) {
    if (game_content.dataset.running == "true") {
        //move

        var ppos = player.offsetTop

        var newppos = player.offsetTop + (50 * direction);
        if (newppos > -30 && newppos < (((100 * game_content.clientHeight) / 58) / 2)) {
            $(player).animate({
                top: "+=" + (50 * direction)
            }, {
                step: function(now, fx) {
                    $(player).css('-webkit-transform', 'rotateZ(' + ((10 * direction)) + 'deg) rotateY(180deg)');
                },
                duration: 100
            }, 100, () => {

            })
        }


    }

}

function StopGame() {
    if (game_content.dataset.running = "true") {
        var planetesgene = pgenerated.getElementsByClassName("planete-generated");
        var scoreTitle = document.getElementById("score");
        document.getElementById("sharebutton").style.display = (score == 0 ? "none" : "block");
        game_content.dataset.running = "false";
        deadPanel.style.filter = "none"
        deadPanel.style.backdropFilter = "blur(5px)"
            //clear interval running
        for (let i = 0; i < planetesgene.length; i++) {
            $(planetesgene[i]).stop(true, false);
        }
        P()
        scoreTitle.innerText = "Last score : " + score;
        setCookie("score", score, 1000)

    }

}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function setCookie(c_name, c_value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    document.cookie = encodeURIComponent(c_name) +
        "=" + encodeURIComponent(c_value) +
        (!exdays ? "" : "; expires=" + exdate.toUTCString());;
}
var globalSpeed = 3;
var player = document.getElementById("player");
var game_content = document.getElementById("game-content");
var deadPanel = document.getElementById("dead-panel");
var velocity = 0;
var difficulty = 10;
var pgenerated = document.getElementById("generated-planete");
var scoreDisplay = document.getElementById("score-displayer").firstChild;
var score = 0;

function Load() {
    var scoreTitle = document.getElementById("score");
    var playButton = document.getElementById("play");
    var rankButton = document.getElementById("ranking");
    scoreTitle.innerText = "Last Score : " + (getCookie("score") != "" ? getCookie("score") : 0)
    playButton.addEventListener("click", () => {
        Play()
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

    var planetes = document.getElementsByClassName("planete");
    var planetesgene = pgenerated.getElementsByClassName("planete-generated");
    game_content.style.setProperty("--speed", globalSpeed + "s");
    game_content.style.setProperty("--widght", game_content.clientWidth + "px");
    game_content.style.setProperty("--height", game_content.clientHeight + "px");
    //remove all planetes
    while (pgenerated.hasChildNodes()) {
        pgenerated.removeChild(pgenerated.firstChild);
    }
    $(player).animate({
        top: "40%",
        left: "42%"
    }, 100)



    //remove panel

    $({ blurRadius: 8.6,blurRadius2: 0 }).animate({
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
    P()
    setTimeout(() => {
        
        game_content.dataset.running = "true";
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
            scoreDisplay.innerHTML = score;
        }, 100);
    }, 500);





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
        game_content.dataset.running = "false";
        deadPanel.style.filter = "none"
        deadPanel.style.backdropFilter = "blur(5px)"
        //clear interval running
        for (let i = 0; i < planetesgene.length; i++) {
            $(planetesgene[i]).stop(true, false);
        }
        P()
        scoreTitle.innerText = "Last score : " + score;
        document.cookie = "score=" + score
    }

}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
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
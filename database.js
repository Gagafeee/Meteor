  // Import the functions you need from the SDKs you need
  import { initializeApp, } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
  import { getDatabase, set, ref, get, update, child } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
      apiKey: "AIzaSyB_5xaM87K8XDUJ95jUcmB_Zvx2MeoMc44",
      authDomain: "meteor-game.firebaseapp.com",
      projectId: "meteor-game",
      storageBucket: "meteor-game.appspot.com",
      messagingSenderId: "879620108914",
      appId: "1:879620108914:web:b30d0f4bd48916500188eb",
      databaseURL: "https://meteor-game-default-rtdb.europe-west1.firebasedatabase.app"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const database = getDatabase(app)

  export function saveScore(score, username) {
      return new Promise((resolve, reject) => {
          get(ref(database, "/scores/" + username + "/score")).then((snapshot) => {
              if (snapshot.exists()) {
                  if (snapshot.val() < score) {
                      console.log(snapshot.val());
                      update(ref(database, "/scores/" + username), {
                          score: score,
                          date: Date.now()
                      })
                      resolve();
                  } else {
                      reject("not upper")
                  }
              } else {
                  console.log(score);
                  set(ref(database, "/scores/" + username), {
                      score: score,
                      date: Date.now()
                  })
                  resolve();
              }


          }).catch((error) => {
              console.error(error);
              reject(error);
          });
      })


  }

  export function getScores() {
      return new Promise((resolve, reject) => {
          get(ref(database, "/scores/")).then((snapshot) => {
              if (snapshot.exists()) {
                  resolve(snapshot)
              }
          })
      })
  }
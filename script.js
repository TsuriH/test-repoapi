window.onload = () => {

    savedFavorites = localStorage.getItem("favoriteCounter")
    favoriteCounter = JSON.parse(savedFavorites)
    if (favoriteCounter === null) {
        favoriteCounter = 0
    }
    favoriteCounterDisplay.innerText = savedFavorites
}

const usersContainerEl = document.getElementById('containerUsers')
let html = ""
let htmlForLoadingMoreUsers = ""
favoriteEl = document.getElementById('favorites')
let favoriteCounterDisplay = document.getElementById('favorites-counter')
let savedFavorites;
let favoriteCounter;
let currentFavoritsUsers;


// Dear lecturer! Notice that I have added seed in the url only to get the same 40 user so you could see
// that even after reloading the toggle that was checked is still checked as I was asked in section 6.
// Im fully aware to the fact that without the seed it would have brought me 40 NEW users of 5000(!) users in each reloading out so you could have not seen that
// the toggle was saved 

const getAllUsers = async (number) => {
    const res = await fetch(`https://randomuser.me/api?results=${number}&seed=tsuri`)
    const data = await res.json()
    return data.results
}

const checkInLocalStorage = (uuid) => {

    let currentFavoritsUsers = JSON.parse(localStorage.getItem("favoritesUsers"))

    if (currentFavoritsUsers === null) {
        currentFavoritsUsers = {}
    }

    if (currentFavoritsUsers[uuid]) {
        return "checked"
    }
}


function userCard(user, index){
    return `
    <div class="userCard">
    <div class="card" style="width: 25rem;">
        <img src=${user.picture.large}  class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Full Name: ${user.name.title} ${user.name.first} ${user.name.last}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Gender: ${user.gender} </li>
         
          <li class="list-group-item">Age: ${user.dob.age} </li>
          <li class="list-group-item">Email: ${user.email} </li>
        </ul>
 
      </div>
      <div class="custom-control custom-switch ">
<input type="checkbox" ${checkInLocalStorage(user.login.uuid)} value=${user.login.uuid} class="custom-control-input" id=${index} onclick="isItChecked(event)">
<label class="custom-control-label" for=${index}>Favorite</label>
</div>
</div>
    `
}

async function putUsersInCard(userNumber) {
    const allUsers = await getAllUsers(userNumber)
    allUsers.map((user, index) => {

        html += userCard(user,index)

    })

    usersContainerEl.innerHTML = html

}

putUsersInCard(40)


function isItChecked(event) {
    console.log("Hey!")

    const clickLocation = event.target

    let currentFavoritsUsers = JSON.parse(localStorage.getItem("favoritesUsers"))

    if (currentFavoritsUsers === null) {
        currentFavoritsUsers = {}
    }

    if (clickLocation.checked) {
        favoriteCounterPlusOne()
        currentFavoritsUsers[clickLocation.value] = true
        localStorage.setItem("favoritesUsers", JSON.stringify(currentFavoritsUsers))

    } else {
        favoriteCounterMinusOne()
        for (let key in currentFavoritsUsers) {

            if (key === clickLocation.value) {
                delete currentFavoritsUsers[key]
            }

            localStorage.setItem("favoritesUsers", JSON.stringify(currentFavoritsUsers))
        }

    }
}

function favoriteCounterPlusOne() {
    favoriteCounter ++
    favoriteCounterDisplay.innerText = favoriteCounter
    localStorage.setItem("favoriteCounter",JSON.stringify(favoriteCounter))
}

function favoriteCounterMinusOne() {
    favoriteCounter --
    favoriteCounterDisplay.innerText = favoriteCounter
    localStorage.setItem("favoriteCounter",JSON.stringify(favoriteCounter))

}

let scrollTimer = 0
let lastScrollFireTime = 0


window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        let now = new Date().getTime()
        if (now - lastScrollFireTime > 3000) {
            console.log("GET USERS")
            addMoreUsers()
            lastScrollFireTime = now
        }
    }
})


const moreUsers = async () => {
    const res = await fetch(`https://randomuser.me/api?results=10`)
    const data = await res.json()
    return data.results
}

async function addMoreUsers() {
    const someUsers = await moreUsers()
    someUsers.map((user, index) => {
        htmlForLoadingMoreUsers += userCard(user,index)

    })

    usersContainerEl.innerHTML += htmlForLoadingMoreUsers

}



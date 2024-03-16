let input = document.getElementById('input-box');
let button = document.getElementById('submit-button');
let showContainer = document.getElementById('show-container');
let listContainer = document.querySelector('.list');

var ts = new Date().getTime();
ts = ts.toString();

let privateKey = '48c68a70cac515afd03a1e0e07c6b09e6981d583';
let publicKey = '8bb399cfd4129fe4eb5f34d0d4b50000';

var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

function displayWords(value) {
    input.value = value;
    removeElements();
}

function removeElements() {
    listContainer.innerHTML = "";
}

input.addEventListener('keyup', async () => {
    removeElements();
    if(input.value.length < 4) {
        return false;
    }

    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${input.value}`;

    const response = await fetch(url);
    const jsonData = await response.json();

    jsonData.data['results'].forEach((result) => {
        let name = result.name;
        let div = document.createElement('div');
        div.style.cursor = 'pointer';
        div.classList.add('autocomplete-items');
        div.setAttribute('onclick', "displayWords('" + 
            name + "')"
        );
        let word = '<b>' + name.substr(0, input.value.length) + '</b>';
        word += name.substr(input.value.length);

        div.innerHTML = `<p class = "item">${word}</p>`;
        listContainer.appendChild(div);
    });
});

button.addEventListener('click', (getResult = async () => {
    if (input.value.trim().length < 1) {
        alert('Input cannot be blank');
    }
    showContainer.innerHTML = "";
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${input.value}`;
    console.log(url);

    const response = await fetch(url);
    const jsonData = await response.json();
    jsonData.data['results'].forEach((element) => {
        showContainer.innerHTML = `<div
        class='card-container'>
            <div class='container-character-image'>
                <img src="${element.thumbnail['path'] + '.' +
                    element.thumbnail['extension']
                }"/>
            </div>
            <div class="character-name">${element.name}</div>
            <div class="character-description">${element.description}</div>
        </div>`;
    });
}));

window.onload = () => {
    getResult();
}
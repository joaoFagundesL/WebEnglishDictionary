let ulNoun = document.querySelector('.list-noun'); /* Getting the Ul which stores noun's information */
let ulVerb = document.querySelector('.list-verb'); /* Getting the Ul which stores noun's information */
let body = document.querySelector('body'); /* Getting the body */
let transcription = document.querySelector('.transcription');
let main = document.querySelector('.main');


document.querySelector('.toggler').addEventListener('click', () => {
	changeIconLightModeDarkMode();
	body.classList.toggle('dark-mode-colors');
});

document.querySelector('.play').addEventListener('click', (e) => {
	e.preventDefault();
	document.querySelector('.audio').play();
});

document.querySelector("#form-submit").addEventListener('click', (e) => { /* When the user click to submit the word */
	e.preventDefault();

	let search = document.querySelector("#text").value; /* Getting the input from the user */

	cleanForm();   /* Cleaning the form as soon as the user does a new search */
	removeList();  /* Removing all informations about the word searched */
	removeAllErrorMessages();

	if (search == "") {
		displayErrorIfSearchIsEmpty();
	} else {
		document.querySelector('.error').classList.remove('showError');

		getData(search).then(data => {
			checkIfWordExist(data, search);

			let check = checkAudio(data);
			displayButtonIfAudioIsValid(check);

			getMeanings(data);
			setAudio(data);

		}).catch(err => console.error('ERROR ' + err));
	}
});

document.querySelector('#text').addEventListener('input', () => {
	if (document.querySelector("#text").value.length > 0) {
		document.querySelector('.search').classList.remove('validate');
		document.querySelector('.error').classList.remove('showError');
	} else {
		document.querySelector('.error').classList.add('showError');
		document.querySelector('.search').classList.add('validate');
	}
});


async function getData(search) { /* Preparing the api */
	const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${search}` /* Url with the word desired */
	const response = await fetch(apiUrl); /* Fetching api */

	if(response.status != 200) {
		alert('API is broken. Server fault. Try again later');
		return;
	}

	const data = await response.json(); // Getting all information

	return data;
}

function displayErrorIfSearchIsEmpty() {
	document.querySelector('.search').classList.add('validate');
	document.querySelector('.play-btn').classList.remove('showBtn');
	document.querySelector('.error').classList.add('showError');
}

function displayButtonIfAudioIsValid(audioIsValid) {
	if (audioIsValid)
		document.querySelector('.play-btn').classList.add('showBtn');
	else
		document.querySelector('.play-btn').classList.remove('showBtn');
}

function changeIconLightModeDarkMode() {
	document.querySelector('.light-mode').classList.toggle('icon-hide');
	document.querySelector('.dark-mode').classList.toggle('icon-hide');
}

function checkAudio(data) {
	if (data[0] == undefined)
		return false;

	if (data[0].phonetics.length === 0)
		return false;

	if (data[0].phonetics[0].audio != "" && data[0].phonetics[0].audio != undefined)
		return true;

	return false;
}

function checkIfWordExist(data, word) {
	removeAllErrorMessages();

	if (data[0] === undefined)
		wordInvalidMessage(word);
}

function removeAllErrorMessages() {
	let arr = document.querySelectorAll('.show-error');
	if (arr != []) {
		arr.forEach((e) => {
			e.remove();
		});
	}
}

function wordInvalidMessage(word) {
	let errorMessage = document.createElement('h1');
	errorMessage.textContent = `No exact match found for “${word}” in English`;
	errorMessage.classList.add('error-message');
	errorMessage.classList.add('show-error');
	main.appendChild(errorMessage);
}

function getMeanings(data) {

	document.getElementById('word').innerHTML = data[0].word;

	for (let a = 0; a < data.length; a++) { /* Data is an array of objects, here i'm going through all the objects */
		for (let j = 0; j < data[a].meanings.length; j++) { // Going through all the meanings
			var arrayOfDefinitions = data[a].meanings[j].definitions; // Definitions is an array of objects

			const div = document.createElement('div');
			let ul = document.createElement('ul');
			body.appendChild(div);
			div.classList.add('definition-div');

			for (let i = 0; i < arrayOfDefinitions.length; i++) { // Going through all the array of objects

				let li = setLi(data[a].meanings[j].definitions[i].definition); // Creating and adding text to the li

				createExample(data[a].meanings[j].definitions[i].example, li); // Getting the examples phrase

				var meaningTitle = document.createElement('p');
				meaningTitle.classList.add('meaning-title');
				meaningTitle.textContent = 'Meaning';
				var title = document.createElement('h2'); // Creating the title (noun, adverb)


				title.textContent = data[a].meanings[j].partOfSpeech; /* The title will be the same text as the partOfSpeech (noun, verb) */
				setUl(ul, li); /* Creating the ul */

			}
			div.append(meaningTitle);
			div.appendChild(ul);
			div.prepend(title);
			main.append(div);
		}
	}
}

function setAudio(data) {

	// if(data[0] === undefined)
	//     return;

	urlAudio = data[0].phonetics[0].audio;
	let button = document.querySelector('.audio');
	button.setAttribute("src", urlAudio);

}

function removeList() {

	/* Removing the divs */
	let definitionDiv = document.querySelectorAll('.definition-div');
	definitionDiv.forEach((element) => {
		element.remove();
	});

	/* Removing the ul */
	let ul = document.querySelectorAll('.list li');
	for (i = 0; (li = ul[i]); i++) {
		li.parentNode.removeChild(li);
	}
}

function cleanForm() {
	document.querySelector('form').reset();
	document.getElementById('word').innerHTML = "";
}

function createExample(examplePhrase, li) {
	if (examplePhrase != undefined) { // Is there an example of this word?
		let paragraph = document.createElement('p'); // If exists, lets create a <p></p>
		paragraph.innerHTML = examplePhrase; // Setting the example
		paragraph.classList.add('example');
		li.appendChild(paragraph); // <li> <p>Example</p> </li>
	}
}

function setUl(ul, li) {
	ul.appendChild(li);
	body.appendChild(ul);
}

function cleanDiv() {
	definitionDiv.remove();
}

function setLi(definitionPhrase) {
	let li = document.createElement('li'); // Creating a new li to put inside the ul
	li.textContent = definitionPhrase; // Here I'm setting the definitions

	return li;
}
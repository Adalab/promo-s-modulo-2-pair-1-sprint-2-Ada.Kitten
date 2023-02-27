'use strict';

/* Elementos que usamos en el HTML */
const newFormElement = document.querySelector('.js-new-form');
const listElement = document.querySelector('.js-list');
const searchButton = document.querySelector('.js-button-search');
const buttonAdd = document.querySelector('.js-btn-add');
const buttonCancelForm = document.querySelector('.js-btn-cancel');
const inputDesc = document.querySelector('.js-input-desc');
const inputPhoto = document.querySelector('.js-input-photo');
const inputRace = document.querySelector('.js-input-race');
const inputName = document.querySelector('.js-input-name');
const linkNewFormElememt = document.querySelector('.js-button-new-form');
const labelMessageError = document.querySelector('.js-label-error');
const input_search_desc = document.querySelector('.js_in_search_desc');
const input_search_race = document.querySelector('.js_in_search_race');

const GITHUB_USER = '<IsabelCollado>';
const SERVER_URL = `https://dev.adalab.es/api/kittens/${GITHUB_USER}`;

//Objetos con cada gatito
const kittenData_1 = {
  image: 'https://dev.adalab.es/gato-siames.webp',
  name: 'Anastacio',
  desc: 'Porte elegante, su patrón de color tan característico y sus ojos de un azul intenso, pero su historia se remonta a Asía al menos hace 500 años, donde tuvo su origen muy posiblemente.',
  race: 'Siamés',
};
const kittenData_2 = {
  image: 'https://dev.adalab.es/sphynx-gato.webp',
  name: 'Fiona',
  desc: 'Produce fascinación y curiosidad. Exótico, raro, bello, extraño… hasta con pinta de alienígena han llegado a definir a esta raza gatuna que se caracteriza por la «ausencia» de pelo.',
  race: 'Sphynx',
};
const kittenData_3 = {
  image: 'https://dev.adalab.es/maine-coon-cat.webp',
  name: 'Cielo',
  desc: ' Tienen la cabeza cuadrada y los ojos simétricos, por lo que su bella mirada se ha convertido en una de sus señas de identidad. Sus ojos son grandes y las orejas resultan largas y en punta.',
  race: 'Maine Coon',
};

/*const kittenDataList = [kittenData_1, kittenData_2, kittenData_3];*/

//Haz un fetch para obtener el listado de gatitos.

let kittenListStored = JSON.parse(localStorage.getItem('kittensList'));

let kittenDataList = [];

if (kittenListStored) {
  kittensList = kittenListStored;
  renderKitten();
} else {
  fetch(SERVER_URL)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('kittenDataList', JSON.stringify(data.results));
      kittenDataList = data.results;
      renderKittenList(kittenDataList);
    })
    .catch((error) => {
      console.error(error);
    });
}

//Funciones
function renderKitten(kittenData) {
  const kitten = `<li class="card">
    <article>
      <img
        class="card_img"
        src=${kittenData.image}
        alt="gatito"
      />
      <h3 class="card_title">${kittenData.name}</h3>
      <h3 class="card_race">${kittenData.race}</h3>
      <p class="card_description">
      ${kittenData.desc}
      </p>
    </article>
    </li>`;

  const liElement = document.createElement('li');
  liElement.classList.add('card');

  const articleElement = document.createElement('article');
  liElement.appendChild(articleElement);

  const imgElement = document.createElement('img');
  imgElement.classList.add('card_img');
  imgElement.src = kittenData.image;
  articleElement.appendChild(imgElement);

  const h3Title = document.createElement('h3');
  h3Title.classList.add('card_title');
  articleElement.appendChild(h3Title);

  const textForTitle = document.createTextNode(kittenData.name);
  h3Title.appendChild(textForTitle);

  const h3Race = document.createElement('h3');
  h3Race.classList.add('card_race');
  articleElement.appendChild(h3Race);

  const textForRace = document.createTextNode(kittenData.race);
  h3Race.appendChild(textForRace);

  const pDesc = document.createElement('desc');
  pDesc.classList.add('card_description');
  articleElement.appendChild(pDesc);

  const textForDesc = document.createTextNode(kittenData.desc);
  pDesc.appendChild(textForDesc);

  return liElement;
}
function renderKittenList(kittenDataList) {
  listElement.innerHTML = '';
  for (const kittenItem of kittenDataList) {
    const newLiItem = renderKitten(kittenItem);
    listElement.appendChild(newLiItem);
  }
}

//Mostrar/ocultar el formulario
function showNewCatForm() {
  newFormElement.classList.remove('collapsed');
}
function hideNewCatForm() {
  newFormElement.classList.add('collapsed');
}

function handleClickNewCatForm(event) {
  event.preventDefault();
  if (newFormElement.classList.contains('collapsed')) {
    showNewCatForm();
  } else {
    hideNewCatForm();
  }
}
//Adicionar nuevo gatito

function resetInputs() {
  inputDesc.value = '';
  inputName.value = '';
  inputPhoto.value = '';
  inputRace.value = '';
  labelMessageError.innerHTML = '';
}

function addNewKitten(event) {
  event.preventDefault();
  const valueDesc = inputDesc.value;
  const valuePhoto = inputPhoto.value;
  const valueName = inputName.value;

  if (valueDesc === '' || valuePhoto === '' || valueName === '') {
    labelMessageError.innerHTML = '¡Uy! parece que has olvidado algo';
  } else if (valueDesc !== '' && valuePhoto !== '' && valueName !== '') {
    labelMessageError.innerHTML = 'Mola! Un nuevo gatito en Adalab!';
    let newKittenDataObject = {
      image: valuePhoto,
      name: valueName,
      desc: valueDesc,
      race: '',
    };

    fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newKittenDataObject),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          kittenDataList.push(newKittenDataObject);
          kittenListStored = localStorage.setItem(
            'kittenDataList',
            JSON.stringify(kittenDataList)
          );

          renderKittenList(kittenDataList);
        } else {
          console.error(error);
        }
      });
    resetInputs();
  }
}

//Cancelar la búsqueda de un gatito
function cancelNewKitten(event) {
  event.preventDefault();
  newFormElement.classList.add('collapsed');
  inputDesc.value = '';
  inputPhoto.value = '';
  inputName.value = '';
}

//Filtrar por descripción
function filterKitten(event) {
  event.preventDefault();
  const descrSearchText = input_search_desc.value.toLowerCase();
  const raceSearchText = input_search_race.value.toLowerCase();
  listElement.innerHTML = '';
  console.log(raceSearchText);
  // const filtered = kittenDataList.filter((kittenItem) =>

  const kittenListFiltered = kittenDataList
    .filter((kittenItem) => {
      return kittenItem.desc.toLowerCase().includes(descrSearchText);
    })

    .filter((kittenItem) =>
      kittenItem.race.toLowerCase().includes(raceSearchText)
    );
  renderKittenList(kittenListFiltered);
}

// listElement.innerHTML += renderKitten(kittenItem);

/*for (const kittenItem of kittenDataList) {
    if (kittenItem.desc.includes(descrSearchText)) {
      listElement.innerHTML += renderKitten(kittenItem);
    }*/

//Mostrar el listado de gatitos en el HTML
renderKittenList(kittenDataList);

//Eventos
linkNewFormElememt.addEventListener('click', handleClickNewCatForm);
searchButton.addEventListener('click', filterKitten);
buttonAdd.addEventListener('click', addNewKitten);
buttonCancelForm.addEventListener('click', cancelNewKitten);

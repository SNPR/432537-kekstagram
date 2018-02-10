'use strict';
var MIN_PHOTOS = 1;
var TOTAL_PHOTOS = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

/**
 * Генерирует массив адресов фотографий.
 * @param {number} minPhotos Минимальное количество фотографий.
 * @param {number} totalPhotos Общее количество фотографий.
 * @return {Array} Массив строк с адресами фотографий.
 */
var getArrayOfPhotosUrl = function (minPhotos, totalPhotos) {
  var photos = [];
  for (var i = minPhotos; i <= totalPhotos; i++) {
    photos.push('photos/' + i + '.jpg');
  }
  return photos;
};

/**
 * Генерирует массив лайков.
 * @param {number} minLikes Минимальное количество лайков.
 * @param {number} maxLikes Максимальное количество лайков.
 * @return {number} Случайное число в диапазоне от minLikes до maxLikes.
 */
var getRandomLikes = function (minLikes, maxLikes) {
  return Math.round(Math.random() * (maxLikes - minLikes) + minLikes);
};

/**
 * Возвращает случайный индекс массива
 * @param {Array} array Массив с данными любого типа.
 * @return {number} Случайный индекс массива, переданного функции.
 */
var getRandomIndex = function (array) {
  return Math.floor(Math.random() * array.length);
};

/**
 * Функция для случайного перемешивания элементов массива.
 * @param {Array} array Массив со значениями любого типа.
 * @return {Array} Массив перемешанных значений.
 */
var shuffleArray = function (array) {
  var arrayCopy = array.slice();
  var mixedArray = [];
  while (mixedArray.length < array.length) {
    var randomIndex = getRandomIndex(arrayCopy);
    mixedArray.push(arrayCopy[randomIndex]);
    arrayCopy.splice(randomIndex, 1);
  }
  return mixedArray;
};

/**
 * Функция, для получания массива комментариев,
 * состоящих из одного или двух случайных комментариев.
 * @param {Array} commentsArray Исходный массив с комментариями.
 * @return {Array} Массив строк с одним или двумя комментариями.
 */
var getArrayOfRandomComments = function (commentsArray) {
  var comments = [];
  if (Math.random() < 0.5) {
    comments.push(commentsArray[getRandomIndex(commentsArray)], commentsArray[getRandomIndex(commentsArray)]);
    while (comments[0] === comments[1]) {
      comments[1] = commentsArray[getRandomIndex(commentsArray)];
    }
  } else {
    comments.push(commentsArray[getRandomIndex(commentsArray)]);
  }
  return comments;
};

/**
 * Генерирует массив заданного количества объектов с данными о фотографиях.
 * @param {number} minLikes Минимальное количество лайков.
 * @param {number} maxLikes Максимальное количество лайков.
 * @param {number} minPhotos Минимальное количество фотографий.
 * @param {number} totalPhotos Общее количество фотографий.
 * @param {Array} arrayOfComments Исходный массив с комментариями.
 * @return {Array} Массив объектов с параметрами фотографий.
 */
var generatePhotos = function (minLikes, maxLikes, minPhotos, totalPhotos, arrayOfComments) {
  var randomPhotosUrl = shuffleArray(getArrayOfPhotosUrl(minPhotos, totalPhotos));
  var photosArray = [];
  for (var i = 0; i < totalPhotos; i++) {
    photosArray.push({
      url: randomPhotosUrl[i],
      likes: getRandomLikes(minLikes, maxLikes),
      comments: getArrayOfRandomComments(arrayOfComments)
    });
  }
  return photosArray;
};

/**
 * Заполняет шаблон фотографии данными из объекта фотографии.
 * @param {Object} photo Объект с параметрами фотографии.
 * @return {*} Заполенный данными элемент фотографии.
 */
var renderPhotos = function (photo) {
  var photoTemplate = document.querySelector('#picture-template').content;
  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('img').src = photo.url;
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  photoElement.querySelector('.picture-comments').textContent = photo.comments.length;
  return photoElement;
};

var picturesElement = document.querySelector('.pictures');
var pictures = generatePhotos(LIKES_MIN, LIKES_MAX, MIN_PHOTOS, TOTAL_PHOTOS, COMMENTS);
var fragment = document.createDocumentFragment();

for (var i = 0; i < TOTAL_PHOTOS; i++) {
  fragment.appendChild(renderPhotos(pictures[i]));
}

picturesElement.appendChild(fragment);


var uploadFile = document.querySelector('#upload-file');
var uploadForm = document.querySelector('.upload-overlay');
var uploadFormClose = uploadForm.querySelector('#upload-cancel');
var uploadControl = document.querySelector('.upload-control');
var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = document.querySelector('.gallery-overlay-close');
var picture = document.querySelectorAll('.picture');

/**
 * Определяет текущий активный элемент на странице.
 * @return{string} Наименование текущего активного элемента.
 */
var getActiveElement = function () {
  return document.activeElement.tagName;
};

/**
 * Вспомогательная функция обработчика события для закрытия окна при нажатии клавиши 'ESC'.
 * Нажатие 'ESC' не срабатывает, если фокус находится в поле ввода хэш-тега или комментария.
 * @param {object} evt Объект текущего события.
 */
var onKeyPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    if (getActiveElement() === 'INPUT') {
      return;
    }
    if (getActiveElement() === 'TEXTAREA') {
      return;
    }
    closeUploadForm();
  }
};

var openUploadForm = function () {
  uploadForm.classList.remove('hidden');
  document.addEventListener('keydown', onKeyPress);
};

var closeUploadForm = function () {
  uploadFile.value = '';
  uploadForm.classList.add('hidden');
  document.removeEventListener('keydown', onKeyPress);
};

uploadFile.addEventListener('change', function () {
  openUploadForm();
});

uploadFormClose.addEventListener('click', function () {
  closeUploadForm();
});

uploadControl.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    uploadFile.click();
  }
});

uploadForm.addEventListener('keydown', function (evt) {
  if (evt.target === uploadFormClose && evt.keyCode === ENTER_KEYCODE) {
    closeUploadForm();
  }
});

for (i = 0; i < picture.length; i++) {
  picture[i].addEventListener('click', function (evt) {
    document.querySelector('.gallery-overlay-image').src = evt.target.src;
    document.querySelector('.likes-count').textContent = evt.target.parentNode.querySelector('.picture-likes').textContent;
    document.querySelector('.comments-count').textContent = evt.target.parentNode.querySelector('.picture-comments').textContent;
    evt.preventDefault();
    galleryOverlay.classList.remove('hidden');
  });
}

galleryOverlayClose.addEventListener('click', function () {
  galleryOverlay.classList.add('hidden');
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    galleryOverlay.classList.add('hidden');
  }
});

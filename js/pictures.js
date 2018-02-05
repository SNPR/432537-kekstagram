'use strict';

var TOTAL_PHOTOS = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var photos = [];
for (var i = 1; i <= TOTAL_PHOTOS; i++) {
  photos.push('photos/' + i + '.jpg');
}

var likes = [];
for (i = LIKES_MIN; i <= LIKES_MAX; i++) {
  likes.push(i);
}

/**
 * Возвращает случайный индекс массива
 * @param {Array} array Массив с данными любого типа.
 * @return {number} Случайный индекс массива, переданного функции.
 */
var randomArrayIndex = function (array) {
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
    var radnomIndex = randomArrayIndex(arrayCopy);
    mixedArray.push(arrayCopy[radnomIndex]);
    arrayCopy.splice(radnomIndex, 1);
  }
  return mixedArray;
};

/**
 * Функция, для получания массива комментариев,
 * состоящих из одного или двух случайных комментариев.
 * @param {number} totalComments Количество массивов с комментариями.
 * @return {Array} Массив массивов строк с комментариями.
 */
var getArrayOfRandomCommentsCount = function (totalComments) {
  var commentsArray = [];

  for (i = 0; i < totalComments; i++) {
    if (Math.random() < 0.5) {
      commentsArray.push([COMMENTS[randomArrayIndex(COMMENTS)], COMMENTS[randomArrayIndex(COMMENTS)]]);
      while (commentsArray[i][0] === commentsArray[i][1]) {
        commentsArray[i].splice(1, 1);
        commentsArray[i].push(COMMENTS[randomArrayIndex(COMMENTS)]);
      }
    } else {
      commentsArray.push([COMMENTS[randomArrayIndex(COMMENTS)]]);
    }
  }
  return commentsArray;
};

/**
 * Генерирует массив заданного количества объектов с данными о фотографиях.
 * @param {number} amountOfPhotos Количество генерируемых объектов в массиве.
 * @return {Array} Массив объектов с параметрами фотографий.
 */
var generatePhotos = function (amountOfPhotos) {
  var randomPhotosUrl = shuffleArray(photos);
  var randomNumberOfLikes = shuffleArray(likes);
  var randomComments = getArrayOfRandomCommentsCount(TOTAL_PHOTOS);
  var photosArray = [];
  for (i = 0; i < amountOfPhotos; i++) {
    photosArray.push({
      url: randomPhotosUrl[i],
      likes: randomNumberOfLikes[i],
      comments: randomComments[i]
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

  photoElement.querySelector('img').setAttribute('src', photo.url);
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  photoElement.querySelector('.picture-comments').textContent = photo.comments.length;
  return photoElement;
};

var picturesElement = document.querySelector('.pictures');
var pictures = generatePhotos(TOTAL_PHOTOS);
var fragment = document.createDocumentFragment();

for (i = 0; i < TOTAL_PHOTOS; i++) {
  fragment.appendChild(renderPhotos(pictures[i]));
}

picturesElement.appendChild(fragment);

document.querySelector('.gallery-overlay-image').setAttribute('src', pictures[0].url);
document.querySelector('.likes-count').textContent = pictures[0].likes;
document.querySelector('.comments-count').textContent = pictures[0].comments.length;
document.querySelector('.gallery-overlay').classList.remove('hidden');

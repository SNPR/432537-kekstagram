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
 * @return {number}
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
  for (i = 0; i < arrayCopy.length; i++) {
    var radnomIndex = randomArrayIndex(arrayCopy);
    mixedArray.push(arrayCopy[radnomIndex]);
    arrayCopy.splice(radnomIndex, 1);
    i--;
  }
  return mixedArray;
};

/**
 * Функция, для получания массива комментариев,
 * состоящих из одного или двух предложений.
 * @param {number} totalComments Количество массивов с комментариями.
 * @return {Array}
 */
var getArrayOfRandomCommentsCount = function (totalComments) {
  var commentsArray = [];

  for (i = 0; i < totalComments; i++) {
    if (Math.random() < 0.5 && COMMENTS[randomArrayIndex(COMMENTS) + 1]) {
      commentsArray.push([COMMENTS[randomArrayIndex(COMMENTS)] + ' ' + COMMENTS[randomArrayIndex(COMMENTS) + 1]]);
      if (Math.random() >= 0.33 && Math.random() < 0.66 && COMMENTS[randomArrayIndex(COMMENTS) + 1]) {
        commentsArray.push([randomArrayIndex(COMMENTS)[i]]);
      }
    }
    if (Math.random() > 0.5 && COMMENTS[randomArrayIndex(COMMENTS) + 1]) {
      commentsArray.push([randomArrayIndex(COMMENTS)[i]]);
    }
  }
  return commentsArray;
};

/**
 * Генерирует массив заданного количества объектов с данными о фотографиях.
 * @param {number} amountOfPhotos Количество генерируемых объектов в массиве.
 * @return {Array}
 */
var generatePhotos = function (amountOfPhotos) {
  var randomPhotosUrl = shuffleArray(photos);
  var randomNumberOfLikes = shuffleArray(likes);
  var photosArray = [];
  var randomComments = getArrayOfRandomCommentsCount(TOTAL_PHOTOS);
  for (i = 0; i < amountOfPhotos; i++) {
    photosArray.push({
      url: randomPhotosUrl[i],
      likes: randomNumberOfLikes[i],
      comments: randomComments[i]
    });
  }
  return photosArray;
};

var renderPhotos = function (photo) {
  var photoTemplate = document.querySelector('#picture-template').content;
  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('img').setAttribute('src', photo.url);
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  photoElement.querySelector('.picture-comments').textContent = photo.comments.length;
  return photoElement;
};

var similarListElement = document.querySelector('.pictures');
var pictures = generatePhotos(TOTAL_PHOTOS);
var fragment = document.createDocumentFragment();
for (i = 0; i < TOTAL_PHOTOS; i++) {
  fragment.appendChild(renderPhotos(pictures[i]));
}

similarListElement.appendChild(fragment);

document.querySelector('.gallery-overlay-image').setAttribute('src', pictures[0].url);
document.querySelector('.likes-count').textContent = pictures[0].likes;
document.querySelector('.comments-count').textContent = pictures[0].comments.length;
document.querySelector('.gallery-overlay').classList.remove('hidden');

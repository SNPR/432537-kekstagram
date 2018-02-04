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
 * @return {Array}
 */
var getArrayOfRandomCommentsCount = function () {
  var commentsShuffle = shuffleArray(COMMENTS);
  var result = [];

  for (i = 0; i < commentsShuffle.length; i++) {
    if (Math.random() > 0.5 && commentsShuffle[i + 1]) {
      result.push([commentsShuffle[i] + ' ' + commentsShuffle[i + 1]]);
    } else {
      result.push([commentsShuffle[i]]);
    }
  }
  return result;
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
  var randomComments = getArrayOfRandomCommentsCount();
  for (i = 0; i < amountOfPhotos; i++) {
    photosArray.push({
      url: randomPhotosUrl[i],
      likes: randomNumberOfLikes[i],
      comments: randomComments[randomArrayIndex(randomComments)]
    });
  }
  return photosArray;
};

generatePhotos(TOTAL_PHOTOS);

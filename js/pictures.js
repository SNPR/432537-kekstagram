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
  photos.push('photos/{{' + i + '}}.jpg');
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
  var result = [];
  for (i = 0; i < arrayCopy.length; i++) {
    var radnomArrayIndex = Math.floor(Math.random() * arrayCopy.length);
    result.push(arrayCopy[radnomArrayIndex]);
    arrayCopy.splice(radnomArrayIndex, 1);
    i--;
  }
  return result;
};

var numberOfComments = function () {
  return Math.ceil(Math.random() - 0.5);
};

var randomCommentsCount = function (commentsArray) {
  var commentsShuffle = shuffleArray(COMMENTS);
  var result = [];

  for (i = 0; i < commentsShuffle.length; i++) {
    if (numberOfComments() === 1 && commentsShuffle[i + 1]) {
      result.push(commentsShuffle[i] + ' ' + commentsShuffle[i + 1]);
    } else {
      result.push(commentsShuffle[i]);
    }
  }
  return result;
};

// /**
//  * Генерирует массив объектов с данными о фотографиях.
//  * @param {number} amountOfPhotos Количество генерируемых объектов в массиве.
//  * @return {Array}
//  */
// var generatePhotos = function (amountOfPhotos) {
//   var randomPhotosUrl = shuffleArray(photos);
//   var randomNumberOfLikes = shuffleArray(likes);
//   var photosArray = [];
//   for (i = 0; i < amountOfPhotos; i++) {
//     photosArray.push({
//       url: randomPhotosUrl[i],
//       likes: randomNumberOfLikes[i],
//       comments: COMMENTS[randomArrayIndex(COMMENTS)] + ' ' + COMMENTS[randomArrayIndex(COMMENTS)]
//     });
//   }
//   return photosArray;
// };

// generatePhotos(TOTAL_PHOTOS)

randomCommentsCount(COMMENTS);

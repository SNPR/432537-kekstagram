'use strict';

/**
 * Генерирует массив объектов с данными о фотографии.
 */
(function () {
  var MIN_PHOTOS = 1;
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
   * Возвращает случайное число в заданном диапазоне.
   * @param {number} min Минимальное значение.
   * @param {number} max Максимальное значение.
   * @return {number} Случайное число в диапазоне от min до max.
   */
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
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
   * @param {number} min Минимальное количество лайков.
   * @param {number} max Максимальное количество лайков.
   * @param {number} minPhotos Минимальное количество фотографий.
   * @param {number} totalPhotos Общее количество фотографий.
   * @param {Array} arrayOfComments Исходный массив с комментариями.
   * @return {Array} Массив объектов с параметрами фотографий.
   */
  var generatePhotos = function (min, max, minPhotos, totalPhotos, arrayOfComments) {
    var randomPhotosUrl = shuffleArray(getArrayOfPhotosUrl(minPhotos, totalPhotos));
    var photosArray = [];
    for (var i = 0; i < totalPhotos; i++) {
      photosArray.push({
        url: randomPhotosUrl[i],
        likes: getRandomNumber(min, max),
        comments: getArrayOfRandomComments(arrayOfComments)
      });
    }
    return photosArray;
  };
  var pictures = generatePhotos(LIKES_MIN, LIKES_MAX, MIN_PHOTOS, window.constantes.TOTAL_PHOTOS, COMMENTS);
  (function () {
    window.pictures = pictures;
  })();
})();

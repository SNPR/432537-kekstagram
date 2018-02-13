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
var picturesCollection = document.querySelectorAll('.picture');

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

/**
 * Вспомогательная функция, открывающая окно загрузки файла
 * и добавляющая обработчик события, ожидающий нажатия Escape.
 */
var openUploadForm = function () {
  uploadForm.classList.remove('hidden');
  document.addEventListener('keydown', onKeyPress);
};

/**
 * Вспомогательная функция, скрывающая окно загрузки файла
 * и удаляющая обработчик события, ожидающий нажатия Escape.
 */
var closeUploadForm = function () {
  uploadFile.value = '';
  uploadForm.classList.add('hidden');
  document.removeEventListener('keydown', onKeyPress);
  scale = 1;
  effectImagePreview.style.transform = 'scale(1)';
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

for (i = 0; i < picturesCollection.length; i++) {
  picturesCollection[i].addEventListener('click', function (evt) {
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

var effectImagePreview = document.querySelector('.effect-image-preview');
var uploadEffectLevel = document.querySelector('.upload-effect-level');

/**
 * Удаляет все эффекты у изображения.
 */
var removeEffects = function () {
  var effects = ['effect-chrome', 'effect-sepia', 'effect-marvin', 'effect-phobos', 'effect-heat'];
  for (i = 0; i < effects.length; i++) {
    effectImagePreview.classList.remove(effects[i]);
    uploadEffectLevel.classList.remove('hidden');
  }
};

uploadEffectLevel.classList.add('hidden');

uploadForm.addEventListener('click', function (evt) {
  if (evt.target === document.querySelector('#upload-effect-none')) {
    removeEffects();
    uploadEffectLevel.classList.add('hidden');
  }
  if (evt.target === document.querySelector('#upload-effect-chrome')) {
    removeEffects();
    effectImagePreview.classList.add('effect-chrome');
  }
  if (evt.target === document.querySelector('#upload-effect-sepia')) {
    removeEffects();
    effectImagePreview.classList.add('effect-sepia');
  }
  if (evt.target === document.querySelector('#upload-effect-marvin')) {
    removeEffects();
    effectImagePreview.classList.add('effect-marvin');
  }
  if (evt.target === document.querySelector('#upload-effect-phobos')) {
    removeEffects();
    effectImagePreview.classList.add('effect-phobos');
  }
  if (evt.target === document.querySelector('#upload-effect-heat')) {
    removeEffects();
    effectImagePreview.classList.add('effect-heat');
  }
});

var hashTagInput = document.querySelector('.upload-form-hashtags');

/**
 * Проверяет, если ли в массиве повторяющиеся соседние значения.
 * @param {Array} array Массив строк или чисел.
 * @return {(number|string)} Первое повторяющееся значение.
 */
var checkSimilarValues = function (array) {
  for (var j = 0; j < array.length; j++) {
    if (array[j] === array[j + 1]) {
      break;
    }
  }
  return array[j];
};

hashTagInput.addEventListener('input', function (evt) {
  var target = evt.target;
  var hashtags = target.value.toLowerCase().split(' ').sort();

  for (i = 0; i < hashtags.length; i++) {
    if (hashtags[i] === '') {
      hashtags.splice(i, 1);
      i--;
    } else if (hashtags.length > 5) {
      target.setCustomValidity('Хэштегов должно быть не больше пяти');
    } else if (hashtags[i] && hashtags[i].charAt(0) !== '#') {
      target.setCustomValidity('Хэштеги должны начинаться с символа "#"');
    } else if (hashtags[i].length > 20) {
      target.setCustomValidity('Длина хэштега должна быть не более 20 символов');
    } else if (hashtags[i].lastIndexOf('#') !== 0) {
      target.setCustomValidity('Хэштеги должны разделяться пробелами');
    } else if (checkSimilarValues(hashtags)) {
      target.setCustomValidity('Хэштеги не должны повторяться');
    } else {
      target.setCustomValidity('');
    }
  }
});

var decreasePhotoButton = document.querySelector('.upload-resize-controls-button-dec');
var increasePhotoButton = document.querySelector('.upload-resize-controls-button-inc');
var scaleValue = document.querySelector('.upload-resize-controls-value');


var scale = 1;
var step = 0.25;

var decreasePhoto = function () {
  if (scale > step) {
    effectImagePreview.style.transform = 'scale(' + (scale -= step) + '' + ')';
    scaleValue.value = scale * 100 + '' + '%';
  }
};

var increasePhoto = function () {
  if (scale < 1) {
    effectImagePreview.style.transform = 'scale(' + (scale += step) + '' + ')';
    scaleValue.value = scale * 100 + '' + '%';
  }
};

uploadForm.addEventListener('click', function (evt) {
  if (evt.target === decreasePhotoButton) {
    decreasePhoto();
  }
  if (evt.target === increasePhotoButton) {
    increasePhoto();
  }
});

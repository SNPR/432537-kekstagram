'use strict';

/**
 * Отрисовывает на странице сгенерированные фотографии.
 */
(function () {
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
  var filters = document.querySelector('.filters');

  /**
   * Загружаем миниатюры на страницу.
   * @param {Array} photos Массив объектов с параметрами фотографий.
   */
  var loadThumbnails = function (photos) {
    var fragment = document.createDocumentFragment();
    if (photos) {
      for (var i = 0; i < photos.length; i++) {
        fragment.appendChild(renderPhotos(photos[i]));
      }
    } else {
      window.backend.onError('По запрашиваему адресу нет данных');
    }

    picturesElement.appendChild(fragment);
    filters.classList.remove('filters-inactive');
    window.addThumbnailEventListener();
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
    var arrayCopy = array.slice(0);
    var mixedArray = [];
    while (mixedArray.length < array.length) {
      var randomIndex = getRandomIndex(arrayCopy);
      mixedArray.push(arrayCopy[randomIndex]);
      arrayCopy.splice(randomIndex, 1);
    }
    return mixedArray;
  };

  /**
   * Callback - функция. Отрисовывает миниатюры изображений при удачной загрузке
   * массива объектов с данными о фотографии с сервера. Добавляет на них обработчики
   * событий, открывающие полную версию изображения, сортирует фотографии при нажатии
   * на соответсвтующие фильтры.
   * @param {Array} photos Массив объектов с данными о фотографиях.
   */
  var onSuccessLoad = function (photos) {
    var defaultPhotos = photos.slice(0);
    var lastTimeout;
    loadThumbnails(photos);

    filters.addEventListener('click', function (evt) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(function () {
        if (evt.target.type === 'radio') {
          var target = evt.target.value;
          picturesElement.innerHTML = '';

          if (target === 'popular') {
            photos = defaultPhotos.slice(0);
            photos.sort(function (a, b) {
              return b.likes - a.likes;
            });
            loadThumbnails(photos);
          } else if (target === 'recommend') {
            loadThumbnails(defaultPhotos);
          } else if (target === 'discussed') {
            photos = defaultPhotos.slice(0);
            photos.sort(function (a, b) {
              return b.comments.length - a.comments.length;
            });
            loadThumbnails(photos);
          } else if (target === 'random') {
            photos = shuffleArray(photos);
            loadThumbnails(photos);
          }
        }
      }, 500);
    });

    filters.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.constantes.ENTER_KEYCODE) {
        evt.target.click();
      }
    });
  };

  window.backend.load(onSuccessLoad, window.backend.onError);
})();

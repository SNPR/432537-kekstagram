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

  /**
   * Callback - функция. Отрисовывает миниатюры изображений при удачной загрузке
   * массива объектов с данными о фотографии с сервера. Добавляет на них обработчики
   * событий, открывающие полную версию изображения.
   * @param {Array} photos Массив объектов с данными о фотографиях.
   */
  var onSuccessLoad = function (photos) {
    var fragment = document.createDocumentFragment();
    if (photos) {
      for (var i = 0; i < photos.length; i++) {
        fragment.appendChild(renderPhotos(photos[i]));
      }
    } else {
      window.backend.onError('По запрашиваему адресу нет данных');
    }

    picturesElement.appendChild(fragment);
    var galleryModule = document.createElement('script');
    galleryModule.src = 'js/gallery.js';
    document.body.appendChild(galleryModule);
    document.querySelector('.filters-inactive').classList.remove('filters-inactive');
  };

  window.backend.load(onSuccessLoad, window.backend.onError);
})();

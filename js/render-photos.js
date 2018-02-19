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

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 10; margin-left: auto; margin-top: 500px; text-align: center;';
    node.style.fontSize = '26px';
    node.textContent = errorMessage;
    document.body.appendChild(node);
  };

  var successHandler = function (photos) {
    var fragment = document.createDocumentFragment();
    if (photos) {
      for (var i = 0; i < photos.length; i++) {
        fragment.appendChild(renderPhotos(photos[i]));
      }
    } else {
      errorHandler('По запрашиваему адресу нет данных');
    }

    picturesElement.appendChild(fragment);
    var galleryModule = document.createElement('script');
    galleryModule.src = 'js/gallery.js';
    document.body.appendChild(galleryModule);
  };

  window.load(successHandler, errorHandler);
})();

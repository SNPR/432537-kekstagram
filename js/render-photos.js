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

  var successHandler = function (photos) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPhotos(photos[i]));
    }

    picturesElement.appendChild(fragment);
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 10; margin: 300px 300px; text-align: center; background-color: blue;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.load(successHandler, errorHandler);
})();

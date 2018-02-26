'use strict';

/**
 * Открывает диалоговое окно с полномасштабной фотографией.
 */
(function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = document.querySelector('.gallery-overlay-close');

  /**
   * Вспомогательная функция для обработчиков событий. Скрывает полномасштабное изображение
   * и удаляет обработчики событий.
   */
  var removeGalleryEventListeners = function () {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEscPressInGallery);
    galleryOverlayClose.removeEventListener('click', onCloseClickInGallery);
    galleryOverlayClose.removeEventListener('keydown', onClosePressInGallery);
  };

  /**
   * Функция-обработчик событий, реагирующая на клик по кнопке закрытия полномасштабного изображения.
   */
  var onCloseClickInGallery = function () {
    removeGalleryEventListeners();
  };

  /**
   * Функция-обработчик событий, реагирующая на нажатие Enter по кнопке закрытия полномасштабного изображения.
   * @param {object} evt Объект текущего события.
   */
  var onClosePressInGallery = function (evt) {
    window.util.isEnterEvent(evt, removeGalleryEventListeners);
  };

  /**
   * Функция-обработчик событий, реагирующая на нажатие Esc в режиме просмотра полномасштабного изображения.
   * @param {object} evt Объект текущего события.
   */
  var onEscPressInGallery = function (evt) {
    window.util.isEscEvent(evt, removeGalleryEventListeners);
  };

  /**
   * Функция-обработчик событий, реагирующая на клик по миниатюре изображения.
   * @param {object} evt Объект текущего события.
   */
  var onGalleryOverlayOpen = function (evt) {
    evt.preventDefault();

    document.querySelector('.gallery-overlay-image').src = evt.currentTarget.querySelector('img').src;
    document.querySelector('.likes-count').textContent = evt.target.parentNode.querySelector('.picture-likes').textContent;
    document.querySelector('.comments-count').textContent = evt.target.parentNode.querySelector('.picture-comments').textContent;

    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscPressInGallery);
    galleryOverlayClose.addEventListener('click', onCloseClickInGallery);
    galleryOverlayClose.addEventListener('keydown', onClosePressInGallery);

    galleryOverlay.focus();
  };

  window.addThumbnailEventListener = function () {
    var thumbnails = document.querySelectorAll('.picture');

    thumbnails.forEach(function (thumbnail) {
      thumbnail.addEventListener('click', onGalleryOverlayOpen);
    });
  };
})();

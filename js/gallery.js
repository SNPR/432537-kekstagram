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
    galleryOverlayClose.removeEventListener('click', onCloseClickInGallery);
    galleryOverlayClose.removeEventListener('keydown', onClosePressInGallery);
    document.removeEventListener('keydown', onEscPressInGallery);
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
    if (evt.keyCode === window.constantes.ENTER_KEYCODE) {
      removeGalleryEventListeners();
    }
  };

  /**
   * Функция-обработчик событий, реагирующая на нажатие Esc в режиме просмотра полномасштабного изображения.
   * @param {object} evt Объект текущего события.
   */
  var onEscPressInGallery = function (evt) {
    if (evt.keyCode === window.constantes.ESC_KEYCODE) {
      removeGalleryEventListeners();
    }
  };

  /**
   * Функция-обработчик событий, реагирующая на клик по миниатюре изображения.
   * @param {object} evt Объект текущего события.
   */
  var onGalleryOverlayOpen = function (evt) {
    document.querySelector('.gallery-overlay-image').src = evt.currentTarget.querySelector('img').src;
    document.querySelector('.likes-count').textContent = evt.target.parentNode.querySelector('.picture-likes').textContent;
    document.querySelector('.comments-count').textContent = evt.target.parentNode.querySelector('.picture-comments').textContent;
    evt.preventDefault();
    galleryOverlay.classList.remove('hidden');
    galleryOverlayClose.addEventListener('click', onCloseClickInGallery);
    galleryOverlayClose.addEventListener('keydown', onClosePressInGallery);
    document.addEventListener('keydown', onEscPressInGallery);
    galleryOverlay.focus();
  };

  window.addThumbnailEventListener = function () {
    var thumbnails = document.querySelectorAll('.picture');
    thumbnails.forEach(function (item) {
      item.addEventListener('click', onGalleryOverlayOpen);
    });
  };
})();

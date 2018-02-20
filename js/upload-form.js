'use strict';

/**
 * Открывает диалоговое окно редактирования загруженного фото.
 * Отвечает за редактирование размера фотографии и глубину эффекта выбранного фильтра.
 */
(function () {
  var uploadControl = document.querySelector('.upload-control');
  var uploadFile = document.querySelector('#upload-file');
  var uploadForm = document.querySelector('.upload-overlay');
  var uploadFormClose = uploadForm.querySelector('#upload-cancel');
  var effectLevelProportion = 4.55;
  var effectLevelValueShift = 1.8;

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
    if (evt.keyCode === window.constantes.ESC_KEYCODE) {
      if (getActiveElement() === 'INPUT' || getActiveElement() === 'TEXTAREA') {
        return;
      } else {
        uploadFormClose.click();
      }
    }
  };

  /**
   * Вспомогательная функция, открывающая окно загрузки файла
   * и добавляющая обработчик события, ожидающий нажатия Escape.
   */
  var openUploadForm = function () {
    uploadForm.addEventListener('click', onResizePhoto);
    uploadForm.classList.remove('hidden');
    scale = 1;
    effectImagePreview.style.transform = 'scale(1)';
    effectImagePreview.classList = '';
    effectImagePreview.classList.add('effect-none');
    effectImagePreview.style.filter = '';
    uploadEffectLevel.classList.add('hidden');
    effectLevelPin.style.left = '100%';
    effectLevelScale.style.width = parseFloat(effectLevelPin.style.left) - effectLevelValueShift + '%';
    document.addEventListener('keydown', onKeyPress);
    uploadEffectsControl.addEventListener('click', onFilterChange);
    window.validation.hashTagInput.addEventListener('input', window.validation.onHashtagsType);
    effectLevelPin.addEventListener('mousedown', onPinMove);
  };

  /**
   * Вспомогательная функция, скрывающая окно загрузки файла
   * и удаляющая обработчик события, ожидающий нажатия Escape.
   */
  var closeUploadForm = function () {
    uploadFile.value = '';
    uploadForm.classList.add('hidden');
    document.removeEventListener('keydown', onKeyPress);
    uploadForm.removeEventListener('click', onResizePhoto);
    uploadEffectsControl.removeEventListener('click', onFilterChange);
    window.validation.hashTagInput.removeEventListener('input', window.validation.onHashtagsType);
    effectLevelPin.removeEventListener('mousedown', onPinMove);
  };

  uploadFile.addEventListener('change', function () {
    openUploadForm();
  });

  uploadFormClose.addEventListener('click', function () {
    closeUploadForm();
  });

  uploadControl.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.constantes.ENTER_KEYCODE) {
      uploadFile.click();
    }
  });

  uploadForm.addEventListener('keydown', function (evt) {
    if (evt.target === uploadFormClose && evt.keyCode === window.constantes.ENTER_KEYCODE) {
      closeUploadForm();
    }
  });

  var effectImagePreview = document.querySelector('.effect-image-preview');
  var uploadEffectLevel = document.querySelector('.upload-effect-level');
  var uploadEffectsControl = document.querySelector('.upload-effect-controls');
  var activeFilter;

  /**
   * Применяет полученный в качестве аргументра фильтр в форме редактирования изображения.
   * @param {string} filterName Имя фильтра.
   */
  var applyFilter = function (filterName) {
    effectImagePreview.classList = '';
    effectImagePreview.style.filter = '';
    effectImagePreview.classList.add('effect-' + filterName);
    effectLevelPin.style.left = '100%';
    effectLevelScale.style.width = parseFloat(effectLevelPin.style.left) - effectLevelValueShift + '%';
    effectLevelValue.setAttribute('value', parseFloat(effectLevelPin.style.left));
    if (filterName === 'none') {
      uploadEffectLevel.classList.add('hidden');
    } else {
      uploadEffectLevel.classList.remove('hidden');
    }
    activeFilter = filterName;
  };

  /**
   * Функция-обработчик событий. Помогает менять фильтры изображений.
   * @param {Object} evt Объект текущего события.
   */
  var onFilterChange = function (evt) {
    if (evt.target.type === 'radio') {
      applyFilter(evt.target.value);
    }
  };

  var decreasePhotoButton = document.querySelector('.upload-resize-controls-button-dec');
  var increasePhotoButton = document.querySelector('.upload-resize-controls-button-inc');
  var scaleValue = document.querySelector('.upload-resize-controls-value');
  var scale = 1;
  var step = 0.25;

  /**
   * Увеличивает фото при нажатии на '+' и уменьшает при нажатии на '-'.
   * @param {Object} evt Объект текущего события.
   */
  var onResizePhoto = function (evt) {
    if (evt.target === decreasePhotoButton && scale > step) {
      scale -= step;
    }
    if (evt.target === increasePhotoButton && scale < 1) {
      scale += step;
    }
    effectImagePreview.style.transform = 'scale(' + scale + ')';
    scaleValue.value = scale * 100 + '%';
  };

  var effectLevelPin = document.querySelector('.upload-effect-level-pin');
  var effectLevelScale = document.querySelector('.upload-effect-level-val');
  var effectLevelValue = document.querySelector('.upload-effect-level-value');

  /**
   * Изменяет глубину эффекта при перемещении слайдера.
   * @param {Object} evt Объект текущего события.
   */
  var onPinMove = function (evt) {
    var startPinPosition = parseFloat(effectLevelPin.style.left);
    var startCoordinate = evt.clientX;

    /**
     * Реагирует на перемещение мыши, позволяет слайдеру двигаться.
     * @param {Object} moveEvt Объект текущего ссобытия.
     */
    var onMouseMove = function (moveEvt) {
      var shift = moveEvt.clientX - startCoordinate;

      effectLevelPin.style.left = (startPinPosition + shift / effectLevelProportion) + '%';
      effectLevelScale.style.width = parseFloat(effectLevelPin.style.left) - effectLevelValueShift + '%';
      effectLevelValue.setAttribute('value', parseInt(effectLevelPin.style.left, 10) + '');
      if (parseFloat(effectLevelPin.style.left) >= 0 && parseFloat(effectLevelPin.style.left) <= 100) {
        if (activeFilter === 'chrome') {
          effectImagePreview.style.filter = 'grayscale(' + parseFloat(effectLevelPin.style.left) / 100 + ')';
        } else if (activeFilter === 'sepia') {
          effectImagePreview.style.filter = 'sepia(' + parseFloat(effectLevelPin.style.left) / 100 + ')';
        } else if (activeFilter === 'marvin') {
          effectImagePreview.style.filter = 'invert(' + parseFloat(effectLevelPin.style.left) + '%)';
        } else if (activeFilter === 'phobos') {
          effectImagePreview.style.filter = 'blur(' + parseFloat(effectLevelPin.style.left) / 100 * 3 + 'px)';
        } else if (activeFilter === 'heat') {
          effectImagePreview.style.filter = 'brightness(' + parseFloat(effectLevelPin.style.left) / 100 * 3 + ')';
        }
      }

      if (parseFloat(effectLevelPin.style.left) < 0) {
        effectLevelPin.style.left = '0%';
        effectLevelScale.style.width = '0%';
        effectLevelValue.setAttribute('value', '0');
      } else if (parseFloat(effectLevelPin.style.left) > 100) {
        effectLevelPin.style.left = '100%';
        effectLevelScale.style.width = parseFloat(effectLevelPin.style.left) - effectLevelValueShift + '%';
        effectLevelValue.setAttribute('value', '100');
      }
    };

    /**
     * Удаляет обработчики событий движения и опускания мыши.
     */
    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var form = document.querySelector('#upload-select-image');
  var onSuccessSend = function () {
    uploadFormClose.click();
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), onSuccessSend, window.backend.onError);
  });
})();

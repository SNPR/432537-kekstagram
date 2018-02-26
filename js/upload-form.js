'use strict';

/**
 * Открывает диалоговое окно редактирования загруженного фото.
 * Отвечает за редактирование размера фотографии и глубину эффекта выбранного фильтра.
 */
(function () {
  var SCALE_STEP = 0.25;
  var EFFECT_LEVEL_PROPORTION = 4.55;
  var EFFECT_LEVEL_VALUE_SHIFT = 1.8;
  var EFFECT_LEVEL_SCALE_MAX_WIDTH = '98.2%';
  var uploadControl = document.querySelector('.upload-control');
  var uploadFile = document.querySelector('#upload-file');
  var uploadForm = document.querySelector('.upload-overlay');
  var uploadFormClose = uploadForm.querySelector('#upload-cancel');
  var form = document.querySelector('#upload-select-image');


  /**
   * Определяет текущий активный элемент на странице.
   * @return {string} Наименование текущего активного элемента.
   */
  var getActiveElement = function () {
    return document.activeElement.tagName;
  };


  /**
   * Вспомогательная функция для обработчика события закрытия окна при нажатии клавиши 'ESC'.
   * Нажатие 'ESC' не срабатывает, если фокус находится в поле ввода хэш-тега или комментария.
   */
  var closeUploadFormByEsc = function () {
    if (getActiveElement() !== 'INPUT' && getActiveElement() !== 'TEXTAREA') {
      uploadFormClose.click();
    }
  };

  /**
   * Обработчик события, необходим для закрытия окна редактирования фото, при нажатии клавиши 'ESC'.
   * @param {object} evt Объект текущего события.
   */
  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, closeUploadFormByEsc);
  };

  /**
   * Позволяет выбрать с диска собственное изображение. В случае, если выбранный
   * файл не является изображением, загружает пустое поле.
   */
  var getImageFromDisk = function () {
    var reader = new FileReader();
    var file = uploadFile.files[0];

    reader.addEventListener('load', function () {
      effectImagePreview.src = reader.result;
    });

    if (file && file.type.match('image.*')) {
      reader.readAsDataURL(file);
    } else {
      effectImagePreview.src = '';
    }
  };

  /**
   * Callback-функция. Закрывает форму редактирования фото при успешной отправке данных.
   */
  var onSuccessSend = function () {
    uploadFormClose.click();
  };

  /**
   * Реагирует на отправку формы пользователем. В случае успешной отправки закрывает форму.
   * В обратном случае, выдаёт ошибку.
   * @param {Object} evt Объект текущего события.
   */
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), onSuccessSend, window.backend.onError);
  };

  /**
   * Закрывает форму загрузки фотографии при клике на крестик.
   */
  var onCloseClick = function () {
    closeUploadForm();
  };

  /**
   * Закрывает форму загрузки фотографии при нажатии клавишей Enter на крестик.
   * @param {Object} evt Объект текущего события.
   */
  var onClosePress = function (evt) {
    if (evt.target === uploadFormClose && evt.keyCode === window.constantes.ENTER_KEYCODE) {
      closeUploadForm();
    }
  };

  /**
   * Вспомогательная функция, открывающая окно загрузки файла
   * и добавляющая различные обработчики событий.
   */
  var openUploadForm = function () {
    getImageFromDisk();

    scale = 1;
    effectImagePreview.style.transform = 'scale(1)';
    effectImagePreview.classList.remove('effect-' + activeFilter);
    effectImagePreview.style.filter = '';
    window.validation.hashtagInput.style.border = '';
    effectLevelPin.style.left = '100%';
    effectLevelScale.style.width = EFFECT_LEVEL_SCALE_MAX_WIDTH;

    uploadForm.classList.remove('hidden');
    uploadEffectLevel.classList.add('hidden');

    form.addEventListener('submit', onFormSubmit);
    document.addEventListener('keydown', onEscPress);
    uploadForm.addEventListener('click', onResizePhoto);
    uploadForm.addEventListener('keydown', onClosePress);
    uploadFormClose.addEventListener('click', onCloseClick);
    effectLevelPin.addEventListener('mousedown', onPinMove);
    uploadEffectsControl.addEventListener('click', onFilterClick);
    uploadEffectsControl.addEventListener('keydown', onFilterPress);
    window.validation.hashtagInput.addEventListener('input', window.validation.onHashtagsType);
    window.validation.hashtagInput.addEventListener('invalid', window.validation.onErrorCheck);
  };

  /**
   * Вспомогательная функция, скрывающая окно загрузки файла
   * и удаляющая различные обработчики событий.
   */
  var closeUploadForm = function () {
    uploadFile.value = '';
    uploadForm.classList.add('hidden');

    form.removeEventListener('submit', onFormSubmit);
    document.removeEventListener('keydown', onEscPress);
    uploadForm.removeEventListener('click', onResizePhoto);
    uploadForm.removeEventListener('keydown', onClosePress);
    uploadFormClose.removeEventListener('click', onCloseClick);
    effectLevelPin.removeEventListener('mousedown', onPinMove);
    uploadEffectsControl.removeEventListener('click', onFilterClick);
    uploadEffectsControl.removeEventListener('keydown', onFilterPress);
    window.validation.hashtagInput.removeEventListener('input', window.validation.onHashtagsType);
    window.validation.hashtagInput.removeEventListener('invalid', window.validation.onErrorCheck);
  };

  uploadFile.addEventListener('change', function () {
    openUploadForm();
  });

  uploadControl.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.constantes.ENTER_KEYCODE) {
      uploadFile.click();
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
    if (activeFilter) {
      effectImagePreview.classList.remove('effect-' + activeFilter);
    }
    effectImagePreview.classList.add('effect-' + filterName);
    effectImagePreview.style.filter = '';
    effectLevelPin.style.left = '100%';
    effectLevelScale.style.width = EFFECT_LEVEL_SCALE_MAX_WIDTH;
    effectLevelValue.setAttribute('value', parseInt(effectLevelPin.style.left, 10));
    if (filterName === 'none') {
      uploadEffectLevel.classList.add('hidden');
    } else {
      uploadEffectLevel.classList.remove('hidden');
    }
  };

  /**
   * Функция-обработчик событий. Помогает менять фильтры изображений.
   * @param {Object} evt Объект текущего события.
   */
  var onFilterClick = function (evt) {
    if (evt.target.type === 'radio') {
      applyFilter(evt.target.value);
      activeFilter = evt.target.value;
    }
  };

  /**
   * Функция-обработчик событий. Помогает менять фильтры изображений.
   * @param {Object} evt Объект текущего события.
   */
  var onFilterPress = function (evt) {
    if (evt.keyCode === window.constantes.ENTER_KEYCODE) {
      evt.target.click();
    }
  };

  var decreasePhotoButton = document.querySelector('.upload-resize-controls-button-dec');
  var increasePhotoButton = document.querySelector('.upload-resize-controls-button-inc');
  var scaleValue = document.querySelector('.upload-resize-controls-value');
  var scale = 1;

  /**
   * Увеличивает фото при нажатии на '+' и уменьшает при нажатии на '-'.
   * @param {Object} evt Объект текущего события.
   */
  var onResizePhoto = function (evt) {
    if (evt.target === decreasePhotoButton && scale > SCALE_STEP) {
      scale -= SCALE_STEP;
    }
    if (evt.target === increasePhotoButton && scale < 1) {
      scale += SCALE_STEP;
    }
    effectImagePreview.style.transform = 'scale(' + scale + ')';
    scaleValue.value = scale * 100 + '%';
  };

  var effectLevelPin = document.querySelector('.upload-effect-level-pin');
  var effectLevelScale = document.querySelector('.upload-effect-level-val');
  var effectLevelValue = document.querySelector('.upload-effect-level-value');

  /**
   * Сбрасывает ползунок уровеня эффекта при достижении минимального и максимального значений.
   * @param {string} pinPosition Положение пина.
   * @param {string} scaleLevel Ширина шкалы глубины эффекта.
   * @param {string} levelValue Величина глубины эффекта.
   */
  var resetEffectLevel = function (pinPosition, scaleLevel, levelValue) {
    effectLevelPin.style.left = pinPosition;
    effectLevelScale.style.width = scaleLevel;
    effectLevelValue.setAttribute('value', levelValue);
  };

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
      var currentPinPosition = startPinPosition + shift / EFFECT_LEVEL_PROPORTION;

      effectLevelPin.style.left = currentPinPosition + '%';
      effectLevelScale.style.width = currentPinPosition - EFFECT_LEVEL_VALUE_SHIFT + '%';
      effectLevelValue.setAttribute('value', parseInt(effectLevelPin.style.left, 10));

      if (currentPinPosition >= 0 && currentPinPosition <= 100) {
        if (activeFilter === 'chrome') {
          effectImagePreview.style.filter = 'grayscale(' + currentPinPosition / 100 + ')';
        } else if (activeFilter === 'sepia') {
          effectImagePreview.style.filter = 'sepia(' + currentPinPosition / 100 + ')';
        } else if (activeFilter === 'marvin') {
          effectImagePreview.style.filter = 'invert(' + currentPinPosition + '%)';
        } else if (activeFilter === 'phobos') {
          effectImagePreview.style.filter = 'blur(' + currentPinPosition / 100 * 3 + 'px)';
        } else if (activeFilter === 'heat') {
          effectImagePreview.style.filter = 'brightness(' + currentPinPosition / 100 * 3 + ')';
        }
      }

      if (currentPinPosition < 0) {
        resetEffectLevel('0%', '0%', '0');
      } else if (currentPinPosition > 100) {
        resetEffectLevel('100%', EFFECT_LEVEL_SCALE_MAX_WIDTH, '100');
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
})();

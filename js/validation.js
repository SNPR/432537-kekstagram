'use strict';

(function () {
  var hashTagInput = document.querySelector('.upload-form-hashtags');
  /**
   * Проверяет, если ли в массиве повторяющиеся соседние хэштеги.
   * @param {Array} array Массив строк или чисел.
   * @return {boolean} Если есть совпадения - true, иначе - false.
   */
  var checkSimilarHashtags = function (array) {
    for (var j = 0; j < array.length; j++) {
      if (array[j] === array[j + 1]) {
        return true;
      }
    }
    return false;
  };

  /**
   * Функция-обработчик событий, валидирующая поле ввода хэштегов.
   * @param {Object} evt Объект текущего события.
   */
  var onHashtagsType = function (evt) {
    var target = evt.target;
    var hashtags = target.value.toLowerCase().split(' ').sort();

    for (var i = 0; i < hashtags.length; i++) {
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
      } else if (checkSimilarHashtags(hashtags)) {
        target.setCustomValidity('Хэштеги не должны повторяться');
      } else {
        target.setCustomValidity('');
      }
    }
  };

  (function () {
    window.validation = {
      hashTagInput: hashTagInput,
      onHashtagsType: onHashtagsType
    };
  })();
})();

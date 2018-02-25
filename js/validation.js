'use strict';

/**
 * Проверяет на валидность поле ввода хэштегов.
 */
(function () {
  var hashtagInput = document.querySelector('.upload-form-hashtags');
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
   * Функция-обработчик событий, подсвечивающая поле ввода хэштегов,
   * в случае некорректного ввода значения.
   * @param {Object} evt Объект текущего события.
   */
  var onErrorCheck = function (evt) {
    var target = evt.target;
    if (target.validity) {
      target.style.border = '3px solid red';
    }
  };

  /**
   * Функция-обработчик событий, валидирующая поле ввода хэштегов.
   * @param {Object} evt Объект текущего события.
   */
  var onHashtagsType = function (evt) {
    var target = evt.target;
    var hashtags = target.value.toLowerCase().split(' ').sort();

    hashtags = hashtags.filter(function (hashtag) {
      return hashtag !== '';
    });

    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags.length > 5) {
        target.setCustomValidity('Хэштегов должно быть не больше пяти');
        break;
      } else if (hashtags[i] && hashtags[i].charAt(0) !== '#') {
        target.setCustomValidity('Хэштеги должны начинаться с символа "#"');
        break;
      } else if (hashtags[i].length > 20) {
        target.setCustomValidity('Длина хэштега должна быть не более 20 символов');
        break;
      } else if (hashtags[i].lastIndexOf('#') !== 0) {
        target.setCustomValidity('Хэштеги должны разделяться пробелами');
        break;
      } else if (checkSimilarHashtags(hashtags)) {
        target.setCustomValidity('Хэштеги не должны повторяться');
        break;
      } else {
        target.setCustomValidity('');
        target.style.border = '';
      }
    }
  };

  (function () {
    window.validation = {
      hashtagInput: hashtagInput,
      onHashtagsType: onHashtagsType,
      onErrorCheck: onErrorCheck
    };
  })();
})();

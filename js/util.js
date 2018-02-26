'use strict';

/**
 * Вспомогательный модуль для обработчиков событий.
 * Помогает запустить функцию при нажатии на определённую клавишу на клавиатуре.
 */
(function () {
  window.util = (function () {
    var ESC_KEYCODE = 27;
    var ENTER_KEYCODE = 13;

    return {
      isEscEvent: function (evt, action) {
        if (evt.keyCode === ESC_KEYCODE) {
          action();
        }
      },
      isEnterEvent: function (evt, action) {
        if (evt.keyCode === ENTER_KEYCODE) {
          action();
        }
      }
    };
  })();

})();

'use strict';

(function () {
  /**
   * Отправляет запрос на сервер.
   * @param {Function} onLoad Callback-функция, запускаемвая в случае удачной загрузки.
   * @param {Function} onError Callback-функция, запускаемвая в случае неудачной загрузки.
   */
  window.load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var URL_GET = 'https://js.dump.academy/kekstagram/data';
    var TIMEOUT = 10000;
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;

        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('GET', URL_GET);
    xhr.send();
  };
})();

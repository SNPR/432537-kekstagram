'use strict';

(function () {
  window.backend = {
    /**
     * Загружает массив объектов с данными о фотографиях с сервера.
     * @param {Function} onLoad Callback-функция, запускаемвая в случае удачной загрузки.
     * @param {Function} onError Callback-функция, запускаемвая в случае неудачной загрузки.
     */
    load: function (onLoad, onError) {
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
            error = 'По заданному адресу ничего не найдено';
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
    },
    upload: function (data, onLoad, onError) {
      var URL_SEND = 'https://js.dump.academy/kekstagram';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

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
            error = 'По заданному адресу ничего не найдено';
            break;

          default:
            error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
        }

        if (error) {
          onError(error);
        }
      });

      xhr.open('POST', URL_SEND);
      xhr.send(data);
    }
  };
})();

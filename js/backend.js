'use strict';

(function () {
  var callback = function (url, method, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
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
          error = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
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

    xhr.open(method, url);
    xhr.send(data);
  };

  window.backend = {
    load: function (onLoad, onError) {
      callback('https://js.dump.academy/kekstagram/data', 'GET', onLoad, onError);
    },

    upload: function (data, onLoad, onError) {
      callback('https://js.dump.academy/kekstagram', 'POST', onLoad, onError, data);
    },

    onError: function (errorMessage) {
      var errorNode = document.createElement('div');
      var removeNode = function () {
        document.body.removeChild(errorNode);
      };

      errorNode.style = 'z-index: 10; position: fixed; top:0; text-align: center; width: 100%; font-size: 26px;';
      errorNode.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorNode);
      setTimeout(removeNode, 5000);
    }
  };
})();

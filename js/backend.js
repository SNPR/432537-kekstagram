'use strict';

(function () {
  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var URL_POST = 'https://js.dump.academy/kekstagram';

  /**
   * Универсальная callback-функция. Подходит как для загрузки, так и для отправки данных на сервер.
   * @param {String} url Адрес для загрузки или отправки данных.
   * @param {String} method Метод запроса на сервер (GET или POST).
   * @param {Function} onLoad Callback-функция, запускающаяся случае удачной загрузки данных.
   * @param {Function} onError Callback-функция, запускающаяся в том случае, если при взаимодействии
   * с сервером что-то пошло не так.
   * @param {Object} data Объект отправляемых на сервер данных (например FormData).
   */
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
    /**
     * Callback-функция, загружающая данные с сервера.
     * @param {Function} onLoad Callback-функция, запускающаяся случае удачной загрузки данных.
     * @param {Function} onError Callback-функция, запускающаяся в том случае, если при взаимодействии
     * с сервером что-то пошло не так.
     */
    load: function (onLoad, onError) {
      callback(URL_GET, 'GET', onLoad, onError);
    },

    /**
     * Callback-функция, отправляющая данные на сервер.
     * @param {Object} data Объект данных, отправляемый на сервер.
     * @param {Function} onLoad Callback-функция, запускающаяся случае удачной загрузки данных.
     * @param {Function} onError Callback-функция, запускающаяся в том случае, если при взаимодействии
     * с сервером что-то пошло не так.
     */
    upload: function (data, onLoad, onError) {
      callback(URL_POST, 'POST', onLoad, onError, data);
    },

    /**
     * Callback-функция, запускающаяся в том случае, если при взаимодействии
     * с сервером что-то пошло не так.
     * @param {string} errorMessage Сообщение об ошибке, полученное с сервера.
     */
    onError: function (errorMessage) {
      var errorNode = document.createElement('div');
      var removeNode = function () {
        document.body.removeChild(errorNode);
      };

      errorNode.style = 'z-index: 10; position: fixed; top:0; text-align: center; width: 100%; font-size: 26px; color: orange';
      errorNode.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorNode);
      setTimeout(removeNode, 5000);
    }
  };
})();

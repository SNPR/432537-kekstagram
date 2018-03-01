'use strict';

(function () {
  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var URL_POST = 'https://js.dump.academy/kekstagram';
  var TIMEOUT = 10000;
  var ERROR_MESSAGE_TIMEOUT = 5000;

  /**
   * Универсальная callback-функция. Подходит как для загрузки, так и для отправки данных на сервер.
   * @param {String} method Метод запроса на сервер (GET или POST).
   * @param {String} url Адрес для загрузки или отправки данных.
   * @param {Function} onLoad Callback-функция, запускающаяся случае удачной загрузки данных.
   * @param {Function} onError Callback-функция, запускающаяся в том случае, если при взаимодействии
   * с сервером что-то пошло не так.
   * @param {Object} data Объект отправляемых на сервер данных (например FormData).
   */
  var callback = function (method, url, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;
      var serverResponseToAction = {
        '200': function () {
          onLoad(xhr.response);
        },
        '400': function () {
          error = 'Неверный запрос';
        },
        '401': function () {
          error = 'Пользователь не авторизован';
        },
        '404': function () {
          error = 'Сервер с фотографиями временно недоступен';
        }
      };

      serverResponseToAction[xhr.status]();

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
      callback('GET', URL_GET, onLoad, onError);
    },

    /**
     * Callback-функция, отправляющая данные на сервер.
     * @param {Object} data Объект данных, отправляемый на сервер.
     * @param {Function} onLoad Callback-функция, запускающаяся случае удачной загрузки данных.
     * @param {Function} onError Callback-функция, запускающаяся в том случае, если при взаимодействии
     * с сервером что-то пошло не так.
     */
    upload: function (data, onLoad, onError) {
      callback('POST', URL_POST, onLoad, onError, data);
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
      setTimeout(removeNode, ERROR_MESSAGE_TIMEOUT);
    }
  };
})();

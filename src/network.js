export function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.responseType = 'text';

  xhr.onload = function onLoad(e) {
    if (this.status === 200) {
      callback(null, JSON.parse(xhr.response));
      return;
    }
    callback(new Error(e), xhr);
  };

  xhr.onerror = function onError(e) {
    callback(e, xhr);
  };

  xhr.send();
}

export function postJSON(url, content, callback) {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'text';

  xhr.onload = function onLoad(e) {
    if (this.status === 200) {
      callback(null, xhr.response);
      return;
    }
    callback(new Error(e), xhr);
  };

  xhr.onerror = function onError(e) {
    callback(e, xhr);
  };

  xhr.send(JSON.stringify(content));
}

export function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.responseType = 'text';

    xhr.onload = function(e) {
        if(this.status === 200) {
            return callback(null, JSON.parse(xhr.response));
        }
        callback(new Error(e), xhr);
    };

    xhr.onerror = function(e) {
        callback(e, xhr);
    };

    xhr.send();
}

export function postJSON(url, content, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.responseType = 'text';

    xhr.onload = function(e) {
        if(this.status === 200) {
            return callback(null, xhr.response);
        }
        callback(new Error(e), xhr);
    };

    xhr.onerror = function(e) {
        callback(e, xhr);
    };

    xhr.send(JSON.stringify(content));
}
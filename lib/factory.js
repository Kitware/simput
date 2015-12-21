var React = require('react'),
    ReactDOM = require('react-dom');
    //uiFactory = require('tonic-ui/lib/react/properties/Factory');

function getJSON(url, callback) {
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

function setupChoices(choices){
    var Choices = React.createClass({
        getDefaultProps(){
            return {choices: []};
        },
        render() {
            function listamatize(el, index) {
                return (
                    <li key={index} onClick={setupSimput} name={el}>{el}</li>
                );
            }
            
            return (
                <ul>
                    {this.props.choices.map(listamatize)}
                </ul>
            );
        }
    });
    ReactDOM.render(<Choices choices={choices}/>, document.getElementById('content'));
}

function setupSimput(event) {
    console.log('unimplemented', event.target.getAttribute('name'));
}

export function createViewer(url, callback) {
    getJSON(url, (error, data) => {
        if (error) {
            console.error(error.toString());
            return;
        }
        
        if (!data.input) {
            setupChoices(data.data);
            return;
        }
    });
}

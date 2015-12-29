import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './Simput';

const container = document.querySelector('.react-content');

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
        },
    });
    ReactDOM.render(<Choices choices={choices}/>, container);
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
        
        if (data.input) {
            const scriptToLoad = '/type/' + data.data.type + '.js';
            const body= document.getElementsByTagName('body')[0];
            const script= document.createElement('script');
            script.type= 'text/javascript';
            script.src= scriptToLoad;
            script.onload = () => {
                var module = Simput.types[data.data.type];
                ReactDOM.unmountComponentAtNode(container);
                ReactDOM.render(<App data={data.data} model={module.model}/>, container);
            };
            body.appendChild(script);            
        } else {
            setupChoices(data.data);
        }
    });
}

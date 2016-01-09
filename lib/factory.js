import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './Simput';
import Labels   from './Labels';
import {getJSON}  from './network';

const container = document.querySelector('.react-content');

function setupSimput(event) {
    //console.log('unimplemented', event.target.getAttribute('name'));
    createViewer('/type/' + event.target.getAttribute('name') + '.js', () => {
        console.log('new!');
    });
}

function setupChoices(choices){
    var Choices = React.createClass({
        displayName: 'Choices',
        propTypes: {
            choices: React.PropTypes.array,
        },
        getDefaultProps(){
            return {choices: []};
        },
        render() {
            function listamatize(el, index) {
                return (
                    <li style={{cursor: 'pointer'}} key={index} onClick={setupSimput} name={el}>{el}</li>
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

export function createViewer(url, callback) {
    var lang = 'en';
    getJSON(url, (error, data) => {
        if (error) {
            console.error(error.toString());
            return;
        }
        
        if (data.input) {
            const scriptToLoad = '/type/' + data.data.type + '.js';
            const body = document.getElementsByTagName('body')[0];
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = scriptToLoad;
            script.onload = () => {
                var module = Simput.types[data.data.type],
                    labels = new Labels(module, lang), // <= FIXME pick the right language // --lang
                    help = {},     // FIXME too,
                    convert = module.convert;
                    
                if (module.lang[lang] && module.lang[lang].help) {
                    help = module.lang[lang].help;
                }
                ReactDOM.unmountComponentAtNode(container);
                ReactDOM.render(<App data={data.data} model={module.model} labels={labels} help={help} convert={convert}/>, container);
            };
            body.appendChild(script);            
        } else {
            setupChoices(data.data);
        }
    });
}
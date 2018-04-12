import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import App from './Simput';
import Labels from './Labels';
import { getJSON } from './network';

const container = document.querySelector('.react-content');

function mountViewer(data, lang) {
  const scriptToLoad = `/type/${data.type}.js`;
  const body = document.getElementsByTagName('body')[0];
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scriptToLoad;
  script.onload = () => {
    const module = Simput.types[data.type];
    const labels = new Labels(module, lang); // <= FIXME pick the right language // --lang
    let help = {}; // FIXME too,
    const convert = module.convert;
    const parse = module.parse;

    if (module.lang[lang] && module.lang[lang].help) {
      help = module.lang[lang].help;
    }
    ReactDOM.unmountComponentAtNode(container);
    ReactDOM.render(
      <App
        data={data}
        model={module.model}
        labels={labels}
        help={help}
        convert={convert}
        parse={parse}
      />,
      container
    );
  };

  body.appendChild(script);
}

/* eslint-disable no-use-before-define */
function createViewer(url, callback) {
  const lang = 'en';
  getJSON(url, (error, data) => {
    if (error) {
      console.error(error.toString());
      return;
    }

    if (data.input) {
      mountViewer(data.data, lang);
    } else {
      setupChoices(data.data);
    }
  });
}
/* eslint-enable no-use-before-define */

function setupSimput(event) {
  const type = event.target.getAttribute('name');
  mountViewer({ data: {}, type }, 'en');
}

function listAmatize(el, index) {
  return (
    <li
      style={{ cursor: 'pointer' }}
      key={index}
      onClick={setupSimput}
      name={el}
    >
      {el}
    </li>
  );
}

function Choices(props) {
  return <ul>{props.choices.map(listAmatize)}</ul>;
}

Choices.propTypes = {
  choices: PropTypes.array,
};

Choices.defaultProps = {
  choices: [],
};

function setupChoices(choices) {
  ReactDOM.render(<Choices choices={choices} />, container);
}

export default {
  createViewer,
};

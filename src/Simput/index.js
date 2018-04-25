import React from 'react';
import PropTypes from 'prop-types';

import PropertyPanelBlock from 'paraviewweb/src/React/Properties/PropertyPanel';

import style from 'SimputStyle/Simput.mcss';

import ViewMenu from '../ViewMenu';
import modelGenerator from '../modelGenerator';
import { postJSON } from '../network';

const buttonStates = {
  normal: style.normalStateIcon,
  busy: style.busyStateIcon,
  error: style.errorStateIcon,
  success: style.successStateIcon,
};

/* eslint-disable no-alert */

export default class Simput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullData: props.data, // { type: '', data: {...}, external: {} }
      panelData: [], // data for the current property panel
      viewData: {}, // generated data structure for the view
      downloadButtonState: 'normal',
      hooks: [],
      model: props.model,
    };

    // Bind callback
    this.saveModel = this.saveModel.bind(this);
    this.parseFile = this.parseFile.bind(this);
    this.convertModel = this.convertModel.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.updateActive = this.updateActive.bind(this);
    this.updateViewData = this.updateViewData.bind(this);
    this.applyHooksAndSaveState = this.applyHooksAndSaveState.bind(this);
  }

  saveModel() {
    this.downloadFile(
      JSON.stringify(this.state.fullData, null, 2),
      this.state.fullData.type
    );
  }

  parseFile(e) {
    if (e.currentTarget.files.length === 0) {
      alert('No files selected');
      return;
    }
    const type = this.state.fullData.type;
    const file = e.currentTarget.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const newFullData = Object.assign({}, this.state.fullData);
      if (this.props.parse) {
        try {
          newFullData.data = this.props.parse(type, reader.result);
          this.setState({ fullData: newFullData });
        } catch (error) {
          alert(`Error parsing file:\n${error}`);
        }
      } else {
        alert('Cannot parse file as no parse method is provided');
      }
    };
    reader.readAsText(file);
  }

  convertModel() {
    if (!this.props.convert) {
      console.log(
        `There is no convert function for "${this.state.fullData.type}"`
      );
      return;
    }

    const results = this.props.convert(this.state.fullData);

    if (!results.error) {
      console.log('posting', results);
      this.setState({ downloadButtonState: 'busy' });
      postJSON(
        '/data',
        {
          results: results.results,
          model: results.model,
          copies: results.copies || [],
        },
        (error, data) => {
          if (error) {
            console.log('there was an error');
            console.log(error.message);
            this.setState({ downloadButtonState: 'error' });
          }
          this.setState({ downloadButtonState: 'success' });
          setTimeout(() => {
            this.setState({ downloadButtonState: 'normal' });
          }, 2000);
        }
      );
    } else {
      console.log('There was an error converting: ');
      console.log(results.error.message);
    }
  }

  // contents is a string here.
  /* eslint-disable class-methods-use-this */
  downloadFile(contents, type) {
    const newFileContent = new Blob([contents], {
      type: 'application/octet-binary',
    });
    const downloadURL = window.URL.createObjectURL(newFileContent);
    const downloadLink = document.getElementById('file-download-link');

    downloadLink.href = downloadURL;
    downloadLink.download = `${type}.json`;
    downloadLink.click();

    // Free memory
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadURL);
    }, 1000);
  }
  /* eslint-enable class-methods-use-this */

  updateActive(viewId, index) {
    if (viewId === -1 && index === -1) {
      const panelData = [];
      const viewData = {};
      this.setState({ panelData, viewData }, () => {
        this.applyHooksAndSaveState(viewData);
      });
      return;
    }

    const panelData = modelGenerator(
      this.state.model,
      this.state.fullData,
      viewId,
      index,
      this.props.labels.activeLabels
        ? this.props.labels.activeLabels.attributes
        : null,
      this.props.help
    );
    const viewData = this.state.fullData.data[viewId][index];
    const hooks = this.state.model.views[viewId].hooks || [];

    this.setState({ panelData, viewData, hooks }, () => {
      this.applyHooksAndSaveState(viewData);
    });
  }

  applyHooksAndSaveState(viewData) {
    const stateToUpdate = { viewData };
    const { hooks } = this.state;
    for (let i = 0; i < hooks.length; i++) {
      const hookConfig = hooks[i];
      global.Simput.applyHook(
        hookConfig,
        this.state.fullData,
        viewData,
        this.state.model
      );
      stateToUpdate.fullData = this.state.fullData;
      stateToUpdate.model = this.state.model;
    }

    this.setState(stateToUpdate);
  }

  updateViewData(newData) {
    const viewData = this.state.viewData;
    const keypath = newData.id.split('.');
    const attrName = keypath.shift();
    viewData[attrName][keypath.join('.')].value = newData.value;

    this.applyHooksAndSaveState(viewData);
  }

  render() {
    return (
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>Simput</span>
          <div>
            {this.props.convert !== null ? (
              <div style={{ display: 'inline-block' }}>
                <input
                  type="file"
                  id="fileElem"
                  style={{ display: 'none' }}
                  onChange={this.parseFile}
                />
                <label
                  className={[style.button, style.buttonLabel].join(' ')}
                  htmlFor="fileElem"
                >
                  Import File <i className={style.uploadIcon} />
                </label>
              </div>
            ) : null}
            <button className={style.button} onClick={this.saveModel}>
              <span className={style.buttonText}>Download Model</span>
              <i className={style.saveIcon} />
            </button>
            <button
              className={style.button}
              onClick={this.convertModel}
              disabled={this.state.downloadButtonState !== 'normal'}
            >
              <span className={style.buttonText}>Save & Convert</span>
              <i className={buttonStates[this.state.downloadButtonState]} />
            </button>
          </div>
        </div>
        <div className={style.content}>
          <ViewMenu
            data={this.state.fullData}
            model={this.state.model}
            labels={this.props.labels}
            onChange={this.updateActive}
          />
          <div className={style.block}>
            <PropertyPanelBlock
              className={style.panel}
              input={this.state.panelData}
              labels={this.props.labels}
              viewData={this.state.viewData}
              onChange={this.updateViewData}
            />
          </div>
        </div>
      </div>
    );
  }
}

Simput.propTypes = {
  convert: PropTypes.func,
  data: PropTypes.object,
  help: PropTypes.object,
  labels: PropTypes.object,
  model: PropTypes.object,
  parse: PropTypes.func,
};

Simput.defaultProps = {
  convert: undefined,
  data: undefined,
  help: undefined,
  labels: undefined,
  model: undefined,
  parse: undefined,
};

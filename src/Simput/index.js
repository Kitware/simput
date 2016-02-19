import PropertyPanelBlock   from 'paraviewweb/src/React/Properties/PropertyPanel';
import React                from 'react';
import ViewMenu             from '../ViewMenu';
import modelGenerator       from '../modelGenerator';
import {postJSON}           from '../network';
import style                from 'SimputStyle/Simput.mcss';

const buttonStates = {
    normal: style.normalStateIcon,
    busy: style.busyStateIcon,
    error: style.errorStateIcon,
    success: style.successStateIcon,
};

export default React.createClass({

    displayName: 'Simput',

    propTypes: {
        convert: React.PropTypes.func,
        data: React.PropTypes.object,
        help: React.PropTypes.object,
        labels: React.PropTypes.object,
        model: React.PropTypes.object,
    },

    getInitialState() {
        return {
            data: [],
            viewData: {},
            downloadButtonState: 'normal',
        };
    },

    saveModel() {
        this.downloadFile(JSON.stringify(this.props.data, null, '    '));
    },

    convertModel() {
        if (!this.props.convert) {
            console.log(`There is no convert function for "${this.props.data.type}"`);
            return;
        }

        const results = this.props.convert(this.props.data);

        if (!results.error) {
            console.log('posting', results);
            this.setState({downloadButtonState: 'busy'});
            postJSON( '/data', {results:results.results, model:results.model},
                (error, data) => {
                    if (error) {
                        console.log('there was an error');
                        console.log(error.message);
                        this.setState({downloadButtonState: 'error'});
                    }
                    this.setState({downloadButtonState: 'success'});
                    setTimeout(() => {
                        this.setState({downloadButtonState: 'normal'});
                    }, 2000);
                });
        } else {
            console.log('There was an error converting: ');
            console.log(results.error.message);
        }
    },

    downloadFile(contents) {
        var newFileContent = new Blob([contents], {type: 'application/octet-binary'}),
            downloadURL = window.URL.createObjectURL(newFileContent),
            downloadLink = document.getElementById('file-download-link');

        downloadLink.href = downloadURL;
        downloadLink.download = this.props.data.type + '.json';
        downloadLink.click();

        // Free memory
        setTimeout(function(){
            window.URL.revokeObjectURL(downloadURL);
        }, 1000);
    },

    updateActive(viewId, index) {
        const data = modelGenerator(this.props.model, this.props.data, viewId, index,
                this.props.labels.activeLabels.attributes, this.props.help),
            viewData = this.props.data.data[viewId][index];
        this.setState({data, viewData});
    },

    updateViewData(newData) {
        const data = this.state.viewData,
            keypath = newData.id.split('.'),
            attrName = keypath.shift();

        data[attrName][keypath.join('.')].value = newData.value;
        this.setState({viewData: data});
    },

    render() {
        return (<div className={ style.container }>
                    <div className={ style.header }>
                        <span className={ style.title }>Simput</span>
                        <div>
                            <button className={ style.button } onClick={ this.saveModel }>
                                <span className={ style.buttonLabel }>Download Model</span>
                                <i className={ style.saveIcon }></i>
                            </button>
                            <button className={ style.button } onClick={ this.convertModel } disabled={this.state.downloadButtonState !== 'normal'}>
                                <span className={ style.buttonLabel }>Save & Convert</span>
                                <i className={buttonStates[this.state.downloadButtonState]}></i>
                            </button>
                        </div>
                    </div>
                    <div className={ style.content }>
                        <ViewMenu data={ this.props.data }
                            model={ this.props.model }
                            labels={this.props.labels}
                            onChange={ this.updateActive }/>
                        <PropertyPanelBlock
                            className={ style.panel }
                            input={this.state.data}
                            labels={this.props.labels}
                            viewData={this.state.viewData}
                            onChange={ this.updateViewData } />
                    </div>
                </div>);
    },
});

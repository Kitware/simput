require('./styles.css');

import PropertyPanelBlock   from 'tonic-ui/lib/react/properties';
import React                from 'react';
import ViewMenu             from '../ViewMenu';
import modelGenerator       from '../modelGenerator';
import {postJSON}             from '../network';

export default React.createClass({

    displayName: 'Simput',

    propTypes: {
        data: React.PropTypes.object,
        labels: React.PropTypes.object,
        model: React.PropTypes.object,
        convert: React.PropTypes.func,
    },

    getInitialState() {
        return {
            data: [],
            viewData: {},
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
            console.log('posting', results.results);
            postJSON( '/data', results.results, (error, data) => {
                if (error) {
                    console.log('there was an error');
                    console.log(error.message);
                }
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
        const data = modelGenerator(this.props.model, this.props.data.data, viewId, index, 
                this.props.labels.activeLabels.attributes, this.props.help),
            viewData = this.props.data.data[viewId][index];
        this.setState({data, viewData});
    },

    updateViewData(newData) {
        const data = this.state.viewData,
            keypath = newData.id.split('.');
        
        data[keypath[0]][keypath[1]].value = newData.value;
        this.setState({viewData: data});
    },

    render() {
        return (<div className='Simput'>
                    <div className="Simput-header">
                        <button onClick={ this.saveModel }>
                            <span>Save</span>
                            <i className="fa fa-database"></i>
                        </button>
                        <button onClick={ this.convertModel }>
                            <span>Convert</span>
                            <i className="fa fa-save"></i>
                        </button>
                    </div>
                    <ViewMenu data={ this.props.data } 
                        model={ this.props.model } 
                        labels={this.props.labels} 
                        onChange={ this.updateActive }/>
                    <PropertyPanelBlock 
                        input={this.state.data} 
                        labels={this.props.labels}
                        viewData={this.state.viewData} 
                        onChange={ this.updateViewData } />
                </div>);
    },
});

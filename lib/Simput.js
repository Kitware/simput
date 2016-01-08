import PropertyPanelBlock   from 'tonic-ui/lib/react/properties';
import React                from 'react';
import ViewMenu             from './ViewMenu';
import modelGenerator       from './modelGenerator';

export default React.createClass({

    displayName: 'Simput',

    propTypes: {
        data: React.PropTypes.object,
        labels: React.PropTypes.object,
        model: React.PropTypes.object,
    },

    getInitialState() {
        return {
            data: [],
            viewData: {},
        };
    },

    updateActive(viewId, index) {
        const data = modelGenerator(this.props.model, this.props.data.data, viewId, index, this.props.labels.activeLabels.attributes),
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

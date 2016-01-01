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
        };
    },

    updateActive(viewId, index) {
        const data = modelGenerator(this.props.model, this.props.data.data, viewId, index);
        this.setState({data});
    },

    render() {
        return (<div className='Simput'>
                    <ViewMenu data={ this.props.data } model={ this.props.model } labels={this.props.labels} onChange={ this.updateActive }/>
                    <PropertyPanelBlock input={this.state.data} labels={this.props.labels}/>
                </div>);
    },
});

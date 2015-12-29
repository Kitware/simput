import React from 'react';
import ViewMenu from './ViewMenu';

export default React.createClass({

    displayName: 'Simput',

    propTypes: {
        data: React.PropTypes.object,
        model: React.PropTypes.object,
    },

    getInitialState() {
        return {
            viewId: null,
            index: 0,
        };
    },

    updateActive(viewId, index) {
        this.setState({viewId, index});
    },

    render() {
        return (<div className='Simput'>
                    <ViewMenu data={ this.props.data } model={ this.props.model } onChange={ this.updateActive }/>
                    <div>{ this.state.viewId } - { this.state.index }</div>
                </div>);
    },
});

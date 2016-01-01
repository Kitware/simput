import React from 'react';

require('./style.css');

export default React.createClass({

    displayName: 'ViewMenu',

    propTypes: {
        data: React.PropTypes.object,
        labels: React.PropTypes.object,
        model: React.PropTypes.object,
        onChange: React.PropTypes.func,
    },

    getInitialState() {
        return {
            viewId: null,
            index: 0,
        };
    },

    addView(viewId) {
        const viewList = this.props.data.data[viewId] || [],
            index = viewList.length,
            name = this.props.labels.getView(viewId) + ' ' + index;

        viewList.push({ name });
        this.props.data.data[viewId] = viewList;

        this.activateSection(viewId, index);
    },

    removeView(viewId, index) {
        this.props.data.data[viewId].splice(index, 1);
        this.activateSection(viewId, index > 0 ? index - 1 : 0);
    },

    activateSection(viewId, index) {
        const viewList = this.props.data.data[viewId] || [];
        if(viewList.length <= index) {
            viewList.push({ name: this.props.labels.getView(viewId) });
            this.props.data.data[viewId] = viewList;
        }
        this.setState({viewId, index});
        if(this.props.onChange) {
            this.props.onChange(viewId, index);
        }
    },

    render() {
        return (<div className='Outline'>
                    <ul>
                    { this.props.model.order.map( viewId => {
                        const viewList = this.props.data.data[viewId] || [],
                            hasSubList = this.props.data.data[viewId] && this.props.data.data[viewId].length > 0,
                            viewSize = this.props.model.views[viewId].size,
                            children = this.props.model.views[viewId].children || [];
                        return <li key={ 'view-list-' + viewId }>
                            <i className='fa fa-fw fa-check'></i>
                            <span onClick={ this.activateSection.bind(this, viewId, 0) }>{ this.props.labels.getView(viewId) }</span>
                            <i className='fa fa-fw fa-plus' 
                               style={{ display: (viewSize === -1 ? '' : 'none') }} 
                               onClick={ this.addView.bind(this, viewId) } >
                            </i>
                            <ul style={{ display: (hasSubList && viewSize !== undefined) ? '' : 'none' }}>
                            { viewList.map( (viewData, idx) => {
                                return <li key={ 'view-' + viewId + '-' + idx } 
                                           style={{ fontWeight: (viewId === this.state.viewId && idx === this.state.index) ? 'bold' : 'normal' }}>
                                        <span onClick={ this.activateSection.bind(this, viewId, idx) }>{ viewData.name }</span>
                                        <i className='fa fa-fw fa-trash' onClick={ this.removeView.bind(this, viewId, idx) }></i>
                                    </li>;
                            })}
                            </ul>
                            <ul style={{ display: children.length ? '': 'none'}}>
                            { children.map( subViewId => {
                                return <li key={ 'sub-view-' + subViewId }>
                                    <i className='fa fa-fw fa-check'></i>
                                    <span onClick={ this.activateSection.bind(this, subViewId, 0) }>{ this.props.labels.getView(viewId) }</span>
                                </li>;
                            })}
                            </ul>
                        </li>;
                    })}
                    </ul>
                </div>);
    },
});

import React            from 'react';
import ContentEditable  from 'paraviewweb/src/React/Widgets/ContentEditableWidget';
import style            from 'SimputStyle/ViewMenu.mcss';

/* eslint-disable react/jsx-no-bind */
export default React.createClass({

  displayName: 'ViewMenu',

  propTypes: {
    className: React.PropTypes.string,
    data: React.PropTypes.object,
    labels: React.PropTypes.object,
    model: React.PropTypes.object,
    onChange: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      className: '',
    };
  },

  getInitialState() {
    return {
      viewId: null,
      index: 0,
      editingIndex: -1,
    };
  },

  componentDidUpdate() {
    if (this.state.editingIndex !== -1) {
      this.refs.editable.setFocus();
    }
  },

  addView(viewId) {
    const viewList = this.props.data.data[viewId] || [],
      index = viewList.length,
      name = `${this.props.labels.getView(viewId)} ${index}`;

    viewList.push({ name });
    this.props.data.data[viewId] = viewList;

    this.activateSection(viewId, index);
  },

  removeView(viewId, index) {
    // console.log(viewId, index);
    this.props.data.data[viewId].splice(index, 1);
    this.activateSection(viewId, index > 0 ? index - 1 : 0);
  },

  editView(viewId, index) {
    this.setState({ editingIndex: `${viewId}-${index}` });
  },

  stopEditingView() {
    this.setState({ editingIndex: -1 });
  },

  activateSection(viewId, index) {
    const viewList = this.props.data.data[viewId] || [];
    if (viewList.length <= index) {
      viewList.push({ name: this.props.labels.getView(viewId) });
      this.props.data.data[viewId] = viewList;
    }
    this.setState({ viewId, index });
    if (this.props.onChange) {
      this.props.onChange(viewId, index);
    }
  },

  render() {
    const isActive = (viewId, idx) => (viewId === this.state.viewId && idx === this.state.index);

    return (
      <div className={ [this.props.className, style.container].join(' ')}>
        <ul className={ style.rootList }>
        { this.props.model.order.map((viewId, idx) => {
          const viewList = this.props.data.data[viewId] || [],
            hasSubList = this.props.data.data[viewId] && this.props.data.data[viewId].length > 0,
            viewSize = this.props.model.views[viewId].size,
            children = this.props.model.views[viewId].children || [];

          return (
            <li
              key={ `view-list-${viewId}` }
              className={ isActive(viewId, viewSize !== -1 ? 0 : viewSize) ? style.activeListItem : style.listItem }
            >
              <span
                onClick={ this.activateSection.bind(this, viewId, 0) }
              >{ this.props.labels.getView(viewId) }</span>
            <i
              className={ viewSize === -1 ? style.addButton : style.hidden }
              onClick={ this.addView.bind(this, viewId) }
            >
            </i>
            <ul className={ (hasSubList && viewSize !== undefined) ? style.list : style.hidden }>
            { viewList.map((viewData, viewIdx) => {
              if (this.state.editingIndex === `${viewId}-${viewIdx}`) {
                return (
                  <li
                    key={ `view-${viewId}-${viewIdx}` }
                    className={ isActive(viewId, viewIdx) ? style.activeListItem : style.listItem }
                  >
                    <ContentEditable
                      ref="editable"
                      html={viewData.name}
                      blurOnEnter
                      className={ style.inLineBlock }
                      onChange={ (e) => {viewData.name = e.target.value;} }
                      onBlur={this.stopEditingView}
                    />
                    <i
                      className={ style.deleteButton }
                      style={{ visibility: 'hidden' }}
                    >
                    </i>
                    <i
                      className={ style.editButton }
                      style={{ visibility: 'hidden' }}
                    >
                    </i>
                  </li>);
              }

              return (
                <li
                  key={ `view-${viewId}-${viewIdx}` }
                  className={ isActive(viewId, viewIdx) ? style.activeListItem : style.listItem }
                >
                  <span
                    className={ style.editable }
                    onClick={ this.activateSection.bind(this, viewId, viewIdx) }
                  >{ viewData.name }</span>
                  <i
                    className={ style.deleteButton }
                    onClick={ this.removeView.bind(this, viewId, viewIdx) }
                  ></i>
                  <i
                    className={ style.editButton }
                    onClick={ this.editView.bind(this, viewId, viewIdx) }
                  ></i>
                </li>);
            })}
            </ul>
            <ul className={ children.length ? style.list : style.hidden }>
            { children.map((subViewId, subIdx) =>
                <li
                  key={ `sub-view-${subViewId}` }
                  className={ isActive(subViewId, subIdx) ? style.activeListItem : style.listItem }
                >
                  <i className={ style.validIcon }></i>
                  <span onClick={ this.activateSection.bind(this, subViewId, subIdx) }>
                      { this.props.labels.getView(subViewId) }
                  </span>
                </li>
            )}
            </ul>
          </li>);
        })}
        </ul>
      </div>);
  },
});

import React from 'react';
import PropTypes from 'prop-types';

import ContentEditable from 'paraviewweb/src/React/Widgets/ContentEditableWidget';
import style from 'SimputStyle/ViewMenu.mcss';

/* eslint-disable react/jsx-no-bind */
export default class ViewMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewId: null,
      index: 0,
      editingIndex: -1,
      collapseViews: {},
      nextViewId: props.nextViewId,
    };

    // Bind callback
    this.addView = this.addView.bind(this);
    this.removeView = this.removeView.bind(this);
    this.editView = this.editView.bind(this);
    this.stopEditingView = this.stopEditingView.bind(this);
    this.activateSection = this.activateSection.bind(this);
    this.getBulletType = this.getBulletType.bind(this);
  }

  componentDidMount() {
    if (this.props.model.defaultActiveView) {
      this.activateSection(this.props.model.defaultActiveView, 0);
    }
  }

  componentDidUpdate() {
    if (this.state.editingIndex !== -1) {
      this.editable.setFocus();
    }
  }

  getBulletType(viewId) {
    const viewSize = this.props.model.views[viewId].size;
    const children = this.props.model.views[viewId].children || [];

    if (viewSize === -1 || children.length) {
      return this.state.collapseViews[viewId]
        ? 'collapsedBullet'
        : 'expendedBullet';
    }

    return 'noBullet';
  }

  addView(viewId) {
    const viewList = this.props.data.data[viewId] || [];
    const index = viewList.length;
    const name = `${this.props.labels.getView(viewId)} ${index}`;

    viewList.push({ name });
    this.props.data.data[viewId] = viewList;

    this.activateSection(viewId, index);
  }

  removeView(viewId, index) {
    this.props.data.data[viewId].splice(index, 1);

    if (this.state.viewId === viewId) {
      if (this.props.data.data[viewId].length) {
        this.activateSection(viewId, index >= 0 ? index - 1 : index);
      } else {
        this.activateSection(null, -1);
      }
    } else {
      this.activateSection(viewId, -1);
    }
  }

  editView(viewId, index) {
    this.setState({ editingIndex: `${viewId}-${index}`, viewId, index });
  }

  stopEditingView() {
    if (this.props.onChange) {
      this.props.onChange(this.state.viewId, this.state.index);
    }
    this.setState({ editingIndex: -1 });
  }

  activateSection(viewId, index) {
    let { nextViewId } = this.state;
    const viewList = this.props.data.data[viewId] || [];
    while (viewList.length <= index) {
      viewList.push({
        name: this.props.labels.getView(viewId),
        id: nextViewId++,
      });
    }
    this.props.data.data[viewId] = viewList;

    if (index > -1 && !viewList[index].id) {
      viewList[index].id = nextViewId++;
    }

    this.setState({
      viewId: index > -1 ? viewId : this.state.viewId,
      index: index > -1 ? index : this.state.index,
      nextViewId,
    });
    if (this.props.onChange) {
      this.props.onChange(viewId, index);
    }
  }

  toggleCollapse(viewId) {
    const { collapseViews } = this.state;
    collapseViews[viewId] = !collapseViews[viewId];
    this.setState({ collapseViews });
  }

  render() {
    const isActive = (viewId, idx) =>
      viewId === this.state.viewId && idx === this.state.index;

    return (
      <div className={[this.props.className, style.container].join(' ')}>
        <ul className={style.rootList}>
          {this.props.model.order.map((viewId, idx) => {
            const viewList = this.props.data.data[viewId] || [];
            const hasSubList =
              this.props.data.data[viewId] &&
              this.props.data.data[viewId].length > 0;
            const viewSize = this.props.model.views[viewId].size;
            const children = this.props.model.views[viewId].children || [];

            if (
              this.props.data.hideViews &&
              this.props.data.hideViews.indexOf(viewId) !== -1
            ) {
              return null;
            }

            return (
              <li
                key={`view-list-${viewId}`}
                className={
                  isActive(viewId, viewSize !== -1 ? 0 : viewSize)
                    ? style.activeListItem
                    : style.listItem
                }
              >
                <div className={style.listRow}>
                  <span
                    className={style[this.getBulletType(viewId)]}
                    onClick={this.toggleCollapse.bind(this, viewId)}
                  >
                    <svg
                      className={style.caret}
                      width="15"
                      height="15"
                      viewBox="0 0 26 26"
                    >
                      <path d="M11,1 L21,11 L11,21 L1,11" />
                    </svg>
                  </span>
                  <span
                    className={style.listRowName}
                    onClick={this.activateSection.bind(this, viewId, 0)}
                  >
                    {this.props.labels.getView(viewId)}
                  </span>
                  <i
                    className={viewSize === -1 ? style.addButton : style.hidden}
                    onClick={this.addView.bind(this, viewId)}
                  />
                </div>
                <ul
                  className={
                    hasSubList &&
                    viewSize !== undefined &&
                    !this.state.collapseViews[viewId]
                      ? style.nestedList
                      : style.hidden
                  }
                >
                  {viewList.map((viewData, viewIdx) => {
                    if (this.state.editingIndex === `${viewId}-${viewIdx}`) {
                      return (
                        <li
                          key={`view-${viewId}-${viewIdx}`}
                          className={
                            isActive(viewId, viewIdx)
                              ? style.activeListItem
                              : style.listItem
                          }
                        >
                          <ContentEditable
                            ref={(c) => {
                              this.editable = c;
                            }}
                            html={viewData.name}
                            blurOnEnter
                            className={style.inLineBlock}
                            onChange={(e) => {
                              viewData.name = e.target.value;
                            }}
                            onBlur={this.stopEditingView}
                          />
                          <i
                            className={style.deleteButton}
                            style={{ display: 'none' }}
                          />
                          <i
                            className={style.editButton}
                            style={{ display: 'none' }}
                          />
                        </li>
                      );
                    }

                    return (
                      <li
                        key={`view-${viewId}-${viewIdx}`}
                        className={
                          isActive(viewId, viewIdx)
                            ? style.activeListItem
                            : style.listItem
                        }
                      >
                        <div className={style.listRow}>
                          <span
                            className={[style.editable, style.listRowName].join(
                              ' '
                            )}
                            onClick={this.activateSection.bind(
                              this,
                              viewId,
                              viewIdx
                            )}
                          >
                            {viewData.name}
                          </span>
                          <i
                            className={style.deleteButton}
                            onClick={this.removeView.bind(
                              this,
                              viewId,
                              viewIdx
                            )}
                            style={{
                              display:
                                this.props.model.views[viewId].noDelete ||
                                viewData.noDelete
                                  ? 'none'
                                  : 'inline-block',
                            }}
                          />
                          <i
                            className={style.editButton}
                            onClick={this.editView.bind(this, viewId, viewIdx)}
                            style={{
                              display:
                                this.props.model.views[viewId].readOnly ||
                                viewData.readOnly
                                  ? 'none'
                                  : 'inline-block',
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>{' '}
                {/* closes `hasSubList && viewSize !== undefined` */}
                <ul
                  className={children.length ? style.nestedList : style.hidden}
                >
                  {children.map((subViewId, subIdx) => (
                    <li
                      key={`sub-view-${subViewId}`}
                      className={
                        isActive(subViewId, subIdx)
                          ? style.activeListItem
                          : style.listItem
                      }
                    >
                      <i className={style.validIcon} />
                      <span
                        onClick={this.activateSection.bind(
                          this,
                          subViewId,
                          subIdx
                        )}
                      >
                        {this.props.labels.getView(subViewId)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

ViewMenu.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  labels: PropTypes.object,
  model: PropTypes.object,
  onChange: PropTypes.func,
  nextViewId: PropTypes.number,
};

ViewMenu.defaultProps = {
  className: '',
  data: undefined,
  labels: undefined,
  model: undefined,
  onChange: undefined,
  nextViewId: 1,
};

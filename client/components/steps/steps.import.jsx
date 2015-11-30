/**
 * 仿照JQuery steps, 实现wizard组件
 *
 * Created by zephyre on 11/30/15.
 */

import {Tabs, Tab} from "/lib/react-bootstrap"

export const Steps = React.createClass({
  getInitialState() {
    return {
      // 当前位于第几步
      currentStep: 0,
      // 最远解锁了第几步
      furthestStep: 0,
    }
  },

  propTypes: {
    // Steps的主题
    steps: React.PropTypes.array.isRequired,
    // 点击"下一步"的回调(改变之前)
    willNextStep: React.PropTypes.func,
    // 点击"下一步"的回调(改变之后)
    didNextStep: React.PropTypes.func,
    // 点击"上一步"的回调(改变之前)
    willPreviousStep: React.PropTypes.func,
    // 点击"下一步"的回调(改变之后)
    didPreviousStep: React.PropTypes.func,
    // 点击任意页面跳转的回调(改变之前)
    willGoStep: React.PropTypes.func,
    // 点击任意页面跳转的回调(改变之后)
    didGoStep: React.PropTypes.func,
    // 点击"完成"的回调(改变之前)
    willFinish: React.PropTypes.func,
    // 点击"完成"的回调(改变之后)
    didFinish: React.PropTypes.func
  },

  // 点击任意tab时触发
  onSelect(key) {
    // 判断key是否过远, 并且是否允许跳转
    if (key <= this.state.furthestStep && (!this.props.willGoStep || this.props.willGoStep(key))) {
      this.setState({currentStep: key});
      if (this.props.didGoStep) {
        this.props.didGoStep(key);
      }
      if (this.state.furthestStep < key) {
        this.setState({furthestStep: key});
      }
    }
  },

  // 点击"上一步"时触发
  onPreviousStep() {
    const current = this.state.currentStep;
    if (current >= 1 && (!this.props.willPreviousStep || this.props.willPreviousStep(current))) {
      this.setState({currentStep: current - 1});
      if (this.props.didPreviousStep) {
        this.props.didPreviousStep(current - 1);
      }
    }
  },

  // 点击"下一步"时触发
  onNextStep(event) {
    const current = this.state.currentStep;
    const stepsCnt = this.props.steps.length;
    if (current <= stepsCnt - 2 && (!this.props.willNextStep || this.props.willNextStep(current))) {
      this.setState({currentStep: current + 1});
      if (this.state.furthestStep < current + 1) {
        this.setState({furthestStep: current + 1});
      }
      if (this.props.didNextStep) {
        this.props.didNextStep(current + 1);
      }
    }
  },

  render() {
    // 生成导航列表
    const stepsCount = this.props.steps.length;
    const stepNavTabs = [];
    for (let i = 0; i < stepsCount; i++) {
      const {title, body} = this.props.steps[i];
      const current = this.state.currentStep;
      const furthest = this.state.furthestStep;
      // 确定样式
      let cl;
      if (i < current) {
        cl = "done";
      } else if (i == current) {
        cl = "current";
      } else if (i <= furthest) {
        cl = "done";
      }
      else {
        cl = "disabled";
      }
      const item =
        <Tab eventKey={i} tabClassName={cl} title={`${i+1}. ${title}`}>
          <div className="panel-body">
            {body}
          </div>

        </Tab>;
      stepNavTabs.push(item);
    }


    return (
      <div className="zephyre-wizard clearfix">
        <div className="steps clearfix">
          <Tabs activeKey={this.state.currentStep} onSelect={this.onSelect}>
            {stepNavTabs}
          </Tabs>
        </div>
        <div className="actions clearfix">
          <ul>
            <li className={this.state.currentStep >= 1 ? "" : "disabled"} onClick={this.onPreviousStep}>
              <a href="javascript:void(0)">上一步</a>
            </li>
            <li className={this.state.currentStep <= this.props.steps.length - 2 ? "" : "disabled"}
                onClick={this.onNextStep}>
              <a href="javascript:void(0)">下一步</a></li>
            <li><a href="javascript:void(0)">完成</a></li>
          </ul>
        </div>
      </div>
    )
  }
});

export const StepsDemo = React.createClass({
  render() {
    return (
      <div>
        <Steps steps={[{title: "第一天", body: <p>第一天</p>}, {title: "第二天", body: <p>第二天</p>},
        {title: "第三天", body: <p>第三天</p>}]}/>
      </div>
    );
  }
});

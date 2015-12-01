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
      // 每个step的状态, 取值为: normal, disabled, error
      stepsStatus: _.range(this.props.steps.length).map((val) => val == 0 ? "normal" : "disabled"),
      // 是否允许按钮的点击事件
      enablePrev: true,
      enableNext: true
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
  // * targetStep 被点击的tab的key
  onSelect(targetStep) {
    // 当前的key
    const currentStep = this.state.currentStep;
    const stepsStatus = this.state.stepsStatus;

    // 如果key过远, 直接拒绝
    if (stepsStatus[targetStep] == "disabled") {
      this.setState({currentStep: currentStep});
      return;
    }

    // 是否允许跳转(默认为允许)
    const policy = !!this.props.willGoStep ? this.props.willGoStep(currentStep, targetStep) : "allow";
    if (policy == "deny" || policy == "error") {
      const state = {currentStep: currentStep};
      if (policy == "error") {
        stepsStatus[currentStep] = "error";
        state.stepsStatus = stepsStatus;
      }
      this.setState(state);
    } else if (policy == "allow") {
      stepsStatus[currentStep] = "normal";
      if (stepsStatus[targetStep] == "disabled") {
        stepsStatus[targetStep] = "normal";
      }
      this.setState({stepsStatus: stepsStatus, currentStep: targetStep});
      if (this.props.didGoStep) {
        this.props.didGoStep(currentStep, targetStep);
      }
    }
  },

  // 点击"上一步"时触发
  onPreviousStep() {
    if (!this.state.enablePrev) return;

    // 当前的key
    const currentStep = this.state.currentStep;
    const stepsStatus = this.state.stepsStatus;
    const targetStep = currentStep - 1;

    // 直接拒绝
    if (stepsStatus[targetStep] == "disabled") {
      this.setState({currentStep: currentStep});
      return;
    }

    // 是否允许跳转(默认为允许)
    const policy = !!this.props.willPreviousStep ? this.props.willPreviousStep(currentStep) : "allow";
    if (policy == "deny" || policy == "error") {
      const state = {currentStep: currentStep};
      if (policy == "error") {
        stepsStatus[currentStep] = "error";
        state.stepsStatus = stepsStatus;
      }
      this.setState(state);
    } else if (policy == "allow") {
      stepsStatus[currentStep] = "normal";
      if (stepsStatus[targetStep] == "disabled") {
        stepsStatus[targetStep] = "normal";
      }
      const enablePrev = targetStep >= 1;
      const enableNext = targetStep <= stepsStatus.length - 2;
      setTimeout(() => {
        this.setState({enablePrev: enablePrev, enableNext: enableNext})
      }, 200);

      this.setState({stepsStatus: stepsStatus, currentStep: targetStep, enableNext: false, enablePrev: false});
      if (this.props.didPreviousStep) {
        this.props.didPreviousStep(targetStep);
      }
    }
  },

  // 点击"下一步"时触发
  onNextStep() {
    if (!this.state.enableNext) return;

    // 当前的key
    const currentStep = this.state.currentStep;
    const stepsStatus = this.state.stepsStatus;
    const targetStep = currentStep + 1;

    // 是否允许跳转(默认为允许)
    const policy = !!this.props.willNextStep ? this.props.willNextStep(currentStep) : "allow";
    if (policy == "deny" || policy == "error") {
      const state = {currentStep: currentStep};
      if (policy == "error") {
        stepsStatus[currentStep] = "error";
        state.stepsStatus = stepsStatus;
      }
      this.setState(state);
    } else if (policy == "allow") {
      stepsStatus[currentStep] = "normal";
      if (stepsStatus[targetStep] == "disabled") {
        stepsStatus[targetStep] = "normal";
      }
      const enablePrev = targetStep >= 1;
      const enableNext = targetStep <= stepsStatus.length - 2;
      setTimeout(() => {
        this.setState({enablePrev: enablePrev, enableNext: enableNext})
      }, 200);

      this.setState({stepsStatus: stepsStatus, currentStep: targetStep, enablePrev: false, enableNext: false});
      if (this.props.didNextStep) {
        this.props.didNextStep(targetStep);
      }
    }
  },

  // 点击"完成"时触发
  onFinish() {
    // 当前的key
    const currentStep = this.state.currentStep;
    const stepsStatus = this.state.stepsStatus;

    const policy = !!this.props.willFinish ? this.props.willFinish(currentStep) : "allow";
    const state = {currentStep: currentStep};
    if (policy == "deny" || policy == "error") {
      if (policy == "error") {
        stepsStatus[currentStep] = "error";
        state.stepsStatus = stepsStatus;
      }
      this.setState(state);
    } else if (policy == "allow") {
      stepsStatus[currentStep] = "normal";
      this.setState(state);
      if (this.props.didFinish) {
        this.props.didFinish(currentStep);
      }
    }
  },

  render() {
    // 生成导航列表
    const stepsCount = this.props.steps.length;
    const stepNavTabs = [];
    const current = this.state.currentStep;
    const stepsStatus = this.state.stepsStatus;
    for (let i = 0; i < stepsCount; i++) {
      const {title, body} = this.props.steps[i];

      // 确定样式
      let cl;
      const status = stepsStatus[i];
      if (status == "error") {
        cl = "error";
      } else if (status == "disabled") {
        cl = "disabled";
      } else if (status == "normal") {
        cl = i == current ? "current" : "done";
      }

      const item =
        <Tab key={`${i}`} eventKey={i} tabClassName={cl} title={`${i+1}. ${title}`}>
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
            <li key="prev" className={current >= 1 ? "" : "disabled"}
                onClick={this.onPreviousStep}>
              <a href="javascript:void(0)">上一步</a>
            </li>
            <li key="next"
                className={current <= stepsCount - 2 ? "" : "disabled"}
                onClick={this.onNextStep}>
              <a href="javascript:void(0)">下一步</a>
            </li>
            <li key="finish" onClick={this.onFinish}>
              <a href="javascript:void(0)">完成</a>
            </li>
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

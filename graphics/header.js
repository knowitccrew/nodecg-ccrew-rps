const { Component } = React;
// const PropTypes =

class Progress extends React.Component {
  constructor(props) {
    super(props);

    this.state = { show: false, completed: props.completed || 0 };

    if (props.id) {
      const { replicant = nodecg.Replicant(props.id) } = props;

      // const cb = stage => this.setState({ show: true, completed: stage - 1 });
      const cb = stage => {
        this.setState({ completed: stage - 1 });
        // wait a second before showing:
        setTimeout(() => this.setState({ show: true }), 700);
      };
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.replicant = replicant;
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      // remember to remove old event listener:
      this.unsubscribe();
    }
  }

  render() {
    const { reverse, id } = this.props;
    const { show } = this.state;
    const completed = Number(this.state.completed);

    if (completed < 0 || Number.isNaN(completed)) {
      // Waiting to start
      return <span />;
    }

    // console.log("COMPLETED", completed);

    const done = Array.from(Array(completed)).map(() => <span className="doneCircle" />);
    const remaining = Array.from(Array(5 - completed)).map(() => <span className="remCircle" />);

    const className = show ? 'show' : '';
    if (reverse) {
      const circles = remaining.concat(done);
      return <span id={id} className={className}>{circles}</span>
    }

    const circles = done.concat(remaining);
    return <span id={id} className={className}>{circles}</span>;
  }
}

Progress.defaultProps = {
  completed: 0,
  reverse: false,
};

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timer: props.timer, ready: false };

    this.state.seconds = props.timer.remainingSeconds;

    if (props.id) {
      const { replicant = nodecg.Replicant(props.id) } = props;

      const cb = timerObj => this.setState({ timer: timerObj });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.replicant = replicant;
    }
  }

  componentDidMount() {
    // wait a little bit before adding classname so that css will trigger a
    // transition animation:
    setTimeout(() => this.setState({ ready: true }), 950);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { timer = {}, ready } = this.state
    const { show, remainingSeconds: time, halfSecond, pause } = timer;
    const middle = (pause || halfSecond) ? ':' : ' ';

    console.log("timer is", this.state.timer);

    let minutes = Math.floor(time / 60);
    if (minutes < 10) { minutes = "0" + minutes; }

    let seconds = time % 60;
    if (seconds < 10) { seconds = "0" + seconds; }

    if (!pause && !halfSecond && minutes == 0 && seconds == 0) {
      // If the time's up then blink together with the separator:
      minutes = '';
      seconds = '';
    }

    const showClass = (ready && show) ? 'show' : 'hide';
    return (
      <span className={`timer ${showClass}`}>
        <span>{minutes}</span>
        <span>{middle}</span>
        <span>{seconds}</span>
      </span>
    );
  }
}

Timer.defaultProps = {
  timer: {
    show: true,
    active: false,
    totalSeconds: 60 * 45,
    remainingSeconds: 60,
  },
};

class TeamBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  componentDidMount() {
    // wait a little bit before adding classname so that css will trigger a
    // transition animation:
    setTimeout(() => this.setState({ show: true }), 100);
  }

  render() {
    const { backgroundColor } = this.props;
    const { show } = this.state;
    const className = show ? 'show' : '';

    return (
      <div id="teambar" style={{ backgroundColor }}>
        <span><span className={`blue_team_name ${className}`}>BLUE TEAM</span>&emsp;<Progress id="blue_progress"/></span>
        <Timer id="timer_main" />
        <span><Progress id="red_progress" reverse />&emsp;<span className={`red_team_name ${className}`}>RED TEAM</span></span>
      </div>
    );
  }
}

class WaitForShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  componentDidMount() {
    // wait a little bit before adding classname so that css will trigger a
    // transition animation:
    const { ms } = this.props;
    setTimeout(() => this.setState({ show: true }), ms);
  }

  render() {
    const { show } = this.state;
    const { children } = this.props;

    console.log("waitforshow state:", this.state);

    // Clone children and inject our state as props:
    const elements = Array.isArray(children) ? children : [children];

    return (
      <div>
        {elements.map((child, i) => React.cloneElement(child, { ...this.state, key: `wait_for_show_${i}` }))}
      </div>
    );
  }
}

WaitForShow.propTypes = {
  ms: PropTypes.number,
};

WaitForShow.defaultProps = {
  ms: 100,
};

class Header extends React.Component {
  render() {
    const { style, children, show } = this.props;
    const className = show ? 'show' : '';
    console.log("header render:", this.props);

    // Clone children and inject remainder props:
    const elements = Array.isArray(children) ? children : [children];

    const extraProps = Object.assign({}, this.props);
    delete extraProps.children;
    delete extraProps.style;

    console.log("extraProps:", extraProps);

    return (
      <div className={`ccrew-header ${className}`} style={style}>
        {elements.map((child, i) => React.cloneElement(child, { ...extraProps, key: `header_${i}` }))}
      </div>
    );
  }
}

Header.propTypes = {
  show: PropTypes.bool,
};

Header.defaultProps = {
  show: true,
};

class HeaderPart extends React.Component {
  render() {
    console.log("headerpart:", this.props);
    const { children, right, show } = this.props;

    // defaults to left
    const className = right ? "ccrew-header-right" : "ccrew-header-left";
    const showClass = show ? 'show' : '';

    return (
      <span key={className} className={`${className} ${showClass}`}>{children}</span>
    );
  }
}

class RPSHeader extends React.Component {
  render() {
    return (
      <WaitForShow ms={500}>
        <Header>
          <HeaderPart>Player one</HeaderPart>
          <HeaderPart right>Player two</HeaderPart>
        </Header>
      </WaitForShow>
    );
  }
}

ReactDOM.render(
  <InjectReplicants replicantIds={{ background_color: 'backgroundColor' }}>
    <RPSHeader key="RPSHeader" />
  </InjectReplicants>,
  document.getElementById('root')
);

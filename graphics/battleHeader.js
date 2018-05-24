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
    const { reverse, id, stages } = this.props;
    const { show } = this.state;
    const completed = Number(this.state.completed);

    if (completed < 0 || Number.isNaN(completed)) {
      // Waiting to start
      return <span />;
    }

    // console.log("COMPLETED", completed);

    const done = Array.from(Array(completed)).map(() => <span className="doneCircle" />);
    const remaining = Array.from(Array(stages - completed)).map(() => <span className="remCircle" />);

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
  stages: 5,
  reverse: false,
};

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
    const { children, left, middle, right, show } = this.props;

    const classNames = ['ccrew-header-element'];

    if (left === true) {
      classNames.push('ccrew-header-left');
    }

    if (middle === true) {
      classNames.push('ccrew-header-middle');
    }

    if (right === true) {
      classNames.push('ccrew-header-right');
    }

    if (show) {
      classNames.push('show');
    }

    console.log("headerpart:", this.props);

    return (
      <div className={classNames.join(' ')}>{children}</div>
    );
  }
}

class RPSBattleHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      p1Score: 2,
      p2Score: 2,
    };
  }

  render() {
    const { p1Score, p2Score } = this.state;

    // Hmm! Dette burde egentlig bare komme som props, er jo det progress skal bruke :-)
    // TODO: Må endre Progress til å ta array av true/false...

    return (
      <WaitForShow ms={500}>
        <Header>
          <HeaderPart left>
            Player one
            &ensp;<Progress completed={p1Score} stages={7} />
          </HeaderPart>
          <HeaderPart middle>
            {p1Score} score {p2Score}
          </HeaderPart>
          <HeaderPart right>
            <Progress completed={p2Score} stages={7} reverse />
            &ensp;Player two
          </HeaderPart>
        </Header>
      </WaitForShow>
    );
  }
}

ReactDOM.render(
  <InjectReplicants replicantIds={{ background_color: 'backgroundColor' }}>
    <RPSBattleHeader />
  </InjectReplicants>,
  document.getElementById('root')
);


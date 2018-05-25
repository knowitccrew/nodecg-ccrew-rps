const { Component } = React;
// const PropTypes =

const WonCircle = () => <span className="ccrew-circle ccrew-circle-won" />;
const LostCircle = () => <span className="ccrew-circle ccrew-circle-lost" />;
const NeitherCircle = () => <span className="ccrew-circle" />;

class RPSProgress extends React.Component {
  constructor(props) {
    super(props);

    this.state = { show: false, completed: props.completed || 0 };

    // if (props.id) {
    //   const { replicant = nodecg.Replicant(props.id) } = props;

    //   // const cb = stage => this.setState({ show: true, completed: stage - 1 });
    //   const cb = stage => {
    //     this.setState({ completed: stage - 1 });
    //     // wait a second before showing:
    //     setTimeout(() => this.setState({ show: true }), 700);
    //   };
    //   replicant.on('change', cb);
    //   this.unsubscribe = () => replicant.removeListener('change', cb);

    //   this.replicant = replicant;
    // }
  }

  // componentWillUnmount() {
  //   if (this.unsubscribe) {
  //     // remember to remove old event listener:
  //     this.unsubscribe();
  //   }
  // }

  render() {
    const { reverse, id, stages, winnerPerRound, player } = this.props;
    const { show } = this.state;
    const completed = Number(this.state.completed);

    console.log("winnerPerRound", winnerPerRound);
    if (completed < 0 || Number.isNaN(completed)) {
      // Waiting to start
      return <span />;
    }

    // console.log("COMPLETED", completed);

    const rounds = winnerPerRound.slice();
    while (rounds.length < stages) {
      rounds.push(null);
    }

    const circles = rounds.map((who, i) => {
      if (player === who) {
        return <WonCircle key={i} />;
      } else if (who === 1 || who === 2) {
        return <LostCircle key={i} />;
      } else {
        return <NeitherCircle key={i} />;
      }
    });

    const className = show ? 'show' : '';
    return <span id={id} className={className}>{reverse ? circles.slice().reverse() : circles}</span>;
  }
}

RPSProgress.defaultProps = {
  completed: 0,
  player: 2,
  reverse: false,
  stages: 5,
  winnerPerRound: [],
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
    // console.log("header render:", this.props);

    // Clone children and inject remainder props:
    const elements = Array.isArray(children) ? children : [children];

    const extraProps = Object.assign({}, this.props);
    delete extraProps.children;
    delete extraProps.style;

    // console.log("extraProps:", extraProps);

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

    // console.log("headerpart:", this.props);

    return (
      <div className={classNames.join(' ')}>{children}</div>
    );
  }
}

class RPSBattleHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { winnerPerRound } = this.props;

    const rounds = winnerPerRound.slice();
    const scorep1 = rounds.filter(winner => winner === 1).length;
    const scorep2 = rounds.filter(winner => winner === 2).length;

    return (
      <WaitForShow ms={500}>
        <Header>
          <HeaderPart left>
            Player one&nbsp;
            <RPSProgress player={1} stages={7} winnerPerRound={winnerPerRound} />
          </HeaderPart>

          <HeaderPart middle> {scorep1} score {scorep2} </HeaderPart>

          <HeaderPart right>
            <RPSProgress player={2} stages={7} winnerPerRound={winnerPerRound} reverse />
            &ensp;Player two
          </HeaderPart>
        </Header>
      </WaitForShow>
    );
  }
}

RPSBattleHeader.defaultProps = {
  winnerPerRound: [],
};

ReactDOM.render(
  <InjectReplicants replicantIds={{ rps_game: 'winnerPerRound' }}>
    <RPSBattleHeader />
  </InjectReplicants>,
  document.getElementById('root')
);


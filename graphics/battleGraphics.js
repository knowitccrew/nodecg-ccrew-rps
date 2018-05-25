const { Component } = React;

class PlayerBar extends Component {
  constructor(props) {
    super(props);
    console.log("PROPS", props);
  }

  render() {
    const { children, left, right, lose, win } = this.props;

    const elements = Array.isArray(children) ? children.slice() : [children];
    const classNames = ["ccrew-battlefooter-bar"];

    if (left) {
      classNames.push("ccrew-battlefooter-bar-left");
    }

    if (right) {
      classNames.push("ccrew-battlefooter-bar-right");
    }

    if (win) {
      classNames.push("ccrew-battlefooter-bar-win");
      if (elements.length === 0) {
        elements.push('win');
      }
    }

    if (lose) {
      classNames.push("ccrew-battlefooter-bar-lose");
      if (elements.length === 0) {
        elements.push('lose');
      }
    }

    return (
      <div className={classNames.join(" ")}>
        <VAlign>
          {elements}
        </VAlign>
      </div>
    );
  }
}

PlayerBar.defaultProps = {
  children: [],
  left: false,
  right: false,
  lose: false,
  win: false,
};

const VAlign = ({ children }) => <div className="valign">{children}</div>;

class FooterPart extends React.Component {
  render() {
    const { children, left, middle, right, show } = this.props;

    const classNames = ['ccrew-footer-element'];

    if (left === true) {
      classNames.push('ccrew-footer-left');
    }

    if (middle === true) {
      classNames.push('ccrew-footer-middle');
    }

    if (right === true) {
      classNames.push('ccrew-footer-right');
    }

    if (show) {
      classNames.push('show');
    }

    return (
      <div className={classNames.join(' ')}>{children}</div>
    );
  }
}

const Rock = ({ left, right }) => left ?
    <img src="./assets/rps-left-rock.png" className="rps-gr rps-left-rock" /> :
    <img src="./assets/rps-right-rock.png" className="rps-gr rps-right-rock" />;

const Paper = ({ left, right }) => left ?
    <img src="./assets/rps-left-paper.png" className="rps-gr rps-left-paper" /> :
    <img src="./assets/rps-right-paper.png" className="rps-gr rps-right-paper" />;

const Scissors = ({ left, right }) => left ?
    <img src="./assets/rps-left-scissors.png" className="rps-gr rps-left-scissors" /> :
    <img src="./assets/rps-right-scissors.png" className="rps-gr rps-right-scissors" />;

class SmartThing extends Component {
  constructor(props) {
    super(props);
    setTimeout(() => props.destructor(this), props.timeout);
  }

  render() {
    return this.props.children;
  }
};

SmartThing.defaultProps = {
  children: [],
  destructor: () => ({}),
  timeout: 6000,
};

class RPSBattleGraphics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphics: [],
    };

    const thingToComponent = {
      rock: (props) => <Rock {...props} />,
      paper: (props) => <Paper {...props} />,
      scissors: (props) => <Scissors {...props} />,
    };

    const destructor = (obj) => {
      console.log("destructor!", obj);
      this.setState(state => {
        const graphics = state.graphics.slice();
        const index = graphics.indexOf(obj);
        if (index > -1) {
          graphics.splice(index, 1);
        } else {
          console.log("not found :-(");
        }
        return { graphics };
      });
    };

    nodecg.listenFor('player1_hand_anim', (which) => {
      console.log("got p1", which);
      this.setState(state => {
        console.log("state", state);
        const graphics = state.graphics.slice();
        // const element = (
        //   <SmartThing destructor={destructor} timeout={1000}>
        //     {thingToComponent[which]({ left: true })}
        //   </SmartThing>
        // );
        const element = thingToComponent[which]({ left: true });
        graphics.push(element);
        return { graphics };
      });
    });

    nodecg.listenFor('player2_hand_anim', (which) => {
      console.log("got p2", which);
      this.setState(state => {
        console.log("state", state);
        const graphics = state.graphics.slice();
        graphics.push(thingToComponent[which]({ right: true }));
        return { graphics };
      });
    });

  }

  render() {
    const { graphics } = this.state;
    return (
      <div>
        {graphics}
      </div>
    );
  }
}

ReactDOM.render(
  <RPSBattleGraphics />,
  document.getElementById('root')
);

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

const BattleFooter = ({ children }) => (
  <Footer style={{ height: '93px' }} valign={false} className={'ccrew-battlefooter'}>
    {children}
  </Footer>
);

const LogoBox = () => (
  <div className="logobox">knowit</div>
);

const RPSBattleFooter = () => (
  <div className="rps-battlefooter">
    <BattleFooter>
      <PlayerBar right win />
      <PlayerBar left lose />
    </BattleFooter>
    <LogoBox />
  </div>
);

ReactDOM.render(
  <InjectReplicants replicantIds={{ 'background_color': 'backgroundColor' }}>
    <RPSBattleFooter />
  </InjectReplicants>,
  document.getElementById('root')
);


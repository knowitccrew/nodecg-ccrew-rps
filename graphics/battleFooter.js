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

const BattleFooter = ({ children }) => (
  <Footer style={{ height: '93px' }} valign={false} className={'ccrew-battlefooter'}>
    {children}
  </Footer>
);

const RPSBattleFooter = () => (
  <BattleFooter>
    <PlayerBar left win />
    <PlayerBar right lose />
  </BattleFooter>
);

ReactDOM.render(
  <InjectReplicants replicantIds={{ 'background_color': 'backgroundColor' }}>
    <RPSBattleFooter />
  </InjectReplicants>,
  document.getElementById('root')
);


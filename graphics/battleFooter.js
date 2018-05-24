const { Component } = React;

class PlayerBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, left, right } = this.props;

    const classNames = ["ccrew-battlefooter-bar"];

    if (left) {
      classNames.push("ccrew-battlefooter-bar-left");
    }

    if (right) {
      classNames.push("ccrew-battlefooter-bar-right");
    }

    return (
      <div className={classNames.join(" ")}>
        {children}
      </div>
    );
  }
}

const VAlign = ({ children }) => <div className="valign">{children}</div>;

const BattleFooter = ({ children }) => (
  <Footer style={{ height: '93px' }} valign={false} className={'ccrew-battlefooter'}>
    {children}
  </Footer>
);

const RPSBattleFooter = () => (
  <BattleFooter>
    <PlayerBar left>
      <VAlign>
        A
      </VAlign>
    </PlayerBar>
    <PlayerBar right>
      <VAlign>
        B
      </VAlign>
    </PlayerBar>
  </BattleFooter>
);

ReactDOM.render(
  <InjectReplicants replicantIds={{ 'background_color': 'backgroundColor' }}>
    <RPSBattleFooter />
  </InjectReplicants>,
  document.getElementById('root')
);


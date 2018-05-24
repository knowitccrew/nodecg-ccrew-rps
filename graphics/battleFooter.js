const { Component } = React;

const RPSBattleFooter = () => (
  <Footer style={{ height: '93px' }}>
    Knowit Mangekamp!
  </Footer>
);

ReactDOM.render(
  <InjectReplicants replicantIds={{ 'background_color': 'backgroundColor' }}>
    <RPSBattleFooter />
  </InjectReplicants>,
  document.getElementById('root')
);


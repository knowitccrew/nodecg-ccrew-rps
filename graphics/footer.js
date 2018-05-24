const { Component } = React;

const RPSFooter = () => (
  <Footer style={{ height: '93px' }}>
    Knowit Mangekamp - Stein, Saks, Papir
  </Footer>
);

ReactDOM.render(
  <InjectReplicants replicantIds={{ 'background_color': 'backgroundColor' }}>
    <RPSFooter />
  </InjectReplicants>,
  document.getElementById('root')
);

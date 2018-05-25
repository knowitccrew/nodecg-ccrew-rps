const { Component } = React;

const RPSFooter = () => (
  <Footer style={{ height: '93px' }} valign>
  </Footer>
);
// Knowit Mangekamp - Stein, Saks, Papir

ReactDOM.render(
  <InjectReplicants replicantIds={{ 'background_color': 'backgroundColor' }} valign>
    <RPSFooter />
  </InjectReplicants>,
  document.getElementById('root')
);

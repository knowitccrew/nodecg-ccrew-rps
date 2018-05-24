const { Component } = React;

class Footer extends Component {
  render() {
    const { children, style } = this.props;

    return (
      <div className="ccrew-footer" style={style}>
        <div class="valign">
          {children}
        </div>
      </div>
    );
  }
}

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

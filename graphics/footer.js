class Omnibar extends React.Component {
  render() {
    const { backgroundColor } = this.props;
    return (
      <div id="omnibar" class="placeholder" style={{ backgroundColor }}>
        <div class="valign">
          Knowit Capture the Flag Game Show - Kiel Edition
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <InjectReplicants replicantIds={{ 'background_color': 'backgroundColor' }}>
    <Omnibar />
  </InjectReplicants>,
  document.getElementById('root')
);

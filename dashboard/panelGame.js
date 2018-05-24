const FlatButton = ({ children }) => <a className="waves-effect waves-teal btn-flat red-text">{children}</a>;
FlatButton.defaultProps = {
  children: 'FlatButton',
};

const Button = ({ children, className, disabled, onClick }) => (
  <a className={`waves-effect waves-teal btn ${className}`} disabled={!!disabled} onClick={onClick}>{children}</a>
);

Button.defaultProps = {
  children: 'Button',
  className: '',
  disabled: false,
  onClick: null,
};

const Icon = ({ left, right, children }) => (
  <i className={`material-icons ${(left || !right) ? 'left' : ''} ${right ? 'right' : ''}`}>{children}</i>
);

Icon.defaultProps = {
  left: null,
  right: null,
  children: 'cloud',
};

const RPSGamePanel = () => {
  const doReset = () => nodecg.sendMessage('reset_game');
  return <Button className="red" onClick={doReset}><Icon>restore</Icon>Reset Game</Button>
};

$(document).ready(() => ReactDOM.render(
  <Row packed>
    <RPSGamePanel />
  </Row>,
  document.getElementById('root')
));

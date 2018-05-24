const { Component } = React;

/*
 * SomeComponent below will have 'someReplicant' available as a prop under 'propsName'.
 *
 * <InjectReplicants replicantIds={{ someReplicant: 'propsName' }}>
 *   <SomeComponent />
 * </InjectReplicants>
 */
class InjectReplicants extends React.Component {
  constructor(props) {
    super(props);

    const { replicantIds = {} } =  props;

    this.state = {};

    this.unsubscribes = Object.keys(replicantIds).map((id) => {
      const stateKey = replicantIds[id];
      console.log("registering replicant for", id, "will become", stateKey);
      const callback = newValue => this.setState({ [stateKey]: newValue });

      // Sometimes when registrering/deregistrering back and forth, we won't get a change event
      // after registering again. So in order to get a value at all we make sure to explicitly read
      // the value before creating the replicant listener:
      nodecg.readReplicant(id, 'nodecg-ccrew-ctf', value => this.setState({ [stateKey]: value }));

      const repl = nodecg.Replicant(id);
      repl.on('change', callback);
      return () => repl.removeListener('change', callback);
    });
  }

  componentWillUnmount() {
    if (this.unsubscribes) {
      this.unsubscribes.forEach(unsub => unsub());
    }
  }

  render() {
    const { children } = this.props;

    // Clone children and inject our state as props:
    const elements = Array.isArray(children) ? children : [children];

    // {JSON.stringify(this.props.replicantIds)}
    return (
      <div>
        {elements.map((child, i) => React.cloneElement(child, { ...this.state, key: i }))}
      </div>
    );
  }
}

const Row = ({ children, valign, className = '', packed, id = '' }) => {
  const style = packed ? { marginBottom: '0px' } : {};
  return (
    <div id={id} className={`row ${valign ? "valign-wrapper" : ''} ${className}`} style={style}>{children}</div>
  );
}

const Inline = ({ children }) => <div style={{ display: 'inline-block', marginLeft: '5px' }}>{children}</div>;

const Column = ({ s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, className, id, children }) => {
  const width =
    s1 && "col s1" ||
    s2 && "col s2" ||
    s3 && "col s3" ||
    s4 && "col s4" ||
    s5 && "col s5" ||
    s6 && "col s6" ||
    s7 && "col s7" ||
    s8 && "col s8" ||
    s9 && "col s9" ||
    s10 && "col s10" ||
    s11 && "col s11" ||
    s12 && "col s12";
    // "input-field inline";

  return width ? (
    <div className={`${width} ${className||''}`} id={id||''}>
      {children}
    </div>
  ) : <div id={id|''} style={{ display: 'inline-block' }}>{children}</div>;
}

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: '' };

    if (props.id) {
      const { replicant = nodecg.Replicant(props.id, { persistent: true }) } = props;

      //console.log("replicant", replicant, props);
      const cb = newValue => this.setState({ value: newValue });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.state.replicant = replicant;
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("input nextprops:", nextProps);
    if (!this.props.replicant && nextProps.replicant) {
      //console.log("nextProps.replicant", nextProps.replicant);
      if (this.unsubscribe) {
        // remember to remove old event listener:
        this.unsubscribe();
      }

      // get data from backend:
      const { replicant } = nextProps;
      const cb = newValue => this.setState({ value: newValue });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.setState({ replicant: nextProps.replicant });
    }
  }

  render() {
    //console.log("active button render:", this.state, this.props);
    // set state indirectly (via replicant value, which in turn will set the value in state)
    const handleChange = ({ target: { value }}) => {
      if (this.state.replicant) { this.state.replicant.value = value }
      // We will get the correct value in return from Replicant backend soon,
      // however we need to set the value immediately or risk React changing
      // the value back and forth between old and new value, which again causes
      // the cursor to move to the end of the input field.
      // https://stackoverflow.com/questions/28922275/in-reactjs-why-does-setstate-behave-differently-when-called-synchronously/28922465#28922465
      this.setState({ value });
    };

    const { id, label } = this.props;
    const { value = '' } = this.state;

    return (
      <Column {...this.props} className="input-field">
        <input id={id} type="text" className="validate" onChange={handleChange} value={value} />
        <label for={id} className="active">{label}</label>
      </Column>
    );
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      // console.log(this.unsubscribe);
      // remember to remove old event listener:
      this.unsubscribe();
    }
  }
}

class TextArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: '' };

    if (props.id) {
      const { replicant = nodecg.Replicant(props.id, { persistent: true }) } = props;

      //console.log("replicant", replicant, props);
      const cb = newValue => this.setState({ value: newValue });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.state.replicant = replicant;
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("textarea nextprops:", nextProps);
    if (!this.props.replicant && nextProps.replicant) {
      //console.log("nextProps.replicant", nextProps.replicant);
      if (this.unsubscribe) {
        // remember to remove old event listener:
        this.unsubscribe();
      }

      // get data from backend:
      const { replicant } = nextProps;
      const cb = newValue => this.setState({ value: newValue });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.setState({ replicant: nextProps.replicant });
    }
  }

  render() {
    //console.log("active button render:", this.state, this.props);
    // set state indirectly (via replicant value, which in turn will set the value in state)
    const handleChange = ({ target: { value }}) => {
      if (this.state.replicant) { this.state.replicant.value = value }
      // We will get the correct value in return from Replicant backend soon,
      // however we need to set the value immediately or risk React changing
      // the value back and forth between old and new value, which again causes
      // the cursor to move to the end of the input field.
      // https://stackoverflow.com/questions/28922275/in-reactjs-why-does-setstate-behave-differently-when-called-synchronously/28922465#28922465
      this.setState({ value });
    };

    const { id, label } = this.props;
    const { value = '' } = this.state;

    return (
      <Column {...this.props} className="input-field">
        <textarea id={id} type="text" className="materialize-textarea" onChange={handleChange} value={value} />
        <label for={id} className="active">{label}</label>
      </Column>
    );
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      // console.log(this.unsubscribe);
      // remember to remove old event listener:
      this.unsubscribe();
    }
  }
}

// ComplexReplicant acts as a middleware between the real Replicant value and
// the consumer. It needs a marshall and an unmarshall function that
// translates/maps between simple input/output and the real datastructure.
class ComplexReplicant {
  constructor(props = {}) {
    this.replicant = props.replicant;
    this.marshal = props.marshal;
    this.unmarshal = props.unmarshal;
  }

  on(eventName, callback) {
    //return this.replicant.on(eventName, callback);
    return this.replicant.on(eventName, newVal => this.unmarshal(callback, newVal));
  }

  set value(newValue) {
    return this.marshal(this.replicant, newValue);
  }
}

const DumbSwitch = (props) => {
  const { onLabel, offLabel, isChecked, onChange } = props;

  return (
    <Column {...props}>
      <div className="switch">
        <label>
          {offLabel}
          <input id="presenter_overlay_show" type="checkbox" onChange={onChange} checked={isChecked} />
          <span className="lever"></span>
          {onLabel}
        </label>
      </div>
    </Column>
  );
};

DumbSwitch.defaultProps = {
  offLabel: 'Hide',
  onLabel: 'Show',
  isChecked: false,
  onChange: null,
};

class Switch extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = { isChecked: false, handleChange: props.handleChange };

    // use supplied handleChange or supplied replicant or create or own replicant:
    if (props.id || props.replicant && !props.handleChange) {
      const { replicant = nodecg.Replicant(props.id, { persistent: true }) } = props;

      //console.log("switch replicant", replicant);
      const cb = newValue => this.setState({ isChecked: newValue });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.state.replicant = replicant;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.replicant && nextProps.replicant) {
      //console.log("switch nextProps.replicant", nextProps.replicant);
      if (this.unsubscribe) {
        // remember to remove old event listener:
        this.unsubscribe();
      }

      // get data from backend:
      const { replicant } = nextProps;
      const cb = newValue => this.setState({ isChecked: newValue });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.setState({ replicant: nextProps.replicant });
    }
  }

  handleChange({ target: { checked }}) {
    // set state indirectly (via replicant value, which in turn will set the value in state)
    if (this.state.replicant) {
      this.state.replicant.value = checked
    }
  }

  render() {
    const { isChecked, handleChange } = this.state;
    const { onLabel, offLabel } = this.props;

    return (
      <Column {...this.props}>
        <div className="switch">
          <label>
            {offLabel}
            <input id="presenter_overlay_show" type="checkbox" onChange={handleChange || this.handleChange} checked={isChecked} />
            <span className="lever"></span>
            {onLabel}
          </label>
        </div>
      </Column>
    );
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      // console.log(this.unsubscribe);
      // remember to remove old event listener:
      this.unsubscribe();
    }
  }
}

Switch.defaultProps = {
  offLabel: 'Hide',
  onLabel: 'Show',
  handleChange: null,
};

const DumbCheckbox = (props) => {
  const { id, label, isChecked, onChange } = props;

  return (
    <Column {...props} id={null} >
      <input id={id} type="checkbox" onChange={onChange} checked={isChecked} />
      <label for={id} >{label}</label>
    </Column>
  );
};

DumbCheckbox.defaultProps = {
  isChecked: false,
  onChange: null,
};

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = { isChecked: false };

    if (props.id || props.replicant) {
      const { replicant = nodecg.Replicant(props.id, { persistent: true }) } = props;

      const cb = obj => this.setState({ obj, isChecked: obj.isChecked });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.state.replicant = replicant;
    }
  }

  handleChange({ target: { checked }}) {
    // set state indirectly (via replicant value, which in turn will set the
    // value in state)
    if (this.state.replicant) {
      const newVal = Object.assign({}, this.state.obj, { isChecked: checked });
      this.state.replicant.value = newVal;
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      // remember to remove old event listener:
      this.unsubscribe();
    }
  }

  render() {
    const { id, className, children: label } = this.props;
    const { isChecked } = this.state;

    return (
      <DumbCheckbox key={id} id={id} label={label} s12 isChecked={isChecked} className={className} onChange={this.handleChange} />
    );
  }
}

class Range extends React.Component {
  constructor(props) {
    super(props);
    console.log("range constructor");
    this.state = { value: 0 };
    // this.id = label => `${label}_${props.num}`;

    if (props.id) {
      const { replicant = nodecg.Replicant(props.id, { persistent: true }) } = props;

      //console.log("switch replicant", replicant);
      const cb = newValue => this.setState({ value: newValue });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);
      this.state.replicant = replicant;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.replicant && nextProps.replicant) {
      //console.log("switch nextProps.replicant", nextProps.replicant);
      if (this.unsubscribe) {
        // remember to remove old event listener:
        this.unsubscribe();
      }

      // get data from backend:
      const { replicant } = nextProps;
      const cb = newValue => this.setState({ value: newValue });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.setState({ replicant });
    }
  }

  render() {
    const { id, label, min = 0, max = 60, className = ''} = this.props;
    const { value } = this.state;

    // set state indirectly (via replicant value, which in turn will set the value in state)
    const handleChange = ({ target: { value }}) => {
      if (this.state.replicant) { this.state.replicant.value = value }
    };

    return (
      <Column {...this.props} className={`input-field center-align ${className}`}>
        <div className="range-field valign-wrapper" style={{ width: "100%" }}>
          <input id={id} type="range" min={min} max={max} value={value} onInput={handleChange} />
        </div>
        <label for={id} className="active">{label}: {value}</label>
      </Column>
    );
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      // console.log(this.unsubscribe);
      // remember to remove old event listener:
      this.unsubscribe();
    }
  }
}

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    console.log("datepicker constructor");
    this.state = { value: '' };

    if (props.id) {
      const { replicant = nodecg.Replicant(props.id, { persistent: true }) } = props;

      const cb = timestamp => this.setState({ value: new Date(timestamp) });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.state.replicant = replicant;
    }
  }

  componentDidMount(){
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 2, // Creates a dropdown of x years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: true, // Close upon selecting a date,
    })
      .pickadate('picker')
      .on('set', data => {
        this.setState({ value: new Date(data.select) });
        if (this.state.replicant) { this.state.replicant.value = data.select }
      })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.replicant && nextProps.replicant) {
      //console.log("switch nextProps.replicant", nextProps.replicant);
      if (this.unsubscribe) {
        // remember to remove old event listener:
        this.unsubscribe();
      }

      // get data from backend:
      const { replicant } = nextProps;
      const cb = timestamp => this.setState({ value: new Date(timestamp) });
      replicant.on('change', cb);
      this.unsubscribe = () => replicant.removeListener('change', cb);

      this.setState({ replicant: nextProps.replicant });
    }
  }

  render() {
    const { id, label, className = ''} = this.props;
    const { value } = this.state;

    return (
      <Column {...this.props} className={`input-field valign-wrapper ${className}`}>
        <input type="text" id={id} className="datepicker" value={value} />
        <label for={id} className="active">{label}</label>
      </Column>
    );
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      // console.log(this.unsubscribe);
      // remember to remove old event listener:
      this.unsubscribe();
    }
  }
}

const Card = ({ children, active }) => {
  const activeClass = active ? 'green accent-1' : '';
  return (
    <Column s12 className={`card ${activeClass}`}>
      <div className="card-content" style={{ overflow: 'hidden', padding: '24px 12px' }}>
        {children}
      </div>
    </Column>
  );
};

class Select extends React.Component {
  componentDidMount() {
    $('select').material_select();
  }

  render() {
    const { label } = this.props;
    return (
      <div className="input-field">
        <select>
          <option value="" disabled selected>Choose your option</option>
          <option value="1">Option 1 value 1</option>
          <option value="2">Option 2 value 2 etc</option>
          <option value="3">Option 3</option>
        </select>
        {label ? <label>{label}</label> : ''}
      </div>
    );
  }
}

class Footer extends Component {
  render() {
    const { children, style, valign, className, innerClassName } = this.props;

    const classNames = ['ccrew-footer', className];

    const innerClasses = ['ccrew-footer-inner', innerClassName];
    if (valign) {
      innerClasses.poush('valign');
    }

    return (
      <div className={classNames.join(' ')} style={style}>
        <div className={innerClasses.join(' ')}>
          {children}
        </div>
      </div>
    );
  }
}

Footer.defaultProps = {
  className: '',
  innerClassName: '',
  valign: true,
};

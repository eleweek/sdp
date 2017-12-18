var React = require('react');
var ReactDOM = require('react-dom');
var tinycolor = require('tinycolor2');
var _ = require('lodash');
require('bootstrap');

require('bootstrap/dist/css/bootstrap.css');
require('./index.css');

class Slider extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    this.props.onChange(event.target.value);
  }
 
  render() {
     let classes = "form-control align-self-center " +  this.props.name + '-slider'
     return (
       <div className="form-group row color-slider">
         <label className="col-4 col-form-label">{this.props.label}</label>
         <div className="col-6 d-flex">
           <input type="range" className={classes} step={this.props.step} min={this.props.min} max={this.props.max} value={this.props.value} onChange={this.handleChange} />
         </div>
         <label className="col-2 col-form-label">{this.props.value}</label>
       </div>
     )
  }
}

class ColorSliders extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.names.length != this.props.min.length || this.props.names.length != this.props.max.length) {
      throw new Error("Mismatched props length");
    }
    
    this.handlers = [];
    for (let i = 0; i < this.props.names.length; ++i) {
      let name = this.props.names[i];
      this.handlers.push(this.handleColorChange.bind(this, name));
    }
  }

  handleColorChange(name, v) {
    this.props.onChange(name, v);
  }
  
  render() {
    let sliders = [];
    for (let i = 0; i < this.props.names.length; ++i) {
      let name = this.props.names[i];
      let ufname = _.upperFirst(name);
      sliders.push(
        <Slider
          name={name}
          key={ufname}
          label={ufname}
          value={this.props.values[i]}
          min={this.props.min[i]} 
          max={this.props.max[i]} 
          onChange={this.handlers[i]} 
          step={this.props.step[i]} 
        />);
    }
    return (
      <div className="color-sliders">
        {sliders}
      </div>
    )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      red: 185,
      green: 225,
      blue: 100,
    }

    this.state = Object.assign(this.state, this.HSLfromStateRGB());

    this.handleRGBChange = this.handleRGBChange.bind(this);
    this.handleHSLChange = this.handleHSLChange.bind(this);
  }
  
  HSLfromStateRGB() {
    let tc = tinycolor({
      r: this.state.red,
      g: this.state.green,
      b: this.state.blue,
    })
    let hsl = tc.toHsl();
    return {
      hue: _.round(hsl.h),
      saturation: _.round(hsl.s, 2),
      lightness: _.round(hsl.l, 2),
    }
  }
  
  RGBfromStateHSL() {
    let tc = tinycolor({
      h: this.state.hue,
      s: this.state.saturation,
      l: this.state.lightness,
    })
    let rgb = tc.toRgb();
    return {
      red: rgb.r,
      green: rgb.g,
      blue: rgb.b,
    }
  }
  
  handleRGBChange(name, v) {
    this.setState((prevState) => ({
      [name]: v,
    }));
    this.setState(this.HSLfromStateRGB());
  }
  
  handleHSLChange(name, v) {
    console.log(this.state);
    this.setState((prevState) => ({
      [name]: v,
    }));
    this.setState(this.RGBfromStateHSL());
    
  }
  
  render() {
    let style = {
      backgroundColor: `rgb(${this.state.red}, ${this.state.green}, ${this.state.blue})`
    }
    return (
    <div className="row app">
      <div className="col-8 col-sm-7 col-md-6 col-lg-4">
        <ColorSliders 
          names={["red", "green", "blue"]} 
          values={[this.state.red, this.state.green, this.state.blue]} 
          min={[0, 0, 0]} max={[255, 255, 255]} 
          step={[1, 1, 1]}
          onChange={this.handleRGBChange}
          />
        <ColorSliders 
          names={["hue", "saturation", "lightness"]} 
          values={[this.state.hue, this.state.saturation, this.state.lightness]} 
          min={[0, 0, 0]} 
          max={[360, 1, 1]} 
          step={[1, 0.01, 0.01]}
          onChange={this.handleHSLChange}
          />
      </div>
      <div className="col-2 offset-1 col-sm-2 offset-sm-1 col-md-2 offset-md-1 col-lg-1 offset-lg-1" style={style}>
      </div>
    </div>
    )
  }
  
  handleChange(name, v) {
    this.setState({[name]: v});
  }
}

ReactDOM.render(
  <div className="container">
    <h2> Super simple color picker</h2>
    <App />
  </div>,
  document.getElementById('root')
);

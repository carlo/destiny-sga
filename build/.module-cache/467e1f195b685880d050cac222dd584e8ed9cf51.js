var List = React.createClass({displayName: "List",
  getInitialState: function() {
    return {
      elements: [] 
    };
  },

  _onClick: function() {

    this.setState({message: randomMessage});
  },
  render: function() {
    return (
      React.createElement("div", null, 
      React.createElement(MessageView, {message: this.state.message}), 
      React.createElement("p", null, React.createElement("input", {type: "button", onClick: this._onClick, value: "Change Message"}))
      )
    )
  }
});

var Greeting = React.createClass({displayName: "Greeting",
  render: function() {
    return (
      React.createElement("p", null, "Hello, Universe")
    )
  }
});

function go( data ) {
  React.render(
    React.createElement(Greeting, null),
    document.getElementById('container')
  );

  console.log( data );
}

var List = React.createClass({displayName: "List",
  getInitialState: function() {
    return {
      elements: []
    };
  },

  _onClick: function() {

    this.setState({ elements: data });
  },
  render: function() {
    return (
      React.createElement("div", null, 
      React.createElement(ListElement, {obj: this.elements}), 
      React.createElement("p", null, React.createElement("input", {type: "button", onClick: this._onClick, value: "Change Message"}))
      )
    )
  }
});

var ListElement = React.createClass({displayName: "ListElement",
  render: function() {
    return (
      React.createElement("p", null, "Hello, Universe")
    )
  }
});

function go( data ) {
  React.render(
    React.createElement(List, {obj: data }),
    document.getElementById('container')
  );

  console.log( data );
}

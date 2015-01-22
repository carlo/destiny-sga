var List = React.createClass({displayName: "List",
  getInitialState: function() {
    return {};
  },

  render: function() {
    console.log( this.props.obj );
    return (
      React.createElement("div", null
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

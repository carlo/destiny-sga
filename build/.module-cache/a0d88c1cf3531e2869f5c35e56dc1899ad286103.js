var Greeting = React.createClass({displayName: "Greeting",
  render: function() {
    return (
      React.createElement("p", null, "Hello, Universe")
    )
  }
});

React.render(
  React.createElement(Greeting, null),
  document.getElementById('container')
);

function go( data ) {
  console.log( data );
}

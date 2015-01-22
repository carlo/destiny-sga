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

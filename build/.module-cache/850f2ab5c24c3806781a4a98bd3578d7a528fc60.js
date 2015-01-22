var List = React.createClass({displayName: "List",
  getInitialState: function() {
    return {
      elements: this.props.obj.data.children
    };
  },

  render: function() {

    var listElementNodes = this.state.elements.map( function( listElement ) {
      return (
        React.createElement(ListElement, {data:  listElement.data})
      );
    });

    return (
      React.createElement("ul", null, 
        listElementNodes 
      )
    )
  }
});


var ListElement = React.createClass({displayName: "ListElement",
  render: function() {
    debugger;
    return (
      React.createElement("li", null, 
        React.createElement("h3", null,  this.props.title), 
        React.createElement("p", null,  this.props.selftext_html)
      )
    )
  }
});


function go( data ) {
  React.render(
    React.createElement(List, {obj: data }),
    document.getElementById( 'container' )
  );
}

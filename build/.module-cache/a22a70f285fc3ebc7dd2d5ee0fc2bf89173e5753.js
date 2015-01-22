var List = React.createClass({displayName: "List",
  getInitialState: function() {
    return {
      elemtents: this.prop.data.children
    };
  },

  render: function() {
    console.log( this.props.obj );
    return (
      React.createElement("ul", null
      )
    )
  }
});

var ListElement = React.createClass({displayName: "ListElement",
  render: function() {
    var listElementNodes = this.props.data.map( function( listElement ) {
      return (
        React.createElement(Comment, {author: comment.author}, 
        comment.text
        )
      );
    });
    return (
      React.createElement("div", {className: "commentList"}, 
      commentNodes
      )
    );
    return (
      React.createElement("p", null, "Hello, Universe")
    )
  }
});


function go( data ) {
  React.render(
    React.createElement(List, {obj: data }),
    document.getElementById( 'container' )
  );
}

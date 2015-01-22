// underscore.string
_( s.exports() ).mixin();


var List = React.createClass({displayName: "List",
  getInitialState: function() {
    return {
      elements: this.props.obj.data.children
    };
  },

  render: function() {

    var listElementNodes = this.state.elements.map( function( obj ) {
      return (
        React.createElement(ListElement, {data:  obj.data})
      );
    });

    return (
      React.createElement("div", null, listElementNodes )
    )
  }
});


var ListElement = React.createClass({displayName: "ListElement",
  getInitialState: function() {
    return {
      title: this.props.data.title,
      url: this.props.data.url,
      body: _( this.props.data.selftext_html ).unescapeHTML(),
      createdAt: this.props.data.created_utc
    };
  },

  render: function() {
    return (
      React.createElement("section", null, 
        React.createElement("h3", null, 
          React.createElement("a", {href:  this.state.url},  this.state.title)
        ), 
        React.createElement("span", null,  this.state.createdAt), 
        React.createElement("div", {dangerouslySetInnerHTML: { __html: this.state.body}})
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

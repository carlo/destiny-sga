function unescapeHTML( inputString ) {
  var e = document.createElement( 'div' );
  e.innerHTML = inputString;
  return !e.childNodes.length ? '' : e.childNodes[ 0 ].nodeValue;
}


// ### Main list container
var List = React.createClass({displayName: "List",
  componentDidMount: function() {
    var _this = this;
    var cbNameMainData = 'cbMain' + Date.now();
    var script;

    // Create callback for the JSONP call.
    window[ cbNameMainData ] = function( jsonData ) {
      _this.setState({
        elements: jsonData.data.children
      });

      // Clean up afterwards.
      delete window[ cbNameMainData ];
    };

    // Get main data file.
    script = document.createElement( 'script' );
    script.src = this.props.url + '&jsonp=' + cbNameMainData;
    document.head.appendChild( script );
  },

  getInitialState: function() {
    return {
      elements: []
    };
  },

  render: function() {
    var listElementNodes = this.state.elements.map( function( obj ) {
      return (
        React.createElement(ListElement, {data:  obj.data})
      );
    });

    return (
      React.createElement("div", null, 
        React.createElement("h3", null,  this.props.type), 
        listElementNodes 
      )
    )
  }
});


// ### Single list element
var ListElement = React.createClass({displayName: "ListElement",
  getInitialState: function() {
    return {
      authorName: '/u/' + this.props.data.author,
      authorUrl: 'https://reddit.com/u/' + this.props.data.author,
      title: this.props.data.title,
      url: this.props.data.url.replace( /^http:/, 'https:' ),
      body: unescapeHTML( this.props.data.selftext_html ),
      createdAt: new Date( this.props.data.created_utc * 1000 ).toGMTString(),
      score: this.props.data.score
    };
  },

  render: function() {
    return (
      React.createElement("section", null, 
        React.createElement("h4", null, 
          React.createElement("code", null,  this.state.score), " ", 
          React.createElement("a", {href:  this.state.url},  this.state.title)
        ), 
        React.createElement("span", null, 
          React.createElement("a", {href:  this.state.authorUrl},  this.state.authorName), 
          "· ",  this.state.createdAt
        ), 
        React.createElement("div", {dangerouslySetInnerHTML: { __html: this.state.body}})
      )
    )
  }
});


// ### GO!
React.render(
  React.createElement("div", null, 
    React.createElement(List, {type: "most-relevant-this-month", url: "//www.reddit.com/r/DestinyTheGame/search.json?q=title%3ASGA&sort=relevance&restrict_sr=on&t=month"}), 
    React.createElement("hr", null), 
    React.createElement(List, {type: "most-relevant-this-week", url: "//www.reddit.com/r/DestinyTheGame/search.json?q=title%3ASGA&sort=relevance&restrict_sr=on&t=week"})
  ),
  document.getElementById( 'container' )
);

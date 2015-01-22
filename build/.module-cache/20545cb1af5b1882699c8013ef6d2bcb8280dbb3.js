function unescapeHTML( inputString ) {
  var e = document.createElement( 'div' );
  e.innerHTML = inputString;
  return !e.childNodes.length ? '' : e.childNodes[ 0 ].nodeValue;
}


// ### Main list container
var List = React.createClass({displayName: "List",
  componentDidMount: function() {

    // DUMMY DATA
    this.props.url = '/fixtures/search.json?';
    var cbNameMainData = 'cbMain' + 12345;
    // DUMMY DATA

    // var cbNameMainData = 'cbMain' + Date.now();
    var _this = this;
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
      title: this.props.data.title.replace( /^\[?SGA\]?[:\,]?\s*/, '' ),
      url: this.props.data.url.replace( /^http:/, 'https:' ),
      body: unescapeHTML( this.props.data.selftext_html ),
      createdAt: new Date( this.props.data.created_utc * 1000 ).toGMTString(),
      score: this.props.data.score,
      isExpanded: false
    };
  },

  _getClassesMain: function() {
    return React.addons.classSet({
      'Advice': true,
      'Advice__expanded': this.state.isExpanded
    });
  },

  _getClassesMeta: function() {
    return React.addons.classSet({
      'Advice-meta': true,
      'is-visible': this.state.isExpanded
    });
  },

  _toggleBody: function( evt ) {
    evt.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  },

  render: function() {
    return (
      React.createElement("section", {className:  this._getClassesMain() }, 
        React.createElement("span", {className: "Advice-cornerNW"}, "⌈"), 
        React.createElement("span", {className: "Advice-cornerNE"}, "⌉"), 
        React.createElement("span", {className: "Advice-cornerSW"}, "⌊"), 
        React.createElement("span", {className: "Advice-cornerSE"}, "⌋"), 
        React.createElement("h3", {className: "Advice-title"}, 
          React.createElement("a", {className: "Advice-score", title: "Reddit score"},  this.state.score), 
          React.createElement("a", {href:  this.state.url},  this.state.title)
        ), 
        React.createElement("span", {className:  this._getClassesMeta() }, 
          React.createElement("a", {href:  this.state.authorUrl},  this.state.authorName), 
          "· ",  this.state.createdAt
        ), 
        React.createElement("div", {className: "Advice-body", dangerouslySetInnerHTML: { __html: this.state.body}})
      )
    )
  }
});


// ### GO!
React.render(
  React.createElement("div", null, 
    React.createElement(List, {type: "most-relevant-this-month", url: "//www.reddit.com/r/DestinyTheGame/search.json?q=title%3ASGA&sort=relevance&restrict_sr=on&t=month"})
  ),
  document.getElementById( 'content' )
);

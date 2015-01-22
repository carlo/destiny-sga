function unescapeHTML( inputString ) {
  var e = document.createElement( 'div' );
  e.innerHTML = inputString;
  return !e.childNodes.length ? '' : e.childNodes[ 0 ].nodeValue;
}


// ### Main list container
var List = React.createClass({displayName: "List",
  getInitialState: function() {
    console.log( document.location.hash );
    return {
      elements: [],
      filter: document.location.hash.replace( /^#/, '' ) || 'new',
      isLoading: false
    };
  },

  componentDidMount: function() {
    this._fetchData();
  },

  _fetchData: function() {
    var self = this;
    var cbNameMainData = 'cbMain' + Date.now();
    var baseUrl = '//www.reddit.com/r/DestinyTheGame/search.json?q=title%3ASGA&restrict_sr=on&t=month&sort=' + this.state.filter;
    var script = document.createElement( 'script' );

    this.setState({
      elements: [],
      isLoading: true
    });

    // DUMMY DATA
    // url = '/fixtures/search.json?';
    // var cbNameMainData = 'cbMain' + 12345;
    // DUMMY DATA

    // Create callback for the JSONP call.
    window[ cbNameMainData ] = function( jsonData ) {
      self.setState({
        isLoading: false,
        elements: jsonData.data.children
      });

      // Clean up afterwards.
      delete window[ cbNameMainData ];
    };

    // Get main data file.
    script.src = baseUrl + '&jsonp=' + cbNameMainData;
    document.head.appendChild( script );
  },

  _show: function( newFilter, evt ) {
    if ( this.state.isLoading ) {
      evt.preventDefault();
      return;
    }

    this.setState(
      { filter: newFilter },
      this._fetchData
    );
  },

  _getClassesSelector: function( filter ) {
    return React.addons.classSet({
      'is-active': this.state.filter === filter
    });
  },

  _getClassesLoading: function() {
    return React.addons.classSet({
      'List-loadingIndicator': true,
      'is-visible': this.state.isLoading
    });
  },

  render: function() {
    var self = this;
    var selectorStrings = {
      'new': 'Newest',
      'relevance': 'Relevant this month',
      'hot': 'Hottest this month'
    };

    var selectorNodes = [ 'new', 'relevance', 'hot' ].map( function( type ) {
      var typeString = type;
      return (
        React.createElement("a", {href:  '#' + type, 
          className:  self._getClassesSelector( type), 
          onClick:  _( self._show ).partial( type) },  selectorStrings[ typeString] )
      );
    });

    var listElementNodes = this.state.elements.map( function( obj ) {
      return (
        React.createElement(ListElement, {data:  obj.data})
      );
    });

    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "Selector"}, 
          React.createElement("p", null, 
            React.createElement("span", null, "Show"), 
            selectorNodes 
          )
        ), 
        React.createElement("div", {className:  this._getClassesLoading() }, 
          "Pondering…" + ' ' +
          " ", 
          React.createElement("img", {src: "/img/loading.gif", alt: "Loading indicator"})
        ), 
        listElementNodes 
      )
    );
  }
});


// ### Single list element
var ListElement = React.createClass({displayName: "ListElement",
  getInitialState: function() {
    return {
      authorName: '/u/' + this.props.data.author,
      authorUrl: 'https://reddit.com/u/' + this.props.data.author,
      title: this.props.data.title.replace( /^\[?SGA\]?[:\,]?\s*/, ' ' ),
      url: this.props.data.url.replace( /^http:/, 'https:' ),
      body: unescapeHTML( this.props.data.selftext_html ),
      excerpt: this.props.data.selftext.substr( 0, 120 ).replace( /\w+$/, '…' ),
      createdAt: new Date( this.props.data.created_utc * 1000 ).toGMTString(),
      score: this.props.data.score,
      isExpanded: false
    };
  },

  _getClassesSection: function() {
    return React.addons.classSet({
      'Advice': true,
      'Advice__expanded': this.state.isExpanded
    });
  },

  _toggleBody: function( evt ) {
    evt.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  },

  render: function() {
    return (
      React.createElement("section", {className:  this._getClassesSection() }, 
        React.createElement("h3", {className: "Advice-title"}, 
          React.createElement("a", {href:  this.state.url, onClick:  this._toggleBody},  this.state.title)
        ), 

        React.createElement("p", {className: "Advice-excerpt", onClick:  this._toggleBody}, 
          React.createElement("span", {className: "Advice-toggle", onClick:  this._toggleBody}, "…"), 
           this.state.excerpt
        ), 

        React.createElement("p", {className: "Advice-meta"}, 
          "→ ", 
          React.createElement("a", {href:  this.state.url}, "SGA on /r/destinythegame"), 
          " by ", 
          React.createElement("a", {href:  this.state.authorUrl},  this.state.authorName), 
          " · ", 
           this.state.createdAt, 
          " · " + ' ' +
          "Score: ",  this.state.score
        ), 

        React.createElement("div", {className: "Advice-body", dangerouslySetInnerHTML: { __html: this.state.body}})
      )
    );
  }
});


// ### GO!
React.render(
  React.createElement(List, null),
  document.getElementById( 'content' )
);

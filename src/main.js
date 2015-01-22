function unescapeHTML( inputString ) {
  var e = document.createElement( 'div' );
  e.innerHTML = inputString;
  return !e.childNodes.length ? '' : e.childNodes[ 0 ].nodeValue;
}


// ### Main list container
var List = React.createClass({
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
        <a href={ '#' + type }
          className={ self._getClassesSelector( type ) }
          onClick={ _( self._show ).partial( type ) }>{ selectorStrings[ typeString] }</a>
      );
    });

    var listElementNodes = this.state.elements.map( function( obj ) {
      return (
        <ListElement data={ obj.data } />
      );
    });

    return (
      <div>
        <div className="Selector">
          <p>
            <span>Show</span>
            { selectorNodes }
          </p>
        </div>
        <div className={ this._getClassesLoading() }>
          Pondering…
          &nbsp;
          <img src="/img/loading.gif" alt="Loading indicator" />
        </div>
        { listElementNodes }
      </div>
    );
  }
});


// ### Single list element
var ListElement = React.createClass({
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
      <section className={ this._getClassesSection() }>
        <h3 className="Advice-title">
          <a href={ this.state.url } onClick={ this._toggleBody }>{ this.state.title }</a>
        </h3>

        <p className="Advice-excerpt" onClick={ this._toggleBody }>
          <span className="Advice-toggle" onClick={ this._toggleBody }>…</span>
          { this.state.excerpt }
        </p>

        <p className="Advice-meta">
          &rarr;&nbsp;
          <a href={ this.state.url }>SGA on /r/destinythegame</a>
          &nbsp;by&nbsp;
          <a href={ this.state.authorUrl }>{ this.state.authorName }</a>
          &nbsp;&middot;&nbsp;
          { this.state.createdAt }
          &nbsp;&middot;&nbsp;
          Score: { this.state.score }
        </p>

        <div className="Advice-body" dangerouslySetInnerHTML={{ __html: this.state.body }} />
      </section>
    );
  }
});


// ### GO!
React.render(
  <List/>,
  document.getElementById( 'content' )
);

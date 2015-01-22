var React = require( 'react/addons' );
var Timestamp = require( 'react-time' );
var _ = require( 'underscore' );


function unescapeHTML( inputString ) {
  var e = document.createElement( 'div' );
  e.innerHTML = inputString;
  return !e.childNodes.length ? '' : e.childNodes[ 0 ].nodeValue;
}


// ### Main list container
var List = React.createClass({
  getInitialState: function() {
    return {
      elements: [],
      filter: document.location.hash.replace( /^#/, '' ) || 'new',
      isLoading: false
    };
  },


  componentWillMount: function() {
    this._fetchData();
  },


  // ### _fetchData()
  //
  // Load data from Reddit API or get a cached copy from localStorage.  If a
  // successful API call was made, the returned object is stored locally for
  // 30 minutes.  The method will check whether the cached copy is still fresh
  // or not and return data accordingly.
  _fetchData: function() {
    var cacheKey = this.state.filter + '-cached';
    var cachedData = window.localStorage && window.localStorage.getItem( cacheKey );
    var storedObject;
    var self = this;
    var cbNameMainData;
    var script;

    // Do we have fresh data in the localstorage?  If yes, get it and forget
    // about the network call.
    if ( cachedData ) {
      storedObject = JSON.parse( cachedData );

      // Is the cached data fresher than 30 minutes?
      if ( storedObject.storedAt > ( _.now() - 1800000 ) ) {
        // Okay, this smells like bullshit territory.  When trying to update
        // `this.state.elements` with an array of the same length, the view
        // isn't updated.  But when I hand a copy of the new array, all is well.
        // WTF?
        this.setState(
          {
            isLoading: false,
            elements: this.state.elements.length ? [] : storedObject.redditData
          },
          function() {
            self.setState({
              elements: storedObject.redditData
            });
          }
        );

        return;
      }
    }

    // Tell the app we're getting new data now.
    this.setState({
      elements: [],
      isLoading: true
    });

    // Create the callback function name for the JSONP script call.
    cbNameMainData = 'cbMain' + Date.now();

    // Create callback for the JSONP call.
    window[ cbNameMainData ] = function( jsonData ) {
      self.setState({
        isLoading: false,
        elements: jsonData.data.children
      });

      // Store data in localstorage to reduce subsequent Reddit API calls.
      if ( window.localStorage ) {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            redditData: jsonData.data.children,
            storedAt: _.now()
          })
        );
      }

      // Clean up.
      delete window[ cbNameMainData ];
    };

    // Get data from Reddit.
    script = document.createElement( 'script' );
    script.src = '//www.reddit.com/r/DestinyTheGame/search.json?q=title%3ASGA&restrict_sr=on&t=month&sort=' + this.state.filter + '&jsonp=' + cbNameMainData;
    document.head.appendChild( script );
  },


  // ### _show()
  // Display a different list.  Used by `onClick`.
  _show: function( newFilter, evt ) {
    if ( this.state.isLoading || this.state.filter === newFilter) {
      if ( evt ) {
        evt.preventDefault();
      }
      return;
    }

    this.setState(
      { filter: newFilter },
      this._fetchData
    );
  },


  // ### _getClassesSelector()
  //
  // Returns the applicable CSS classes for the links in the `Selector` element.
  _getClassesSelector: function( filter ) {
    return React.addons.classSet({
      'is-active': this.state.filter === filter
    });
  },


  // ### _getClassesLoading()
  //
  // Returns the applicable CSS classes for the loading indicator element.
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
          <Timestamp value={ this.state.createdAt } relative />
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

function unescapeHTML( inputString ) {
  var e = document.createElement( 'div' );
  e.innerHTML = inputString;
  return !e.childNodes.length ? '' : e.childNodes[ 0 ].nodeValue;
}


// ### Main list container
var List = React.createClass({
  componentDidMount: function() {

    // DUMMY DATA
    // this.props.url = '/fixtures/search.json?';
    // var cbNameMainData = 'cbMain' + 12345;
    // DUMMY DATA

    var cbNameMainData = 'cbMain' + Date.now();
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
        <ListElement data={ obj.data } />
      );
    });

    return (
      <div>
        { listElementNodes }
      </div>
    )
  }
});


// ### Single list element
var ListElement = React.createClass({
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

  _getClassesToggle: function() {
    return React.addons.classSet({
      'Advice-toggle': true,
      'is-hidden': this.state.isExpanded
    });
  },

  _toggleBody: function( evt ) {
    evt.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  },

  render: function() {
    return (
      <section className={ this._getClassesMain() }>
        <span className="Advice-cornerNW">&lceil;</span>
        <span className="Advice-cornerNE">&rceil;</span>
        <span className="Advice-cornerSW">&lfloor;</span>
        <span className="Advice-cornerSE">&rfloor;</span>
        <h3 className="Advice-title">
          <a href={ this.state.url } onClick={ this._toggleBody }>{ this.state.title }</a>
          <span className="Advice-score" title="Reddit score">{ this.state.score }</span>
        </h3>
        <p className={ this._getClassesMeta() }>
          <a href={ this.state.url }>SGA on /r/destinythegame</a>
          &nbsp;by&nbsp;
          <a href={ this.state.authorUrl }>{ this.state.authorName }</a>
          &nbsp;&middot;&nbsp;
          { this.state.createdAt }
        </p>
        <div className="Advice-body" dangerouslySetInnerHTML={{ __html: this.state.body }} />
        <div className="Advice-toggle" onClick={ this._toggleBody }>{ this.state.isExpanded ? '∧' : '∨' }</div>
      </section>
    )
  }
});


// ### GO!
React.render(
  <List type="most-relevant-this-month" url='//www.reddit.com/r/DestinyTheGame/search.json?q=title%3ASGA&sort=relevance&restrict_sr=on&t=month' />,
  document.getElementById( 'content' )
);

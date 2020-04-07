function searchToObject() {
  var searchString = window.location.search;
  searchString = searchString.replace(/[+]/g, ' ');
  var pairs = searchString.substring(1).split("&"),
    obj = {},
    pair,
    i;
  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue;
    pair = pairs[i].split("=");
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
  }
  return obj;
}

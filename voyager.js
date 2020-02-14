/*
* Converts a string to a bool.
*
* This conversion will:
*
*  - match 'true', 'on', or '1' as true.
*  - ignore all white-space padding
*  - ignore capitalization (case).
*
* '  tRue  ','ON', and '1   ' will all evaluate as true.
*
* Taken from https://stackoverflow.com/a/264180
* 
*/
function strToBool(s)
{
  // will match one and only one of the string 'true','1', or 'on' rerardless
  // of capitalization and regardless off surrounding white-space.
  //
  regex=/^\s*(true|1|on)\s*$/i
  return regex.test(s);
}
var search = window.location.search;
var parameters = {};
search
  .substr(1)
  .split('&')
  .forEach(function(entry) {
    var eq = entry.indexOf('=');
    if (eq >= 0) {
      parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(
        entry.slice(eq + 1),
      );
    }
  });

/**
 * We can specify the endpoint through the included script, if it has param "endpoint"
 * Or default to "/api/graphql/"
 */
var getScriptURL = (function() {
  var scripts = document.getElementsByTagName('script');
  var index = scripts.length - 1;
  var myScript = scripts[index];
  return function() { return myScript.src; };
})();
const scriptURL = new URL(getScriptURL());
const scriptParams = new URLSearchParams(scriptURL.search);
let apiURL = scriptParams.has('endpoint') ? scriptParams.get('endpoint') : '/api/graphql/';
if (parameters.use_namespace && strToBool(parameters.use_namespace)) {
  apiURL += '?use_namespace=true';
}

function introspectionProvider(query) {
  return fetch(apiURL, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({query: query}),
  }).then(response => response.json());
}

// Render <Voyager />
GraphQLVoyager.init(document.getElementById('voyager'), {
  introspection: introspectionProvider
})
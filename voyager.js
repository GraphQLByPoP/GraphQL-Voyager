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
      let apiURL = window.location.origin + '/api/graphql/';
      // Copy parameters
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
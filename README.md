# harharhar
A drop-in data-mocking utility for single-page web apps.

Currently limited to XMLHttpRequests loading har files (load the file then intercept XMLHttpRequests to use the pre-recorded traffic). Planning websocket support, etc as time permits.

basic use
* open the chrome dev tools
* visit and use the target project with the dev tools open
* select the dev tools network tab
* right-click any network item and select the context-menu item 'Save as HAR with Content'
* load the `harharhar.js` file into the project
* load the saved har file with something like: `Mock('path/to/har');`
* matching XMLHttpRequests should now have the previously loaded content


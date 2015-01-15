# harharhar
load har files then intercept XMLHttpRequests to use the pre-recorded traffic

basic use
* open the chrome dev tools
* visit and use the target project with the dev tools open
* select the dev tools network tab
* right-click any network item and select the context-menu item 'Save as HAR with Content'
* load the `harharhar.js` file into the project
* load the saved har file with something like: `Mock('path/to/har');`
* matching XMLHttpRequests should now have the previously loaded content


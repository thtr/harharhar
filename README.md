# harharhar
A drop-in data-mocking utility for single-page web apps.

Currently limited to XMLHttpRequests loading har files (load the file then intercept XMLHttpRequests to use the pre-recorded traffic). Planning websocket support, etc as time permits. Please report any issues, especially in current browsers!

basic use
* open the chrome dev tools and visit + use the target project
* select the dev tools `Network` tab
* right-click any network item and select the context-menu item `Save as HAR with Content`
* load the `harharhar.js` file into the project
* load the saved har file with something like: `Mock('path/to/har');`
* matching XMLHttpRequests should now have the previously loaded content

HAR file info
* [What is a HAR File and what do I use it for?](http://www.speedawarenessmonth.com/what-is-a-har-file-and-what-do-i-use-it-for/)
* [Software is hard: HAR viewer blog post](http://www.softwareishard.com/har/viewer/)
* [Software is hard: HAR viewer tool](http://www.softwareishard.com/har/viewer/)
* [stackoverflow: How do I view / replay a chrome network debugger har file saved with content?](http://stackoverflow.com/questions/16199002/how-do-i-view-replay-a-chrome-network-debugger-har-file-saved-with-content)
* [superuser: What format does Google Chrome Developer Tools save data as?](http://superuser.com/questions/360992/what-format-does-google-chrome-developer-tools-save-data-as)
* [Software is hard: HAR 1.2 Spec](http://www.softwareishard.com/blog/har-12-spec/)

(function(window){
	function Mock(harfile){
	// Mock('http://.../some.har')
		Mock.load(harfile, Mock.setup).send();
	};
	Mock.version = '0';
	Mock.bypass = false;
	Mock._pending = 0;
	Mock._queue = [];
	Mock._XHR = window.XMLHttpRequest;
	Mock.list = {};
	Mock.load = function(url, fn){
		var xhr = new Mock._XHR();
		xhr.open('get', url, true);
		Mock._pending++;
		xhr.onreadystatechange = function(e){
			if(this.readyState !== 4) return;
			Mock._pending--;
			(fn || function(){}).call(this, e);
			if(Mock._pending < 1){
				Mock._queue.forEach(function(xhr){
					xhr.send.call(xhr, xhr._data);
				});
			};
		};
		return xhr;
	};
	Mock.setup = function(e){
		Mock.list[ this.responseURL ] = JSON.parse( this.responseText );
	};
	Mock.Har = function(){
		this.log = {
			version: '1.2'
			,creator: {name:'harharhar', version:Mock.version}
			,pages: [new Mock.Page()]
			,entries: []
		};
		this.log.entries.push(new Mock.Entry(this.log.pages[0].title));
	};
	Mock.Page = function(){
		this.id = 'page_generated';
		this.pageTimings = {onContentLoad: 100, onLoad: 111};
		this.startedDateTime = (new Date).toISOString();
		this.title = location.href;
	};
	Mock.Header = function(name, value){
		this.name = name;
		this.value = value;
	};
	Mock.Entry = function(pageTitle){
		this.cache = {};
		this.connection = "123"
		this.pageRef = pageTitle;
		this.request = {
			bodySize: 0
			// TODO
			,cookies: []
			// TODO
			,headers: []
			// TODO
			,headersSize: 0
			,httpVersion: 'HTTP/1.1'
			,method: 'GET'
			// TODO
			,queryString: []
			,url: location.href
		};
		this.response = {
			bodySize: 0
			// TODO
			,content: {
				compression: 0
				,mimeType: 'text/html'
				// TODO
				,size: 0
				,text: '1234'
			}
			// TODO
			,cookies: []
			// TODO
			,headers: []
			// TODO
			,headersSize: 0
			,httpVersion: 'HTTP/1.1'
			,redirectURL: ''
			,status: 200
			,statusText: 'OK'
		};
		this.startedDateTime = (new Date).toISOString();
		this.time = 3.123;
		this.timings = {
			blocked: 0.5
			,connect: 0.2
			,dns: 0.02
			,receive: 2.4
			,send: 0.05
			,ssl: -1
			,wait: 0.4
		};
		// TODO separate out dynamic stuff like this into isolated functionality
		this.response.content.size = this.response.content.text.length;
	};
	Mock.generateHar = function(){
		var har = new Mock.Har();

		return har;
	};
	Mock.report = function(){
	/**
	 * output info about mocked content to the console and as a string for a DOM UI
	 */
		var txt = ['--> see console output for more detail','har files loaded with entries:'];
		// print out all available the mock info
		for(var har in Mock.list){
			console.log(har, Mock.list[har]);
			txt.push(har);
			har = Mock.list[har];
			har.log.entries.forEach(function(d, i, entries){
				txt.push(['\t'+i, d.request.method, d.request.url].join(' '));
				console.log(i, d.request.method, d.request.url, d);
			});
		};
		return txt.join('\n');
	};
	Mock.response = function(xhr){
	/**
	 * find a response in the har mocks that matches the xhr
	 */
		// is there a har-file response that looks like a match?
		var har, i, entries, item, _loc;
		harsLoop: for(har in Mock.list){
			entries = Mock.list[ har ].log.entries;
			i = 0;
			while(item = entries[i++]){
				_loc = item.request.loc || ( item.request.loc = Mock.location( item.request.url, item.request.method ));
				if(_loc.method !== xhr.loc.method || _loc.href !== xhr.loc.href ) continue;

				item._har = har;
				item._index = i - 1;
				xhr.mock = item;
				break harsLoop;
			};
		};
		return xhr;
	};
	Mock.location = function(url, method){
	/**
	 * make a url (like 'http://domain/path/to/item?with=args) look like a window.location object
	 */
		var params = {}, loc = {_: url, origin: '', params: '', search: '', method: (method||'').toUpperCase()};
		// eg '/path/to/thing?and=stuff&this=things'
		// try '/path/to/thing?and=stuff&this=things'.match(/^[^?]+\??(.*)?/)
		url = url.match(/^(https?:\/\/[^\/]+)?([^?]+)\??(.*)?/) || [];
		loc.origin = url[1] || location.origin;
		loc.pathname = url[2].replace(/^\.\//,'');
		loc.params = url[3];
		if(!/^\//.test(loc.pathname)){
			loc.pathname = location.pathname.replace(/^(.*)\/[^\/]+$/,'$1/') + loc.pathname;
		};
		if(loc.params){
			loc.params.split('&').forEach(function(pair){
				pair = pair.split('=');
				params[ pair[0] ] = pair[1] || '';
			});
		};
		loc.params = params;
		// create a string 'a=b&c=d' with keys query from {z:2, a:1}
		// and sorted like: z=2&a=1 -> a=1&z=2
		loc.search = Object.keys(params).sort().map(function(key){
			return key + '=' + params[ key ];
		}).join('&');
		loc.href = loc.pathname + (loc.search ? ('?' + loc.search):'');

		return loc;
	};

	Mock.XMLHttpRequest = function FakeXMLHttpRequest(){
	/**
	 * fake XMLHttpRequest that masks a real one
	 * @constructor
	 * @this {FakeXMLHttpRequest}
	 */
		this._xhr = new Mock._XHR();
	};
	Mock.XMLHttpRequest.prototype = {
		onreadystatechange: function(){}
		,readyState: 0
		,status: 0
		,responseType: ''
		,open: function(method, url){
			this.loc = Mock.location(url, method);
			method = this.loc.method;
			url = this.loc.href;
			this.readyState = 3;
			return this._xhr.open.apply(this._xhr, arguments);
		}
		,send: function(data){
			if( !Mock.bypass && Mock._pending){
				this._data = data;
				Mock._queue.push(this);
				return;
			};
			if( !Mock.bypass && Mock.response(this).mock ){
				this.readyState = 4;
				this.status = this.mock.response.status;
				this.statusText = this.mock.response.statusText;
				this.responseURL = this.loc.href;
				this.response = this.responseText = this.mock.response.content.text;
				this.onreadystatechange.call(this, {
					bubbles: false
					,cancelBubble: false
					,cancelable: false
					,currentTarget: this
					,defaultPrevented: false
					,eventPhase: 2
					,path: []
					,returnValue: true
					,srcElement: this
					,target: this
					,timeStamp: Date.now()
					,type: 'readystatechange'
				});
			}else{
				this._xhr.onreadystatechange = this.onreadystatechange;
				this._xhr.send.apply(this._xhr, arguments);
			};
		}
	};
	var prop, value;
	for(prop in XMLHttpRequest.prototype){
	/**
	 * map missing methods that exist on real XMLHttpRequests onto the fake ones
	 */
		value = XMLHttpRequest.prototype[prop];
		if(Mock.XMLHttpRequest.prototype[prop]) continue;
		switch(typeof(value)){
		case 'function':
			Mock.XMLHttpRequest.prototype[prop] = (function(prop){
			// capture the property name
			return function(){
				return this._xhr[prop].apply(this._xhr, arguments);
			};
			})(prop);
		break;
		default:
			Mock.XMLHttpRequest.prototype[prop] = value;
		};
	};
	window.Mock = Mock;
	window.XMLHttpRequest = Mock.XMLHttpRequest;
})(window);


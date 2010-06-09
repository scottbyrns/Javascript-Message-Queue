(function (className) {
	var MessageQueue = function () {
		this.queuePool = {};
		this.queueCallbacks = {};
	};
	
	MessageQueue.prototype = {
		
		createQueue: function (queue, method) {
			this.queuePool[queue] = [];
			this.queueCallbacks[queue] = method;
			return {
				queue: queue,
				push: (function (that) {
					return function (value) {
						that.push(this.queue, value);
					};
				})(this),
				flush: (function (that) {
					return function () {
						that.flush(this.queue);
					};
				})(this),
				pop: (function (that) {
					return function () {
						that.pop(this.queue);
					};
				})(this),
				clear: (function (that) {
					return function () {
						that.clear(this.queue);
					};
				})(this)
			};
		},
		
		push: function (queue, message) {
			this.queuePool[queue] = this.queuePool[queue] || [];
			this.queuePool[queue].push(message);
		},
		
		flush: function (queue) {
			try {
				this.queueCallbacks[queue](this.queuePool[queue].shift());
			}
			catch (e) {}
		},
		
		pop: function (queue) {
			this.queuePool[queue].pop();
		},
		
		clear: function (queue) {
			this.queuePool[queue] = [];
		}
	};
	window[className] = new MessageQueue();
})('MessageQueue');
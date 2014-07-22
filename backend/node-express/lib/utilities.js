// Shortcut methods for checking environment variables
module.exports = {
	process: {
		has: function(name){
			return process.env.hasOwnProperty(name);
		},
		hasAll: function(){
			var args = Array.prototype.slice.call(arguments).filter(function(arg,i){
				return !process.env.hasOwnProperty(arg);
			});

			args.forEach(function(arg,i){
				console.log('Missing '+arg+' ENV variable.');
			});

			return args.length == 0;
		}
	}
};
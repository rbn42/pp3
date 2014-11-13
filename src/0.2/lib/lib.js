// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}
 

function v_mul(v, n) {
	for ( i = 0; i < v.length; i++)
		v[i] *= n;
}

function v_add(v, n) {
	for ( i = 0; i < v.length; i++)
		v[i] += n;
}

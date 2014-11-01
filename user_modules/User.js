
function User(conn) {
	var name = 'Anonymous';
	var color = { r: 0, g: 0, b: 0 };
	var size = 5;
	var isBrush = true;

	this.getName = function() {
		return name;
	};

	this.getState = function() {
		return {
			color: color,
			size: size,
			isBrush: isBrush,
		}
	};

	this.send = function(data) {
		conn.send(data);
	};

	this.setName = function(in_name) {
		name = in_name;
	};

	this.setSize = function(in_size) {
		size = in_size;
	};

	this.setColor = function(in_color) {
		color = in_color;
	};

	this.setBrush = function(in_isBrush) {
		isBrush = in_isBrush;
	}

	this.toggleBrush = function() {
		isBrush = !isBrush;
	};
}

module.exports = User;

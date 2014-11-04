
$(document).ready(function() {
	var server_address = 'ws://127.0.0.1:8080/'
	var canvas = $('#thecanvas');
	var announceTimeout = null;
	var usernames = {};

	var brushManager = new BrushManager(canvas);
	var comms = new ServerComms();
	var localBrush = new LocalBrush(comms, canvas, brushManager);

	var sizeCanvas = function() {
		canvas[0].width = canvas.parent().width();
		canvas[0].height = canvas.parent().height();
		brushManager.redraw();
	}
	$(window).load(sizeCanvas);
	$(window).resize(sizeCanvas);

	var announce = function(text, timeout) {
		var defaultTimeout = 3000;
		if(timeout == undefined) {
			timeout = defaultTimeout;
		}

		if(announceTimeout != null) {
			window.clearTimeout(announceTimeout);
		}

		$('#announce_text').text(text);

		announceTimeout = window.setTimeout(function() {
			$('#announce_text').text('');
		}, timeout);
	}

	var chatMessage = function(message, name) {
		var maxMessages = 100;
		var chatbox = $('#chat_box');
		var text = '';

		if(name != undefined) {
			text = name + ': ' + message;
		} else {
			text = '<em>' + message + '</em>';
		}

		chatbox.append('<p>' + text + '</p>');
		if(chatbox.children().length > maxMessages) {
			chatbox.find('p:first').remove();
		}
		chatbox.scrollTop(chatbox[0].scrollHeight);
	}

	var addUser = function(id, obj) {
		brushManager.newBrush(id);
		if(obj.size != undefined) brushManager.setSize(id, obj.size);
		if(obj.color != undefined) brushManager.setColor(id, obj.color);
		if(obj.isBrush != undefined) brushManager.setBrush(id, obj.isBrush);
		usernames[id] = obj.name;
	};

	var getName = function(id) {
		if(id in usernames) {
			return usernames[id];
		} else {
			return '??';
		}
	}

	comms.on('welcome', function(obj) {
		usernames[obj.id] = usernames[-1];

		if(obj.paths != undefined && obj.paths.length > 0) {
			brushManager.initPaths(obj.paths);
			brushManager.redraw();
		}
		for(id in obj.users) {
			addUser(id, obj.users[id]);
		}

		$('#loading').hide();
		$('#chat').show();
		brushManager.clearCanvas();
		announce('Joined room "' + obj.room + '"');
	}).on('clear', brushManager.clearCanvas
	).on('toggle_brush', function(obj) {
		brushManager.toggleBrush(obj.id);
	}).on('ch_color', function(obj) {
		brushManager.setColor(obj.id, obj.color);
	}).on('ch_size', function(obj) {
		brushManager.setColor(obj.id, obj.size);
	}).on('join', function(obj) {
		addUser(obj.id, obj);
		chatMessage(getName(obj.id) + ' joined the room');
	}).on('leave', function(obj) {
		brushManager.destroyBrush(obj.id);
		chatMessage(getName(obj.id) + ' left the room');
		delete usernames[id];
	}).on('message', function(obj) {
		chatMessage(obj.message, getName(obj.id));
	}).on('start', function(obj) {
		brushManager.startDraw(obj.id, obj.pos);
	}).on('stop', function(obj) {
		brushManager.endDraw(obj.id);
	}).on('update', function(obj) {
		brushManager.updateDraw(obj.id, obj.pos);
	});

	$('#loading').hide();
	$('#chat').hide();

	$('#colorpicker').spectrum({
		color: '#000',
		showButtons: false,
		showPaletteOnly: true,
		togglePaletteOnly: true,
		togglePaletteMoreText: '...',
		togglePaletteLessText: '...',
		change: function(color) {
			localBrush.setColor(color.toRgb());
		}
	});

	var size_slider = $('#size_slider')
	var slider_container = $('#slider_container');
	slider_container.hide();
	size_slider.slider({
		min: 1,
		max: 30,
		step: 1,
		value: 5
	});

	var confirm_dialog = $('#clear_canvas_dialog')
	confirm_dialog.dialog({
		resizable: false,
		modal: true,
		autoOpen: false,
		buttons: {
			"Clear": function() {
				localBrush.clearCanvas();
				$(this).dialog('close');
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		}
	})

	size_slider.on('slidestop', function(event, ui) {
		localBrush.setSize(ui.value);
	});

	$('#size_button').mouseenter(function() {
		$(this).width($(this).width() - 5);
		$(this).height($(this).height() - 5);
	}).mouseleave(function() {
		$(this).width($(this).width() + 5);
		$(this).height($(this).height() + 5);
	}).click(function(event) {
		event.stopPropagation();
		slider_container.css({ 'left': $('#toolbar').width(),
			'top': $('#size_button_container').position().top + $('#size_button_container').height() / 2 - slider_container.height() / 2});
		slider_container.show();
		$(document).on('click', function(event) {
			if (!$(event.target).closest('#menucontainer').length) {
				slider_container.hide();
			}
		});
	});

	$('#brush_button').mouseenter(function() {
		$(this).removeClass();
		if(localBrush.isBrush()) {
			$(this).addClass('brush_hover');
		} else {
			$(this).addClass('eraser_hover');
		}
	}).mouseleave(function() {
		$(this).removeClass();
		if(localBrush.isBrush()) {
			$(this).addClass('brush');
		} else {
			$(this).addClass('eraser');
		}
	}).click(function(event) {
		$(this).removeClass();
		localBrush.toggleBrush();
		if(localBrush.isBrush()) {
			$(this).addClass('brush_hover');
		} else {
			$(this).addClass('eraser_hover');
		}
	});

	$('#clear_button').mouseenter(function() {
		$(this).removeClass();
		$(this).addClass('clear_hover');
	}).mouseleave(function() {
		$(this).removeClass();
		$(this).addClass('clear');
	}).click(function(event) {
		confirm_dialog.dialog('open');
	});

	$('#connect_button').click(function() {
		//BrushManager, not LocalBrush - don't want to clear the 
		// server's canvas
		$('#connect').hide();
		$('#loading').show();

		var user = localBrush.getProperties();
		user.name = $('#name_input').val();
		usernames[-1] = user.name;

		if(!comms.isConnected()) {
			comms.connect(server_address, user, function() {
				comms.joinRoom($('#room_input').val());
			});
		} else {
			brushManager.clearCanvas();
			comms.leaveRoom();
			comms.joinRoom($('#room_input').val());
		}
	});

	var sendChat = function() {
		comms.sendMessage($('#chat_input').val());
	};
	$('#chat_button').click(sendChat);
	$('#chat_input').keyup(function(event) {
		if(event.keyCode == 13) {
			sendChat();
		}
	});

	$('#leave_button').click(function() {
		$('#chat').hide();
		$('#connect').show();
		room.leaveRoom();
	});

	comms.on('close', function(closeEvent) {
		announce('Connection closed');
		$('#chat').hide();
		$('#connect').show();
	});
});

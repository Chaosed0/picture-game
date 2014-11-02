
$(document).ready(function() {
	var server_address = 'ws://127.0.0.1:8080/'
	var canvas = $('#thecanvas');
	var announceTimeout = null;

	var brushManager = new BrushManager(canvas);
	var comms = new ServerComms(brushManager);
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

	var chatMessage = function(name, message) {
		var maxMessages = 100;
		var chatbox = $('#chat_box');
		var text = name + ': ' + message;
		chatbox.append('<p>' + text + '</p>');
		/*if(chatbox.children().length > maxMessages) {
			chatbox.find('p:first').remove();
		}*/
		chatbox.scrollTop(chatbox[0].scrollHeight);
	}
	comms.onChatMessage(chatMessage);

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

		if(!comms.isConnected()) {
			comms.connect(server_address, user, function() {
				comms.joinRoom($('#room_input').val());
			}, function(name) {
				$('#loading').hide();
				$('#chat').show();
				brushManager.clearCanvas();
				announce('Joined room "' + name + '"');
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
});

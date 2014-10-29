
$(document).ready(function() {
	var canvas = $('#thecanvas');
	var offline = false;

	var brushManager = new BrushManager(canvas);
	var comms;
	if(offline) {
		comms = new NullComms();
	} else {
		comms = new ServerComms('ws://127.0.0.1:8080/', brushManager);
	}
	var localBrush = new LocalBrush(comms, canvas, brushManager);

	var sizeCanvas = function() {
		canvas[0].width = canvas.parent().width();
		canvas[0].height = canvas.parent().height();
		brushManager.redraw();
	}
	$(window).load(sizeCanvas);
	$(window).resize(sizeCanvas);

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
});

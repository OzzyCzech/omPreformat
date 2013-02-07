/**
 * @author Roman Ozana <ozana@omdesign.cz>
 */
var omPreDialog = (function ($) {
	var _dialog = { isOpen: false }, _editor = {}, _decDictionary = {}, _config, _encRegex;
	var _tags = {
		precode: { open: '<pre><code>', close: '</code></pre>' },
		pre: { open: '<pre>', close: '</pre>'},
		code: { open: '<code>', close: '</code>' }
	};
	var _encDictionary = { '<': 'lt', '>': 'gt', '"': 'quot', '&': 'amp' };

	var _prepareSnippet = function _prepareSnippet(html, wrap, wrapper, spaces) {
		var snippet = html.replace(_encRegex, function (char) {
			return '&' + _encDictionary[char] + ';';
		});

		// prida obal komel
		if (wrap)
			snippet = _tags[wrapper].open + snippet + _tags[wrapper].close;

		// nahradi taby mezerama
		if (spaces)
			snippet = snippet.replace(/\t/g, ' ');

		return snippet;
	};

	var _insertContent = function _insertContent(editor, content) {
		editor.execCommand('mceInsertContent', false, content);
	};

	return {
		init: function () {
			var char_list = '';

			_dialog.view = $('#omPreDialog');

			_dialog.textarea = document.getElementById('omPreDialog-code-area');
			_dialog.submit = document.getElementById('omPreDialog-submit');
			_dialog.wrapCheck = document.getElementById('omPreDialog-wrap-checkbox');
			_dialog.spacesCheck = document.getElementById('omPreDialog-spaces-checkbox');
			_dialog.preCodeRadio = document.getElementById('omPreDialog-pre-code-wrap');

			$('#omPreDialog-cancel').bind('click', omPreDialog.close);

			_dialog.view.bind('submit', omPreDialog.onSubmit);
			_dialog.view.bind('keyup', omPreDialog.keyUp);
			_dialog.view.bind('wpdialogbeforeopen', omPreDialog.beforeOpen);
			_dialog.view.bind('wpdialogclose', omPreDialog.onClose);

			// Dinamically init the decoding dictionary and the encoding regex
			for (var char in _encDictionary) {
				char_list += char;
				_decDictionary[ _encDictionary[char] ] = char
			}

			_encRegex = new RegExp('[' + char_list + ']', 'g');
		},

		open: function (editor) {
			_editor = editor;

			if (!_dialog.view.data('wpdialog')) {
				_dialog.view.wpdialog({
					title: '',
					width: 600,
					height: 'auto',
					modal: true,
					dialogClass: 'wp-dialog',
					zIndex: 300000
				});
			}

			_dialog.view.wpdialog('open');
		},

		beforeOpen: function () {
			_dialog.isOpen = true;
			_dialog.wrapCheck.checked = true;
			_dialog.preCodeRadio.checked = true;
		},

		close: function () {
			_dialog.view.wpdialog('close');
			return false;
		},

		onClose: function () {
			_dialog.isOpen = false;
			_dialog.textarea.value = '';
			_editor.focus();
		},

		onSubmit: function () {
			if (_dialog.textarea.value) {
				var wrapper = $('input[name=wrapper]:checked', $(_dialog.view)).val();
				_insertContent(
						_editor,
						_prepareSnippet(
								_dialog.textarea.value,
								_dialog.wrapCheck.checked,
								wrapper,
								_dialog.spacesCheck.checked
						)
				);
				return omPreDialog.close();
			}

			_dialog.textarea.focus();

			return false;
		},

		keyUp: function (event) {
			if (event.which == $.ui.keyCode.ESCAPE) {
				event.stopImmediatePropagation();
				omPreDialog.close();
				return false;
			}

			return true;
		}
	};
})(jQuery);
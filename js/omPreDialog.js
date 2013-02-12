/**
 * Dialog for preformat code insertation
 * @author Roman Ozana <ozana@omdesign.cz>
 */

var omPreDialog = (function ($) {

	var _dialog = { isOpen: false }, _editor = {}, _decDictionary = {}, _encRegex, _node;

	var _tags = {
		precode: { open: '<pre><code>', close: '</code></pre>' },
		pre: { open: '<pre>', close: '</pre>'},
		code: { open: '<code>', close: '</code>' }
	};

	var _encoding = { '<': 'lt', '>': 'gt', '"': 'quot', '&': 'amp' };

	/**
	 * Wrap code with tags
	 * @param string code
	 * @param wrapper
	 * @return {*}
	 * @private
	 */
	var _wrap = function _wrap(code, wrapper) {
		return _tags[wrapper].open + code + _tags[wrapper].close;
	}

	/**
	 * Encode common HTML elements
	 * @param text
	 * @return {*|void}
	 * @private
	 */
	var _code = function _code(content, spaces) {
		content = content.replace(_encRegex, function (char) {
			return '&' + _encoding[char] + ';';
		});

		// replace tab with spaces
		if (spaces) content = content.replace(/\t/g, ' ');

		return content;
	}

	return {
		init: function () {

			// dialog
			_dialog.view = $('#omPreDialog');

			// main elements
			_dialog.textarea = document.getElementById('omCodeTextarea');
			_dialog.submit = document.getElementById('omSubmitDialog');

			// space / tabs replacement
			_dialog.spacesCheckbox = document.getElementById('omSpacesCheckbox');

			// radio buttons
			_dialog.preCodeWrapperRadio = document.getElementById('omPreCodeWrapperRadio');
			_dialog.codeWrapperRadio = document.getElementById('omCodeWrapperRadio')
			_dialog.preWrapperRadio = document.getElementById('omPreWrapperRadio')

			// events
			$('#omCancelDialog').bind('click', omPreDialog.close);
			_dialog.view.bind('submit', omPreDialog.onSubmit);
			_dialog.view.bind('keyup', omPreDialog.keyUp);
			_dialog.view.bind('wpdialogbeforeopen', omPreDialog.beforeOpen);
			_dialog.view.bind('wpdialogclose', omPreDialog.onClose);

			// Dinamically init the decoding dictionary and the encoding regex
			var char_list = '';
			for (var ch in _encoding) {
				char_list += ch;
				_decDictionary[ _encoding[ch] ] = ch
			}
			_encRegex = new RegExp('[' + char_list + ']', 'g');
		},

		open: function (editor) {
			_editor = editor;
			_node = _editor.selection.getNode();

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
			_dialog.preCodeWrapperRadio.checked = true; // default value
			_dialog.submit.value = 'Vložit kód';
			_dialog.textarea.focus();

			// update checkboxes
			if (_node.nodeName == 'PRE') _dialog.preWrapperRadio.checked = true;
			if (_node.nodeName == 'CODE') _dialog.codeWrapperRadio.checked = true;
			if (_node.nodeName == 'CODE' && _node.parentNode.nodeName == 'PRE') _dialog.preCodeWrapperRadio.checked = true;

			// getting node value
			if (_node.nodeName == 'PRE' || _node.nodeName == 'CODE') {
				_dialog.textarea.value = _editor.selection.getNode().innerText;
				_dialog.submit.value = 'Aktualizovat';
			}

			if (_editor.selection.getContent()) {
				_dialog.textarea.value = _editor.selection.getContent();
				_dialog.codeWrapperRadio.checked = true; // prefer <code>
				_dialog.submit.value = 'Aktualizovat';
			}

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
				omPreDialog.updateContent();
				return omPreDialog.close();
			}

			_dialog.textarea.focus();
			return false;
		},

		getCodeWrapper: function () {
			return $('input[name=wrapper]:checked', $(_dialog.view)).val();
		},

		updateContent: function () {
			var code = _wrap(
					_code(_dialog.textarea.value, _dialog.spacesCheckbox.checked),
					omPreDialog.getCodeWrapper()
			);

			// have some tags
			if (_node.nodeName == 'PRE' || _node.nodeName == 'CODE') {
				if (_node.nodeName == 'CODE' && _node.parentNode.nodeName == 'PRE') {
					_editor.selection.select(_node.parentNode);
				} else {
					_editor.selection.select(_node);
				}
			}

			// split paragraph to two new when
			if (_node.nodeName == 'CODE' && _node.parentNode.nodeName == 'P' && omPreDialog.getCodeWrapper() != 'code') _node.remove();

			if (_editor.selection.getContent()) {
				return _editor.selection.setContent(code);
			}

			// just insert new one
			return _editor.execCommand('mceInsertContent', false, code);
		},

		keyUp: function (event) {
			// close dialog by ESC button
			if (event.which == $.ui.keyCode.ESCAPE) {
				event.stopImmediatePropagation();
				omPreDialog.close();
				return false;
			}
			return true;
		}

	}
			;
})
		(jQuery);
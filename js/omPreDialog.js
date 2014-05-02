/**
 * Dialog for preformat code insertation
 * @author Roman Ozana <ozana@omdesign.cz>
 */

var omPreDialog = (function ($) {

	var _window = _editor = _decDictionary = _options = {};
	var _editor, _encRegex, _node;

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


			_options = '<label>' +
					'<input type="radio" checked="checked" id="omPreCodeWrapperRadio" name="wrapper" value="precode">' +
					'<code>&lt;pre&gt;&lt;code&gt;</code>' +
					'</label> ' +
					'<label>' +
					'<input type="radio" id="omPreWrapperRadio" name="wrapper" value="pre">' +
					'<code>&lt;pre&gt;</code>' +
					'</label> ' +
					'<label>' +
					'<input type="radio" id="omCodeWrapperRadio" name="wrapper" value="code">' +
					'<code>&lt;code&gt;</code>' +
					'</label> ' +
					'<label>' +
					'<input type="checkbox" checked="checked" id="omSpacesCheckbox" value="1"> nahradit taby mezerama' +
					'</label>';

			// Dinamically init the decoding dictionary and the encoding regex
			var char_list = '';
			for (var ch in _encoding) {
				char_list += ch;
				_decDictionary[ _encoding[ch] ] = ch
			}
			_encRegex = new RegExp('[' + char_list + ']', 'g');
		},

		open: function (editor, url) {
			_editor = editor;
			_node = _editor.selection.getNode();
			_window = _editor.windowManager.open({
						id: 'omPreDialog_wrapper',

						title: 'Vložit preformátovaný kód',
						pading: 10,
						padding: 10,
						dialogClass: 'wp-dialog',
						zIndex: 300000,

						body: [
							{
								type: 'textbox',
								id: 'omCodeTextarea',
								name: 'omCodeTextarea',
								label: '',
								value: '',
								multiline: true,
								autofocus: true,
								minWidth: 800,
								minHeight: 400
							},
							{
								type: 'container',
								html: _options
							}
						],
						onsubmit: function (e) {
							console.log(e.data);
							if (e.data.omCodeTextarea) {
								omPreDialog.updateContent(e.data.omCodeTextarea);
							} else {
								e.preventDefault();
							}
						}
					}
			);
		},

		beforeOpen: function () {

			// update checkboxes
			if (_node.nodeName == 'PRE') _window.preWrapperRadio.checked = true;
			if (_node.nodeName == 'CODE') _window.codeWrapperRadio.checked = true;
			if (_node.nodeName == 'CODE' && _node.parentNode.nodeName == 'PRE') _window.preCodeWrapperRadio.checked = true;

			// getting node value
			if (_node.nodeName == 'PRE' || _node.nodeName == 'CODE') {
				_window.textarea.value = _editor.selection.getNode().innerText;
			}

			if (_editor.selection.getContent()) {
				_window.textarea.value = _editor.selection.getContent();
				_window.codeWrapperRadio.checked = true; // prefer <code>
			}

		},

		getCodeWrapper: function () {
			return $('input[name=wrapper]:checked', $(_window.view)).val();
		},

		updateContent: function (code) {
			var code = _wrap(
					_code(_window.textarea.value, _window.spacesCheckbox.checked),
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
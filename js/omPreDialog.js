/**
 * Dialog for preformat code insertation
 * @author Roman Ozana <roman@ozana.cz>
 */

var omPreDialog = (function ($) {

	var _modal = _decDictionary = _options = {};
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
	var _wrapCode = function _wrapCode(code, wrapper) {
		return _tags[wrapper].open + code + _tags[wrapper].close;
	}

	/**
	 * Encode common HTML elements
	 * @param text
	 * @return {*|void}
	 * @private
	 */
	var _processCode = function _processCode(content, spaces) {
		content = content.replace(_encRegex, function (char) {
			return '&' + _encoding[char] + ';';
		});

		// replace tab with spaces
		if (spaces) content = content.replace(/\t/g, ' ');

		return content;
	}

	return {
		getModalBody: function () {
			var style = 'float:left;margin-right:8px;';

			return [
				{
					type: 'textbox',
					name: 'omCode',
					label: '',
					value: this.getContent(),
					multiline: true,
					autofocus: true,
					minWidth: 820,
					minHeight: 420
				},
				{
					type: 'container',
					style: "height:32px",
					items: [
						{
							type: 'listbox',
							name: 'omCodeWrapper',
							style: style,
							value: this.getCodeWrapper(),
							values: [
								{text: '<pre><code>', value: 'precode'},
								{text: '<pre>', value: 'pre'},
								{text: '<code>', value: 'code'}
							]
						},
						{name: 'omSpaces', type: 'checkbox', checked: true, text: 'nahradit taby mezerama', style: style + 'margin-top: 6px'}
					]
				}
			]
		},

		init: function () {

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
			_node = editor.selection.getNode(); // current node

			_modal = editor.windowManager.open({
						id: 'omPreDialog_wrapper',
						title: 'Vložit preformátovaný kód',
						pading: 0,
						dialogClass: 'wp-dialog',
						zIndex: 99999,
						body: this.getModalBody(),
						onsubmit: function (e) {

							if (e.data.omCode) {
								console.log(e.data);
								omPreDialog.updateContent(
										e.data.omCode,
										e.data.omCodeWrapper,
										e.data.omSpaces
								)
							} else {
								e.preventDefault();
							}
						}
					}
			);
		},

		getCodeWrapper: function () {
			if (_editor.selection.getContent() || _node.nodeName == 'CODE') return 'code';
			if (_node.nodeName == 'PRE') return 'pre';
			if (_node.nodeName == 'CODE' && _node.parentNode.nodeName == 'PRE') return 'precode';
		},

		getContent: function () {
			if (_node.nodeName == 'PRE' || _node.nodeName == 'CODE') {
				return _editor.selection.getNode().innerText;
			}
			if (_editor.selection.getContent()) return _editor.selection.getContent();
		},

		updateContent: function (code, wrapper, spaces) {
			var code = _wrapCode(_processCode(code, spaces), wrapper); // handle code
			// have some tags? select them
			if (_node.nodeName == 'PRE' || _node.nodeName == 'CODE') {
				if (_node.nodeName == 'CODE' && _node.parentNode.nodeName == 'PRE') {
					_editor.selection.select(_node.parentNode);
				} else {
					_editor.selection.select(_node);
				}
			}

			// split paragraph to two new when
			if (_node.nodeName == 'CODE' && _node.parentNode.nodeName == 'P' && wrapper != 'code') _node.remove();

			if (_editor.selection.getContent()) {
				return _editor.selection.setContent(code);
			}

			// just insert new one
			return _editor.execCommand('mceInsertContent', false, code);
		}
	};
})(jQuery);

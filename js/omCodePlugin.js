/**
 * Plugin for <code></code> insertation
 * @author Roman Ozana <ozana@omdesign.cz>
 */
var omCodePlugin = (function () {

	tinymce.create('tinymce.plugins.omCodePlugin', {

		init: function (editor, url) {

			editor.addCommand('omInlineCode', function () {
				editor.formatter.toggle('inlinecode');
			});

			editor.addButton('omCodePlugin', {
						title: '<code> (Alt-Shift-C)',
						cmd: 'omInlineCode',
						image: url + '/code.png'
					}
			);

			editor.addShortcut('alt+shift+c', 'Inline <code>', 'omInlineCode');

			editor.onInit.add(function () {
				editor.formatter.register('inlinecode', {inline: 'code', remove: 'all'});
			});

		},

		getInfo: function () {
			return {
				longname: "Insert inline code",
				author: "Roman Ožana",
				authorurl: "http://www.omdesign.cz/",
				infourl: "http://www.omdesign.cz/",
				version: "1.0"
			};
		}
	});

	tinymce.PluginManager.add('omCodePlugin', tinymce.plugins.omCodePlugin);

})();

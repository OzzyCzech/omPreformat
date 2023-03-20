/**
 * Plugin for <code></code> insertation
 * @author Roman Ozana <roman@ozana.cz>
 */
var omCodePlugin = (function () {

	tinymce.create('tinymce.plugins.omCodePlugin', {

		init: function (editor, url) {

			editor.addButton('omCodePlugin', {
						title: '<code> (Alt-Shift-C)',
						cmd: 'omInlineCode',
						image: url + '/code.png'
					}
			);

			editor.addCommand('omInlineCode', function () {
				editor.formatter.toggle('inlinecode');
			});

			editor.addShortcut('alt+shift+c', 'Inline <code>', 'omInlineCode');

			editor.on('init', function () {
				editor.formatter.register('inlinecode', {inline: 'code', remove: 'all'});
			});
		},

		getInfo: function () {
			return {
				longname: "Insert inline code",
				author: "Roman Ožana",
				authorurl: "https://ozana.cz/",
				infourl: "https://ozana.cz/",
				version: "1.0"
			};
		}
	});

	tinymce.PluginManager.add('omCodePlugin', tinymce.plugins.omCodePlugin);

})();

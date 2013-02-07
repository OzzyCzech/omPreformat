/**
 * @author Roman Ozana <ozana@omdesign.cz>
 */
var omPrePlugin = (function ($) {
	// Register TinyMce plugin
	tinymce.create('tinymce.plugins.omPrePlugin', {

		init: function (editor, url) {
			editor.addButton('omPrePlugin', {
				title: 'omPrePlugin.code',
				image: url + '/pre.png',
				onclick: function () {
					omPreDialog.open(editor);
				}
			});
		},

		createControl: function (n, cm) {
			return null;
		},

		getInfo: function () {
			return {
				longname: "Insert preformat code",
				author: "Roman Ožana",
				authorurl: "http://www.omdesign.cz/",
				infourl: "http://www.omdesign.cz/",
				version: "1.0"
			};
		}
	});


	tinymce.PluginManager.add('omPrePlugin', tinymce.plugins.omPrePlugin);
})(jQuery);

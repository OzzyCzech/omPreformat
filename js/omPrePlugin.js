/**
 * TinyMCE plugin for <pre>, <code>, <pre><code> insertation
 * @author Roman Ozana <ozana@omdesign.cz>
 */
var omPrePlugin = (function () {

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

		getInfo: function () {
			return {
				longname: "Preformat code insert",
				author: "Roman Ožana",
				authorurl: "http://www.omdesign.cz/",
				infourl: "http://www.omdesign.cz/",
				version: "1.0"
			};
		}
	});

	tinymce.PluginManager.add('omPrePlugin', tinymce.plugins.omPrePlugin);

})();

/**
 * TinyMCE plugin for <pre>, <code>, <pre><code> insertation
 * @author Roman Ozana <roman@ozana.cz>
 */
var omPrePlugin = (function () {

	tinymce.create(
			'tinymce.plugins.omPrePlugin',
			{
				init: function (editor, url) {

					editor.addButton('omPrePlugin', {
						title: 'Insert code',
						image: url + '/pre.png',
						cmd: 'omPreCode'
					});

					editor.addCommand('omPreCode', function () {
								omPreDialog.open(editor, url);
							}
					);

				},

				getInfo: function () {
					return {
						longname: "Preformat code insert",
						author: "Roman Ožana",
						authorurl: "https://ozana.cz/",
						infourl: "https://ozana.cz/",
						version: "1.0"
					};
				}

			});

	tinymce.PluginManager.add('omPrePlugin', tinymce.plugins.omPrePlugin);

})();
<?php
/**
 * Plugin Name: omPreformat
 * Plugin URI: http://www.omdesign.cz
 * Description: Preformat publish code
 * Version: 2.0
 * Author: Roman Ožana
 * Author URI: http://www.omdesign.cz/contact
 *
 * @author Roman Ozana <ozana@omdesign.cz>
 */
class omPreformat {

	public function __construct() {
		add_action('init', array(&$this, 'init'));
	}

	public function init() {
		global $pagenow;

		if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) return;
		if (get_user_option('rich_editing') !== 'true') return;
		if (in_array($pagenow, array('post.php', 'post-new.php')) === false) return;

		add_filter('mce_external_plugins', array(&$this, 'addPrePlugin'));
		add_filter('mce_buttons', array(&$this, 'addPreButton'));
		add_action('admin_print_footer_scripts', array(&$this, 'initScript'));
		add_action('admin_enqueue_scripts', array(&$this, 'enqueueScript'));
	}

	public function enqueueScript() {
		wp_enqueue_script('omPreDialog', plugins_url('js/omPreDialog.js', __FILE__));
	}


	public function addPrePlugin($plugin_array) {
		$plugin_array['omPrePlugin'] = plugins_url('js/omPrePlugin.js', __FILE__);
		$plugin_array['omCodePlugin'] = plugins_url('js/omCodePlugin.js', __FILE__);
		return $plugin_array;
	}

	public function addPreButton($buttons) {
		array_push($buttons, "|", "omPrePlugin");
		array_push($buttons, "|", "omCodePlugin");
		return $buttons;
	}
	public function initScript() {
		echo '<script>jQuery(document).ready(omPreDialog.init());</script>';
	}

}

if (defined('ABSPATH')) return new omPreformat;


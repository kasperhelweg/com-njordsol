<div id="kmspc_data" class="panel woocommerce_options_panel wc-metaboxes-wrapper">
	<div class="options_group">
		<p class="form-field">
			<label for="kmspc-module"><?php _e( 'Module', 'radykal' ); ?></label>
			<select name="kmspc_module" id="kmspc-module">
				<?php
					foreach($options['module'] as $key  => $value) {
						echo '<option value="'.$key.'" '.selected($stored_options['module'], $key, false).'>'.$value.'</option>';
					}
				?>
			</select>
		</p>
		<p class="form-field">
			<label for="kmspc-grid-item-layout"><?php _e( 'Grid Item Layout', 'radykal' ); ?></label>
			<select name="kmspc_grid_item_layout" id="kmspc-grid-item-layout">
				<?php
					foreach($options['grid_item_layout'] as $key  => $value) {
						echo '<option value="'.$key.'" '.selected($stored_options['grid_item_layout'], $key, false).'>'.$value.'</option>';
					}
				?>
			</select>
		</p>
		<p class="form-field">
			<label for="kmspc-columns"><?php _e( 'Columns', 'radykal' ); ?></label>
			<select name="kmspc_columns" id="kmspc-columns">
				<?php
					foreach($options['columns'] as $key  => $value) {
						echo '<option value="'.$key.'" '.selected($stored_options['columns'], $key, false).'>'.$value.'</option>';
					}
				?>
			</select>
		</p>
		<p class="form-field">
			<label for="kmspc-auto-next"><?php _e( 'Auto-Next', 'radykal' ); ?></label>
			<input type="checkbox" class="checkbox" id="kmspc-auto-next" name="kmspc_auto_next" value="yes" <?php checked($stored_options['auto_next'], 'yes'); ?> />
			<img class="help_tip" data-tip="<?php esc_attr_e( 'When the user selects an attribute from a block, it opens the next block automatically.', 'radykal' ); ?>" src="<?php echo esc_url( WC()->plugin_url() ); ?>/assets/images/help.png" height="16" width="16" />
		</p>
		<p class="form-field">
			<label for="kmspc-step-by-step"><?php _e( 'Step by Step', 'radykal' ); ?></label>
			<input type="checkbox" class="checkbox" id="kmspc-step-by-step" name="kmspc_step_by_step" value="yes" <?php checked($stored_options['step_by_step'], 'yes'); ?> />
			<img class="help_tip" data-tip="<?php esc_attr_e( 'The user needs to select an attribute of the current showing block first to select an attribute of the next block.', 'radykal' ); ?>" src="<?php echo esc_url( WC()->plugin_url() ); ?>/assets/images/help.png" height="16" width="16" />
		</p>
	</div>
	<div class="options_group">
		<p class="form-field">
			<label for="kmspc-template-layout"><?php _e( 'Template Layout', 'radykal' ); ?></label>
			<select name="kmspc_template_layout" id="kmspc-template-layout">
				<?php
					foreach($options['template_layout'] as $key  => $value) {
						echo '<option value="'.$key.'" '.selected($stored_options['template_layout'], $key, false).'>'.$value.'</option>';
					}
				?>
			</select>
		</p>
		<p class="form-field">
			<label for="kmspc-product-image"><?php _e( 'Product Image', 'radykal' ); ?></label>
			<select name="kmspc_product_image" id="kmspc-product-image">
				<?php
					foreach($options['product_image'] as $key  => $value) {
						echo '<option value="'.$key.'" '.selected($stored_options['product_image'], $key, false).'>'.$value.'</option>';
					}
				?>
			</select>
		</p>
		<p class="form-field">
			<label for="kmspc-module-position"><?php _e( 'Module Position', 'radykal' ); ?></label>
			<select name="kmspc_module_position" id="kmspc-module-position">
				<?php
					foreach($options['module_position'] as $key  => $value) {
						echo '<option value="'.$key.'" '.selected($stored_options['module_position'], $key, false).'>'.$value.'</option>';
					}
				?>
			</select>
		</p>
	</div>
</div>
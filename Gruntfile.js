/* jshint node:true */
module.exports = function( grunt ) {
	'use strict';

	grunt.initConfig({

		// JavaScript linting with JSHint.
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'js/*.js',
				'!js/*.min.js',
				'inc/customizer/js/*.js',
				'!inc/customizer/js/*.min.js'
			]
		},

		// Minify .js files.
		uglify: {
			options: {
				preserveComments: 'some'
			},
			main: {
				files: [{
					expand: true,
					cwd: 'js/',
					src: [
						'*.js',
						'!*.min.js'
					],
					dest: 'js/',
					ext: '.min.js'
				}]
			},
			customizer: {
				files: [{
					expand: true,
					cwd: 'inc/customizer/js/',
					src: [
						'*.js',
						'!*.min.js'
					],
					dest: 'inc/customizer/js/',
					ext: '.min.js'
				}]
			}
		},

		// Compile all .scss files.
		sass: {
			dist: {
				options: {
					require: 'susy',
					sourcemap: 'none',
					includePaths: require( 'node-bourbon' ).includePaths
				},
				files: [{
					'style.css': 'style.scss',
					'inc/admin/css/welcome.css': 'inc/admin/css/welcome.scss',
					'inc/woocommerce/css/bookings.css': 'inc/woocommerce/css/bookings.scss',
					'inc/woocommerce/css/brands.css': 'inc/woocommerce/css/brands.scss',
					'inc/woocommerce/css/wishlists.css': 'inc/woocommerce/css/wishlists.scss',
					'inc/woocommerce/css/ajax-layered-nav.css': 'inc/woocommerce/css/ajax-layered-nav.scss',
					'inc/woocommerce/css/variation-swatches.css': 'inc/woocommerce/css/variation-swatches.scss',
					'inc/woocommerce/css/composite-products.css': 'inc/woocommerce/css/composite-products.scss',
					'inc/woocommerce/css/photography.css': 'inc/woocommerce/css/photography.scss',
					'inc/woocommerce/css/product-reviews-pro.css': 'inc/woocommerce/css/product-reviews-pro.scss',
					'inc/woocommerce/css/smart-coupons.css': 'inc/woocommerce/css/smart-coupons.scss',
					'inc/woocommerce/css/deposits.css': 'inc/woocommerce/css/deposits.scss',
					'inc/woocommerce/css/bundles.css': 'inc/woocommerce/css/bundles.scss',
					'inc/woocommerce/css/woocommerce.css': 'inc/woocommerce/css/woocommerce.scss'
				}]
			}
		},

		// Minify all .css files.
		cssmin: {
			minify: {
				expand: true,
				cwd: 'inc/woocommerce/css/',
				src: ['*.css'],
				dest: 'inc/woocommerce/css/',
				ext: '.css'
			}
		},

		// Watch changes for assets.
		watch: {
			css: {
				files: [
					'style.scss',
					'inc/admin/css/*.scss',
					'inc/woocommerce/css/*.scss',
					'sass/base/*.scss',
					'sass/components/*.scss',
					'sass/layout/*.scss',
					'sass/utils/*.scss',
					'sass/vendors/*.scss'
				],
				tasks: [
					'sass',
					'css'
				]
			},
			js: {
				files: [
					// main js
					'js/*js',
					'!js/*.min.js',

					// customizer js
					'inc/customizer/js/*js',
					'!inc/customizer/js/*.min.js'
				],
				tasks: ['uglify']
			}
		},

		// Generate POT files.
		makepot: {
			options: {
				type: 'wp-theme',
				domainPath: 'languages',
				potHeaders: {
					'report-msgid-bugs-to': 'https://github.com/woothemes/storefront/issues',
					'language-team': 'LANGUAGE <EMAIL@ADDRESS>'
				}
			},
			frontend: {
				options: {
					potFilename: 'storefront.pot',
					exclude: [
						'storefront/.*' // Exclude deploy directory
					],
					processPot: function ( pot ) {
						pot.headers['project-id-version'];
						return pot;
					}
				}
			}
		},

		// Check textdomain errors.
		checktextdomain: {
			options:{
				text_domain: 'storefront',
				keywords: [
					'__:1,2d',
					'_e:1,2d',
					'_x:1,2c,3d',
					'esc_html__:1,2d',
					'esc_html_e:1,2d',
					'esc_html_x:1,2c,3d',
					'esc_attr__:1,2d',
					'esc_attr_e:1,2d',
					'esc_attr_x:1,2c,3d',
					'_ex:1,2c,3d',
					'_n:1,2,4d',
					'_nx:1,2,4c,5d',
					'_n_noop:1,2,3d',
					'_nx_noop:1,2,3c,4d'
				]
			},
			files: {
				src:  [
					'**/*.php', // Include all files
					'!node_modules/**' // Exclude node_modules/
				],
				expand: true
			}
		},

		// Creates deploy-able theme
		copy: {
			deploy: {
				src: [
					'**',
					'!.*',
					'!.*/**',
					'.htaccess',
					'!Gruntfile.js',
					'!package.json',
					'!node_modules/**',
					'!.DS_Store',
					'!npm-debug.log'
				],
				dest: 'storefront',
				expand: true,
				dot: true
			}
		},

		// Shell actions for transifex client
		shell: {
			options: {
				stdout: true,
				stderr: true
			},
			txpush: {
				command: 'tx push -s' // push the resources
			},
			txpull: {
				command: 'tx pull -a -f' // pull the .po files
			}
		},

		// Convert .po to .mo
		potomo: {
			options: {
				poDel: false
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'languages/',
					src: [
						'*.po'
					],
					dest: 'languages/',
					ext: '.mo',
					nonull: true
				}]
			}
		},

		// RTLCSS
		rtlcss: {
			options: {
				config: {
					swapLeftRightInUrl: false,
					swapLtrRtlInUrl: false,
					autoRename: false,
					preserveDirectives: true
				},
				properties : [
					{
						name: 'swap-fontawesome-left-right-angles',
						expr: /content/im,
						action: function( prop, value ) {
							if ( value === '"\\f105"' ) { // fontawesome-angle-left
								value = '"\\f104"';
							}
							if ( value === '"\\f178"' ) { // fontawesome-long-arrow-right
								value = '"\\f177"';
							}
							return { prop: prop, value: value };
						}
					}
				]
			},
			main: {
				expand: true,
				ext: '-rtl.css',
				src: [
					'style.css',
					'inc/woocommerce/css/bookings.css',
					'inc/woocommerce/css/brands.css',
					'inc/woocommerce/css/wishlists.css',
					'inc/woocommerce/css/ajax-layered-nav.css',
					'inc/woocommerce/css/variation-swatches.css',
					'inc/woocommerce/css/composite-products.css',
					'inc/woocommerce/css/photography.css',
					'inc/woocommerce/css/product-reviews-pro.css',
					'inc/woocommerce/css/smart-coupons.css',
					'inc/woocommerce/css/deposits.css',
					'inc/woocommerce/css/bundles.css',
					'inc/woocommerce/css/woocommerce.css'
				]
			}
		}
	});

	// Load NPM tasks to be used here
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-checktextdomain' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-shell' );
	grunt.loadNpmTasks( 'grunt-potomo' );
	grunt.loadNpmTasks( 'grunt-rtlcss' );

	// Register tasks
	grunt.registerTask( 'default', [
		'css',
		'uglify'
	]);

	grunt.registerTask( 'css', [
		'sass',
		'cssmin',
		'rtlcss'
	]);

	grunt.registerTask( 'tx_update', [
		'makepot',
		'shell:txpush'
	]);

	grunt.registerTask( 'dev', [
		'default',
		'tx_update',
		'rtlcss'
	]);

	grunt.registerTask( 'mo', [
		'shell:txpull',
		'potomo'
	]);

	grunt.registerTask( 'deploy', [
		'mo',
		'copy'
	]);
};

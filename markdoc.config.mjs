import { component, defineMarkdocConfig, nodes } from '@astrojs/markdoc/config'

export default defineMarkdocConfig({
	variables: {
		environment: process.env.IS_PROD ? 'prod' : 'dev',
	},
	extends: [],
	nodes: {
		...nodes,
		document: {
			render: null,
		},
		fence: {
			render: component('./src/components/fence/index.astro'),
			attributes: {
				// Map Markdoc's default attributes
				content: { type: String, required: true },
				language: { type: String, required: false, default: 'txt' },
				// Define custom attributes to support Expressive Code features
				title: { type: String, required: false },
				frame: {
					type: String,
					matches: ['auto', 'none', 'code', 'terminal'],
					default: 'auto',
					required: false,
				},
				// The 'meta' attribute is essential for text markers
				meta: { type: String, required: false },
				showLineNumbers: { type: Boolean, required: false, default: false },
			},
		},
	},
	tags: {
		'post-intro': {
			render: component('./src/components/post-intro/index.astro'),
			attributes: {
				class: {
					type: String,
					required: false,
				},
			},
			children: [nodes.paragraph, nodes.blockquote, nodes.inline],
		},
		fence: {
			render: component('./src/components/fence/index.astro'),
			attributes: {
				// Map Markdoc's default attributes
				content: { type: String, required: true },
				language: { type: String, required: false, default: 'txt' },
				// Define custom attributes to support Expressive Code features
				title: { type: String, required: false },
				frame: {
					type: String,
					matches: ['auto', 'none', 'code', 'terminal'],
					default: 'auto',
					required: false,
				},
				// The 'meta' attribute is essential for text markers
				meta: { type: String, required: false },
				showLineNumbers: { type: Boolean, required: false },
			},
		},
	},
	functions: {},
	partials: {},
	validation: {},
	ctx: {},
})

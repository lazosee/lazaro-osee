import { DarkBarnd, LightBarnd } from '@cms/brand'
import { collection, config, fields } from '@keystatic/core'
import { block, wrapper } from '@keystatic/core/content-components'

export default config({
	storage: {
		kind: 'local',
	},
	ui: {
		brand: {
			name: 'lazaroosee.xyz',
			mark({ colorScheme: cs }) {
				return cs === 'dark' ? DarkBarnd() : LightBarnd()
			},
		},
	},
	collections: {
		authors: collection({
			label: 'Authors',
			slugField: 'name',
			path: 'src/content/authors/*',
			format: { data: 'yaml' },
			schema: {
				name: fields.slug({
					name: { label: "Author's Name", description: 'Full name of the author' },
					slug: { label: "Author's slug", description: 'A URL friendly author ID' },
				}),
				image: fields.image({
					label: 'Profile Image',
					directory: 'src/assets/images/authors',
					publicPath: '../../../assets/images/authors',
					description: 'Cover image for the blog posts',
				}),
				posts: fields.array(
					fields.relationship({
						label: 'Post',
						collection: 'posts',
					}),
					{ label: "Author's Posts", itemLabel: ({ value }) => value ?? 'Select' }
				),
				socials: fields.array(
					fields.object({
						label: fields.text({ label: 'Social Account' }),
						href: fields.url({
							label: 'Account URL',
							description: 'URL of the Social account',
						}),
						icon: fields.text({ label: 'Social Icon name' }),
					}),
					{ label: 'Socials', itemLabel: ({ fields }) => fields.label.value ?? 'Social' }
				),
			},
		}),
		posts: collection({
			label: 'Posts',
			slugField: 'title',
			path: 'src/content/posts/*/',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({
					name: {
						label: 'Title',
						description: 'Main subject heading of the post',
						validation: { isRequired: true, length: { min: 10, max: 200 } },
					},
					slug: {
						validation: { length: { min: 8, max: 256 } },
						label: 'Post Slug',
						description: 'A URL friendly pathname for the post',
					},
				}),
				excerpt: fields.text({
					label: 'Excerpt',
					multiline: true,
					description: 'A short summary of the post',
					validation: { length: { min: 64, max: 256 }, isRequired: true },
				}),
				cover: fields.image({
					label: 'Cover Image',
					directory: 'src/assets/images/posts',
					publicPath: '../../../assets/images/posts/',
					description: 'Cover image for the blog posts',
					validation: { isRequired: true },
				}),
				pubDate: fields.datetime({
					label: 'Published Date',
					defaultValue: { kind: 'now' },
					description: 'Date of publication of the post',
				}),
				isDraft: fields.checkbox({
					label: 'Is Draft',
					defaultValue: true,
					description: 'Whether the post is still in draft mode',
				}),
				authors: fields.array(
					fields.relationship({
						label: 'Author',
						collection: 'authors',
						description: 'People who wrote this post',
						validation: { isRequired: true },
					}),
					{
						label: 'Post Authors',
						itemLabel: ({ value }) => value ?? 'Author',
						validation: { length: { min: 1, max: 64 } },
					}
				),
				content: fields.markdoc({
					label: 'Content',
					description: 'The Markdoc post body',
					options: {
						image: {
							directory: 'src/assets/images/posts',
							publicPath: '../../../assets/images/posts/',
						},
					},
					components: {
						'post-intro': wrapper({
							label: 'Fancy Intro',
							description: 'A fancy introductory paragraph on top of every blog post',
							ContentView(props) {
								return props.children
							},
							schema: {
								class: fields.text({
									label: 'Tailwind and custom class names for the component',
									defaultValue: '',
									multiline: true,
								}),
							},
						}),
						fence: block({
							label: 'Code Block',
							schema: {
								title: fields.text({ label: 'Filename' }),
								language: fields.text({
									label: 'Language',
									description: 'The programming language of this block',
								}),
								showLineNumbers: fields.checkbox({
									label: 'Show Line Numbers',
									defaultValue: true,
									description: 'Whether or not to show line numbers',
								}),
								meta: fields.text({
									label: 'Expressive Code Meta',
									description: 'e.g ins={1-3} to mark as inserted code',
								}),
								frame: fields.select({
									label: 'Frame',
									description: 'The Expressive Code frame to use for this code',
									defaultValue: 'auto',
									options: [
										{ label: 'Code', value: 'code' },
										{ label: 'None', value: 'none' },
										{ label: 'Terminal', value: 'terminal' },
										{ label: 'Auto', value: 'auto' },
									],
								}),
								content: fields.text({
									label: 'Code Text',
									defaultValue: '\n',
									description: 'The actual code of this fence block',
									multiline: true,
									validation: { isRequired: true, length: { min: 4 } },
								}),
							},
							ContentView(props) {
								return props.value.content
							},
						}),
					},
				}),
			},
		}),
	},
})

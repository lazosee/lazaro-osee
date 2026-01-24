import type { PropsWithChildren } from 'react'

/**
 * content: string;
  language?: string;
  title?: string;
  frame?: "code" | "none" | "terminal" | "auto";
 */
export function Fence({
	children,
	frame,
	language,
	title,
}: PropsWithChildren<{
	language?: string
	title?: string
	frame?: 'code' | 'none' | 'terminal' | 'auto'
}>) {
	return `\`\`\`${language ?? 'txt'} ${title ? 'title=${title}' : ''} ${frame ? 'frame=${frame}' : ''} \n${children}\`\`\``
}

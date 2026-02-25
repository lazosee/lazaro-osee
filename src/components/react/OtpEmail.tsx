import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components'

interface OtpEmailProps {
	otp: string
	email: string
}

export const OtpEmail = ({ email, otp }: OtpEmailProps) => (
	<Html>
		<Head />
		<Preview>Your Lazaro Osee login code</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={logoSection}>
					<Text style={logoText}>LO</Text>
				</Section>
				<Heading style={h1}>Login to lazaroosee.xyz</Heading>
				<Text style={text}>Hello,</Text>
				<Text style={text}>
					Someone (hopefully you!) requested a login code for your dashboard. Use the verification
					code below to sign in. This code is valid for 5 minutes.
				</Text>
				<Section style={codeContainer}>
					<Text style={code}>{otp}</Text>
				</Section>
				<Text style={text}>If you didn't request this, you can safely ignore this email.</Text>
				<Hr style={hr} />
				<Link href="https://lazaroosee.xyz" style={footerLink}>
					lazaroosee.xyz
				</Link>
				<Text style={footer}>Nairobi, Kenya • Architecture & Software</Text>
			</Container>
		</Body>
	</Html>
)

export default OtpEmail

// --- Styles ---
const main = {
	backgroundColor: '#f6f9fc',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
	backgroundColor: '#ffffff',
	margin: '0 auto',
	padding: '40px 20px',
	marginTop: '40px',
	marginBottom: '40px',
	borderRadius: '8px',
	border: '1px solid #e6ebf1',
}

const logoSection = {
	display: 'flex',
	justifyContent: 'center',
}

const logoText = {
	fontSize: '24px',
	fontWeight: 'bold',
	color: '#1a1a1a',
	border: '2px solid #1a1a1a',
	padding: '4px 8px',
}

const h1 = {
	color: '#1a1a1a',
	fontSize: '24px',
	fontWeight: '600',
	textAlign: 'center' as const,
	margin: '30px 0',
}

const text = {
	color: '#4a4a4a',
	fontSize: '16px',
	lineHeight: '24px',
	textAlign: 'left' as const,
}

const codeContainer = {
	background: 'rgba(0,0,0,0.05)',
	borderRadius: '4px',
	margin: '24px auto',
	width: '280px',
	padding: '16px',
}

const code = {
	color: '#000',
	display: 'inline-block',
	fontSize: '32px',
	fontWeight: '700',
	letterSpacing: '6px',
	lineHeight: '40px',
	paddingBottom: '8px',
	paddingTop: '8px',
	margin: '0 auto',
	width: '100%',
	textAlign: 'center' as const,
}

const hr = {
	borderColor: '#e6ebf1',
	margin: '20px 0',
}

const footer = {
	color: '#8898aa',
	fontSize: '12px',
	lineHeight: '16px',
	textAlign: 'center' as const,
	marginTop: '12px',
}

const footerLink = {
	color: '#8898aa',
	fontSize: '12px',
	textAlign: 'center' as const,
	display: 'block',
	textDecoration: 'underline',
}

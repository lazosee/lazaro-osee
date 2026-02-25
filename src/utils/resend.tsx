import OtpEmail from '@/components/react/OtpEmail'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export async function sendOtpEmailDirectly(email: string, otp: string) {
	return resend.emails.send({
		from: 'lazaroosee.xyz <auth@lazaroosee.xyz>',
		to: [email],
		subject: `Your Login Code: ${otp}`,
		text: `Your OTP for lazaroosee.xyz is ${otp}`,
		replyTo: 'Lazaro Osee <me@lazaroosee.xyz>',
		react: <OtpEmail otp={otp} email={email} />,
	})
}

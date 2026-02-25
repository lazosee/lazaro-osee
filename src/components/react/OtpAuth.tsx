// src/components/OtpAuth.tsx
import { useEffect, useState } from 'react'

export default function OtpAuth({ email }: { email: string }) {
	const [code, setCode] = useState('')
	const [cooldown, setCooldown] = useState(0)
	const [message, setMessage] = useState('')

	// Handle the countdown timer
	useEffect(() => {
		if (cooldown > 0) {
			const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
			return () => clearTimeout(timer)
		}
	}, [cooldown])

	const handleRequestOtp = async () => {
		setMessage('Sending code...')
		const res = await fetch('/api/auth/otp-request', {
			method: 'POST',
			body: JSON.stringify({ email }),
		})

		if (res.ok) {
			setCooldown(60) // Start 60s cooldown
			setMessage('Code sent to your email!')
		} else {
			const error = await res.json()
			setMessage(error.error || 'Failed to send code.')
		}
	}

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault()
		const res = await fetch('/api/auth/otp-verify', {
			method: 'POST',
			body: JSON.stringify({ email, code: code.trim() }),
		})

		if (res.ok) {
			window.location.href = '/admin' // Redirect on success
		} else {
			setMessage('Invalid or expired code.')
		}
	}

	const styles = {
		container: {
			maxWidth: '28rem',
			padding: '1.5rem',
			backgroundColor: '#ffffff',
			borderRadius: '0.5rem',
			boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		},
		title: {
			fontSize: '1.25rem',
			fontWeight: '700',
			marginBottom: '1rem',
		},
		description: {
			marginBottom: '1rem',
			fontSize: '0.875rem',
			color: '#4b5563',
		},
		input: {
			width: '100%',
			padding: '0.75rem',
			textAlign: 'center' as const,
			fontSize: '1.5rem',
			letterSpacing: '0.1em',
			border: '1px solid #d1d5db',
			borderRadius: '0.25rem',
			marginBottom: '1rem',
		},
		button: {
			width: '100%',
			backgroundColor: '#2563eb',
			color: '#ffffff',
			padding: '0.75rem',
			borderRadius: '0.25rem',
			fontWeight: '700',
			cursor: 'pointer',
			border: 'none',
		},
		resendContainer: {
			marginTop: '1rem',
			textAlign: 'center' as const,
		},
		resendButton: (disabled: boolean) => ({
			fontSize: '0.875rem',
			background: 'none',
			border: 'none',
			cursor: disabled ? 'not-allowed' : 'pointer',
			color: disabled ? '#9ca3af' : '#2563eb',
			textDecoration: disabled ? 'none' : 'underline',
		}),
		message: {
			marginTop: '1rem',
			fontSize: '0.875rem',
			color: '#ef4444',
		},
	}

	return (
		<div style={styles.container}>
			<h2 style={styles.title}>Verify your Email</h2>
			<p style={styles.description}>
				Enter the 6-digit code sent to <strong>{email}</strong>
			</p>

			<form onSubmit={handleVerify}>
				<input
					type="text"
					maxLength={6}
					value={code}
					onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
					style={styles.input}
					placeholder="000000"
					required
				/>

				<button type="submit" style={styles.button}>
					Verify & Login
				</button>
			</form>

			<div style={styles.resendContainer}>
				<button
					onClick={handleRequestOtp}
					disabled={cooldown > 0}
					style={styles.resendButton(cooldown > 0)}
				>
					{cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get a code? Resend"}
				</button>
			</div>

			{message && <p style={styles.message}>{message}</p>}
		</div>
	)
}

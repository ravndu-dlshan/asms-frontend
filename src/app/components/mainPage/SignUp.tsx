"use client";

import { FormEvent, useState } from "react";
import { registerUser,sendOtp} from "@/app/services/UserRegisterAndLoginServices";
// Using App Router navigation
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

type Props = {
	onBackToLogin?: () => void;
};

export default function SignUp({ onBackToLogin }: Props) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [dob, setDob] = useState("");
	const [gender, setGender] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState("");
	const [message, setMessage] = useState<string | null>(null);


	// OTP dialog state
	const [otpOpen, setOtpOpen] = useState(false);
	const [otpCode, setOtpCode] = useState("");
	const [otpError, setOtpError] = useState<string | null>(null);
	const [activated, setActivated] = useState(false);
	const router = useRouter(); //use the router to push the app to LogIn after registered

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!firstName || !lastName || !email || !dob || !gender || !role || !password || !confirmPassword) {
			setMessage("Please fill in all fields.");
			return;
		}
		if (password !== confirmPassword) {
			setMessage("Passwords do not match.");
			return;
		}
		setMessage("Registering…");

		const userData={
			email,
			firstName: firstName,
			lastName: lastName,
			password,
			role: role
		};
			try{
				console.log(userData);
				const result = await registerUser(userData);
			if (result.success) {
				setMessage("Registration successful! Please verify via OTP.");
				setOtpOpen(true);
			} else {
				setMessage("Registration failed. Please try again.");
			}
			}catch(error){
				setMessage("An error occurred. Please try again.");
			}
	};

	const handleActivate = async () => {
		const code = otpCode.trim();
		if (code.length !== 6) {
			setOtpError("OTP must be 6 characters.");
			return;
		}
		setOtpError(null);
		try {
			const result = await sendOtp(code); 
			if (result.success) {
				setActivated(true);

				// Show success for 2 seconds before redirecting to the Login view
				setMessage("Account activated! Redirecting to Login page...");
				setTimeout(() => {
					setOtpOpen(false);
					if (onBackToLogin) {
						onBackToLogin(); // switch to Login view in parent component
					} else {
						// Fallback: navigate to root route which renders the Login entry
						router.replace("/");
						router.refresh();
					}
				}, 2000);
			} else {
				setOtpError("Invalid OTP. Please try again.");
			}
		} catch (error) {
			console.log(error);
			setOtpError("Verification failed. Please try again.");
		}
	};

	return (
		<div className="w-full max-w-2xl relative z-10">
			<div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
				{/* Logo/Brand */}
				<div className="flex items-center justify-center mb-6">
					<div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
						<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-white">
						Car<span className="text-orange-500">vo</span>
					</h2>
				</div>
				
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-200">Create your account</h3>
					{onBackToLogin && (
						<button
							onClick={onBackToLogin}
							className="text-sm text-orange-400 hover:text-orange-300 transition-colors duration-200"
						>
							Back to Login
						</button>
					)}
				</div>
				<p className="text-sm text-gray-400 mb-6">
					You can add vehicles after the registration.
				</p>

				<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{message && (
						<div className={`md:col-span-2 rounded-lg px-4 py-3 text-sm border ${
							message.includes('successful') || message.includes('activated')
								? 'bg-green-900/50 text-green-400 border-green-800' 
								: message.includes('error') || message.includes('failed')
								? 'bg-red-900/50 text-red-400 border-red-800'
								: 'bg-blue-900/50 text-blue-400 border-blue-800'
						}`}>
							{message}
						</div>
					)}
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="firstName">First Name</label>
						<input
							id="firstName"
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="John"
							className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="lastName">Last Name</label>
						<input
							id="lastName"
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder="Doe"
							className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
						/>
					</div>
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="john.doe@example.com"
							className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">Role</label>
						<select
							id="role"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
						>
							<option value="">Select Role</option>
							<option value="Customer">Customer</option>
							<option value="Admin">Admin</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="dob">Date of Birth</label>
						<input
							id="dob"
							type="date"
							value={dob}
							onChange={(e) => setDob(e.target.value)}
							className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="gender">Gender</label>
						<select
							id="gender"
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
						>
							<option value="">Select Gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••••••"
							className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirmPassword">Confirm Password</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••••••"
							className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
						/>
					</div>

					<div className="md:col-span-2 mt-4">
						<button
							type="submit"
							className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-4 py-3 shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-800"
						>
							Create Account
						</button>
					</div>
				</form>
			</div>

			{/* OTP Verification Dialog */}
			<Dialog
				open={otpOpen}
				onClose={() => {
					setOtpOpen(false);
				}}
				aria-labelledby="otp-dialog-title"
				aria-describedby="otp-dialog-description"
				PaperProps={{
					sx: {
						backgroundColor: 'rgba(31, 41, 55, 0.95)',
						backdropFilter: 'blur(12px)',
						border: '1px solid rgba(107, 114, 128, 0.3)',
						borderRadius: '16px',
						boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
						color: 'white',
						minWidth: '400px'
					}
				}}
			>
				<DialogTitle 
					id="otp-dialog-title" 
					sx={{ 
						fontWeight: 600, 
						fontSize: '1.25rem',
						color: '#f9fafb',
						textAlign: 'center',
						paddingBottom: '8px'
					}}
				>
					{/* Logo/Brand for dialog */}
					<div className="flex items-center justify-center mb-4">
						<div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
							<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
							</svg>
						</div>
						<span className="text-xl font-bold text-white">
							Car<span className="text-orange-500">vo</span>
						</span>
					</div>
					Account Verification
				</DialogTitle>
				<DialogContent sx={{ paddingX: '24px', paddingY: '16px' }}>
					<DialogContentText 
						id="otp-dialog-description" 
						sx={{ 
							color: '#9ca3af', 
							marginBottom: '24px',
							textAlign: 'center',
							lineHeight: 1.6
						}}
					>
						Enter the 6-digit OTP code sent to your email{' '}
						<span style={{ fontWeight: 600, color: '#f59e0b' }}>
							({email || "your email"})
						</span>{' '}
						to activate your account.
					</DialogContentText>
					<TextField
						label="OTP Code"
						fullWidth
						value={otpCode}
						onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
						placeholder="123456"
						inputProps={{ 
							maxLength: 6,
							inputMode: "numeric",
							style: { 
								fontSize: '1.125rem',
								letterSpacing: '0.1em',
								textAlign: 'center',
								fontWeight: 500
							}
						}}
						error={!!otpError}
						helperText={otpError || ""}
						disabled={activated}
						sx={{
							'& .MuiOutlinedInput-root': {
								backgroundColor: 'rgba(55, 65, 81, 0.5)',
								borderRadius: '12px',
								'& fieldset': {
									borderColor: 'rgba(107, 114, 128, 0.6)',
								},
								'&:hover fieldset': {
									borderColor: '#f97316',
								},
								'&.Mui-focused fieldset': {
									borderColor: '#f97316',
									boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)',
								},
								'&.Mui-error fieldset': {
									borderColor: '#ef4444',
								}
							},
							'& .MuiInputBase-input': {
								color: '#f3f4f6',
								'&::placeholder': {
									color: '#6b7280',
									opacity: 1,
								},
							},
							'& .MuiInputLabel-root': {
								color: '#9ca3af',
								'&.Mui-focused': {
									color: '#f97316',
								},
								'&.Mui-error': {
									color: '#ef4444',
								}
							},
							'& .MuiFormHelperText-root': {
								color: '#ef4444',
								'&.Mui-error': {
									color: '#ef4444',
								}
							}
						}}
					/>
					{activated && (
						<div className="mt-4 p-3 rounded-lg bg-green-900/30 border border-green-800/50">
							<p className="text-sm text-green-400 font-medium text-center">
								✓ Account activated! Redirecting to login...
							</p>
						</div>
					)}
				</DialogContent>
				<DialogActions sx={{ padding: '16px 24px 24px' }}>
					<Button
						variant="outlined"
						onClick={() => setOtpOpen(false)}
						sx={{
							borderColor: 'rgba(107, 114, 128, 0.6)',
							color: '#9ca3af',
							borderRadius: '8px',
							'&:hover': {
								borderColor: '#6b7280',
								backgroundColor: 'rgba(107, 114, 128, 0.1)',
							}
						}}
					>
						Close
					</Button>
					<Button
						variant="contained"
						onClick={handleActivate}
						disabled={activated}
						sx={{
							background: 'linear-gradient(to right, #f97316, #ea580c)',
							borderRadius: '8px',
							fontWeight: 600,
							textTransform: 'none',
							paddingX: '24px',
							'&:hover': {
								background: 'linear-gradient(to right, #ea580c, #dc2626)',
								transform: 'scale(1.02)',
							},
							'&.Mui-disabled': {
								background: 'rgba(107, 114, 128, 0.3)',
								color: 'rgba(156, 163, 175, 0.5)',
							},
							transition: 'all 0.2s ease-in-out',
						}}
					>
						{activated ? "Activated" : "Activate My Account"}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}


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
	const [message, setMessage] = useState<string | null>(null);
	// OTP dialog state
	const [otpOpen, setOtpOpen] = useState(false);
	const [otpCode, setOtpCode] = useState("");
	const [otpError, setOtpError] = useState<string | null>(null);
	const [activated, setActivated] = useState(false);
	const router = useRouter(); //use the router to push the app to LogIn after registered

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!firstName || !lastName || !email || !dob || !gender || !password || !confirmPassword) {
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
			firstname: firstName,
			lastname: lastName,
			password,
			role: "Customer"
		};
			try{
				const result = await registerUser(userData);
			if (result.success) {
				setMessage("Registration successful! Please verify via OTP.");
				// Open OTP dialog instead of navigating back immediately
				setOtpOpen(true);
			} else {
				setMessage("Registration failed. Please try again.");
			}
			}catch(error){
				window.alert("Registration failed. Please try again.");
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
			const result = await sendOtp(code); // treat sendOtp as verify (rename later if needed)
			if (result.success) {
				setActivated(true);
				setMessage("Account activated! Redirecting to login...");
				setTimeout(() => {
					setOtpOpen(false);
					router.push("/"); // root renders Login component
				}, 1000);
			} else {
				setOtpError("Invalid OTP. Please try again.");
			}
		} catch (error) {
			setOtpError("Verification failed. Please try again.");
		}
	};

	return (
		<div className="w-full max-w-2xl">
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-gray-900">Create your account</h2>
					{onBackToLogin && (
						<button
							onClick={onBackToLogin}
							className="text-sm text-blue-700 hover:underline"
						>
							Back to Login
						</button>
					)}
				</div>
				<p className="mt-2 text-sm text-gray-600">
					You can add vehicles after the registration.
				</p>

				<form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
					{message && (
						<div className="md:col-span-2 rounded-md bg-blue-50 text-blue-800 text-sm px-3 py-2 border border-blue-100">
							{message}
						</div>
					)}
					<div>
						<label className="block text-sm font-medium text-gray-700" htmlFor="firstName">First Name</label>
						<input
							id="firstName"
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="John"
							className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700" htmlFor="lastName">Last Name</label>
						<input
							id="lastName"
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder="Doe"
							className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
					</div>
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="john.doe@example.com"
							className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700" htmlFor="dob">Date of Birth</label>
						<input
							id="dob"
							type="date"
							value={dob}
							onChange={(e) => setDob(e.target.value)}
							className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700" htmlFor="gender">Gender</label>
						<select
							id="gender"
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						>
							<option value="">Select…</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••"
							className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
					</div>

					<div className="md:col-span-2 mt-2">
						<button
							type="submit"
							className="w-full rounded-lg bg-blue-600 text-white font-medium px-4 py-2.5 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
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
					// Prevent closing if not activated yet; allow only if activated or user has not started typing
					if (!activated) return;
					setOtpOpen(false);
				}}
				aria-labelledby="otp-dialog-title"
				aria-describedby="otp-dialog-description"
			>
				<DialogTitle id="otp-dialog-title" className="font-semibold">
					Account Verification
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="otp-dialog-description" className="mb-4">
						Enter the 6-digit OTP code sent to your email (<span className="font-medium">{email || "your email"}</span>) to activate your account.
					</DialogContentText>
					<TextField
						label="OTP Code"
						fullWidth
						value={otpCode}
						onChange={(e) => setOtpCode(e.target.value)}
						placeholder="123456"
						inputProps={{ maxLength: 6 }}
						error={!!otpError}
						helperText={otpError || ""}
						disabled={activated}
					/>
					{activated && (
						<p className="mt-3 text-sm text-green-600 font-medium">Account activated! Redirecting…</p>
					)}
				</DialogContent>
				<DialogActions className="px-6 pb-4">
					<Button
						variant="outlined"
						onClick={() => {
							if (activated) setOtpOpen(false);
						}}
						disabled={!activated}
					>
						Close
					</Button>
					<Button
						variant="contained"
						onClick={handleActivate}
						disabled={activated}
					>
						Activate My Account
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}


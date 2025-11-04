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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import ErrorPopUp from "@/app/components/ErrorPopuUp";
import { Eye, EyeOff } from "lucide-react";

type Props = {
	onBackToLogin?: () => void;
};

export default function SignUp({ onBackToLogin }: Props) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [dob, setDob] = useState<Dayjs | null>(null);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState("");
	const [message, setMessage] = useState<string | null>(null);
	const [errorPopup, setErrorPopup] = useState({ open: false, message: "", type: "error" as "error" | "success" | "warning" | "info" });
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);


	// OTP dialog state
	const [otpOpen, setOtpOpen] = useState(false);
	const [otpCode, setOtpCode] = useState("");
	const [otpError, setOtpError] = useState<string | null>(null);
	const [activated, setActivated] = useState(false);
	const router = useRouter(); //use the router to push the app to LogIn after registered

	// Input sanitization helper
	const sanitizeInput = (input: string): string => {
		// Remove potential SQL injection characters and XSS attempts
		return input
			.replace(/[<>]/g, '') // Remove angle brackets (XSS)
			.replace(/['";]/g, '') // Remove quotes and semicolons (SQL)
			.replace(/--|\/\*|\*\//g, '') // Remove SQL comment syntax
			.trim();
	};

	// Email validation - More strict
	const isValidEmail = (email: string): boolean => {
		// RFC 5322 compliant email regex
		const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		return emailRegex.test(email) && email.length <= 254;
	};

	// Phone number validation - Must be +94XXXXXXXXX format
	const isValidPhoneNumber = (phone: string): boolean => {
		// Must start with +94 followed by exactly 9 digits (no spaces)
		const phoneRegex = /^\+94\d{9}$/;
		return phoneRegex.test(phone);
	};

	// Password strength validation
	const isStrongPassword = (password: string): boolean => {
		// At least 8 characters, 1 uppercase, 1 lowercase, 1 number
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
		return passwordRegex.test(password);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		
		// Sanitize inputs
		const sanitizedFirstName = sanitizeInput(firstName);
		const sanitizedLastName = sanitizeInput(lastName);
		const sanitizedEmail = email.toLowerCase().trim();
		const sanitizedAddress = role === "Customer" ? sanitizeInput(address) : "";
		
		// Email validation
		if (!isValidEmail(sanitizedEmail)) {
			setErrorPopup({ 
				open: true, 
				message: "Please enter a valid email address (e.g., user@example.com).", 
				type: "warning" 
			});
			return;
		}

		// Phone number validation (only for customers)
		if (role === "Customer" && !isValidPhoneNumber(phoneNumber)) {
			setErrorPopup({ 
				open: true, 
				message: "Please enter a valid phone number in format +94XXXXXXXXX (e.g., +94771234567).", 
				type: "warning" 
			});
			return;
		}

		// Password strength validation
		if (!isStrongPassword(password)) {
			setErrorPopup({ 
				open: true, 
				message: "Password must be at least 8 characters with uppercase, lowercase, and number.", 
				type: "warning" 
			});
			return;
		}
		
		// Different validation for Customer vs Admin/Employee
		if (role === "Customer") {
			if (!sanitizedFirstName || !sanitizedLastName || !sanitizedEmail || !sanitizedAddress || !dob || !phoneNumber || !role || !password || !confirmPassword) {
				setErrorPopup({ open: true, message: "Please fill in all fields.", type: "warning" });
				return;
			}
		} else {
			// Admin/Employee don't need address, dob, phone
			if (!sanitizedFirstName || !sanitizedLastName || !sanitizedEmail || !role || !password || !confirmPassword) {
				setErrorPopup({ open: true, message: "Please fill in all fields.", type: "warning" });
				return;
			}
		}
		
		if (password !== confirmPassword) {
			setErrorPopup({ open: true, message: "Passwords do not match.", type: "warning" });
			return;
		}
		setMessage("Registering…");

		const userData={
			email: sanitizedEmail,
			firstName: sanitizedFirstName,
			lastName: sanitizedLastName,
			...(role === "Customer" && { 
				address: sanitizedAddress,
				phoneNumber: phoneNumber,
				dateOfBirth: dob?.format('YYYY-MM-DD')
			}), // Only include for customers
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
				setErrorPopup({ open: true, message: "Registration failed. Please try again.", type: "error" });
				setMessage(null);
			}
			}catch(error: any){
				setErrorPopup({ open: true, message: error.message || "An error occurred. Please try again.", type: "error" });
				setMessage(null);
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
		} catch (error: any) {
			setOtpError(error.message || "Verification failed. Please try again.");
		}
	};

	return (
		<div className="w-full max-w-2xl relative z-10">
			<div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 transition-all duration-500 ease-in-out">
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
				<p className="text-sm text-gray-400 mb-6 transition-all duration-300">
					{role === "Customer" 
						? "You can add vehicles after the registration."
						: role === "Admin"
						? "Create an admin account to manage the system."
						: "Please select your role to continue."}
				</p>

				<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300">
					{message && (
						<div className={`md:col-span-2 rounded-lg px-4 py-3 text-sm border transition-all duration-300 ${
							message.includes('successful') || message.includes('activated')
								? 'bg-green-900/50 text-green-400 border-green-800' 
								: message.includes('error') || message.includes('failed')
								? 'bg-red-900/50 text-red-400 border-red-800'
								: 'bg-blue-900/50 text-blue-400 border-blue-800'
						}`}>
							{message}
						</div>
					)}
					
					{/* Role Selection - First Field */}
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">
							Select Role <span className="text-orange-500">*</span>
						</label>
						<select
							id="role"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
						>
							<option value="">Choose your role...</option>
							<option value="Customer">Customer</option>
							<option value="Admin">Admin</option>
						</select>
					</div>

					{/* Show remaining fields only after role is selected */}
					{role && (
						<>
							<div className="animate-fadeIn">
								<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="firstName">First Name</label>
								<input
									id="firstName"
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder="Navoda"
									required
									minLength={2}
									maxLength={50}
									pattern="[A-Za-z\s]+"
									title="Only letters and spaces allowed"
									className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
								/>
							</div>
							<div className="animate-fadeIn" style={{ animationDelay: '50ms' }}>
								<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="lastName">Last Name</label>
								<input
									id="lastName"
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder="Chathurya"
									required
									minLength={2}
									maxLength={50}
									pattern="[A-Za-z\s]+"
									title="Only letters and spaces allowed"
									className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
								/>
							</div>
							<div className="md:col-span-2 animate-fadeIn" style={{ animationDelay: '100ms' }}>
								<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Carvocare@gmail.com"
									required
									maxLength={100}
									className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
								/>
							</div>

							{/* Customer-specific fields */}
							{role === "Customer" && (
								<>
									<div className="animate-fadeIn" style={{ animationDelay: '150ms' }}>
										<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="dob">
											Date of Birth <span className="text-orange-500">*</span>
										</label>
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker
												value={dob}
												onChange={(newValue) => setDob(newValue)}
												maxDate={dayjs().subtract(18, 'year')}
												minDate={dayjs('1950-01-01')}
												format="DD/MM/YYYY"
												views={['year', 'month', 'day']}
												openTo="year"
												slotProps={{
													textField: {
														fullWidth: true,
														placeholder: "Select your date of birth",
														required: role === "Customer",
														sx: {
															'& .MuiOutlinedInput-root': {
																borderRadius: '12px',
																backgroundColor: 'rgba(55, 65, 81, 0.5)',
																backdropFilter: 'blur(4px)',
																transition: 'all 0.2s',
																'& fieldset': {
																	borderColor: 'rgb(75, 85, 99)',
																	borderWidth: '1px',
																},
																'&:hover fieldset': {
																	borderColor: '#f97316',
																},
																'&.Mui-focused fieldset': {
																	borderColor: '#f97316',
																	borderWidth: '2px',
																},
																'&.Mui-focused': {
																	backgroundColor: 'rgb(55, 65, 81)',
																	boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.3)',
																},
																'& input': {
																	color: '#e5e7eb',
																	padding: '12px 16px',
																	'&::placeholder': {
																		color: 'rgb(107, 114, 128)',
																		opacity: 1,
																	},
																},
															},
															'& .MuiInputLabel-root': {
																display: 'none',
															},
															'& .MuiIconButton-root': {
																color: '#9ca3af',
																transition: 'color 0.2s',
																'&:hover': {
																	color: '#f97316',
																	backgroundColor: 'transparent',
																},
															},
															'& .MuiSvgIcon-root': {
																color: 'inherit',
															},
														},
													},
													popper: {
														sx: {
															'& .MuiPaper-root': {
																backgroundColor: 'rgba(31, 41, 55, 0.98)',
																backdropFilter: 'blur(12px)',
																border: '1px solid rgba(107, 114, 128, 0.3)',
																borderRadius: '12px',
																boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
																'& .MuiPickersDay-root': {
																	color: '#e5e7eb !important',
																	'&:hover': {
																		backgroundColor: 'rgba(249, 115, 22, 0.1)',
																		color: '#ffffff !important',
																	},
																	'&.Mui-selected': {
																		backgroundColor: '#f97316 !important',
																		color: '#ffffff !important',
																		fontWeight: 600,
																		'& > *': {
																			color: '#ffffff !important',
																		},
																		'&:hover': {
																			backgroundColor: '#ea580c !important',
																			color: '#ffffff !important',
																		},
																		'&:focus': {
																			backgroundColor: '#f97316 !important',
																			color: '#ffffff !important',
																		},
																	},
																	'&.Mui-disabled': {
																		color: '#6b7280 !important',
																	},
																},
																'& .MuiPickersCalendarHeader-root': {
																	color: '#f3f4f6 !important',
																	'& .MuiPickersCalendarHeader-label': {
																		color: '#f3f4f6 !important',
																		fontWeight: 500,
																	},
																	'& .MuiSvgIcon-root': {
																		color: '#f97316 !important',
																	},
																	'& .MuiIconButton-root': {
																		color: '#f97316 !important',
																	},
																},
																'& .MuiDayCalendar-weekDayLabel': {
																	color: '#9ca3af !important',
																	fontWeight: 500,
																},
																'& .MuiPickersYear-yearButton': {
																	color: '#e5e7eb !important',
																	fontSize: '0.95rem',
																	'&:hover': {
																		backgroundColor: 'rgba(249, 115, 22, 0.1)',
																		color: '#ffffff !important',
																	},
																	'&.Mui-selected': {
																		backgroundColor: '#f97316 !important',
																		color: '#ffffff !important',
																		fontWeight: 600,
																		'& > *': {
																			color: '#ffffff !important',
																		},
																		'&:hover': {
																			backgroundColor: '#ea580c !important',
																			color: '#ffffff !important',
																		},
																		'&:focus': {
																			backgroundColor: '#f97316 !important',
																			color: '#ffffff !important',
																		},
																	},
																	'&.Mui-disabled': {
																		color: '#6b7280 !important',
																	},
																},
																'& .MuiTypography-root': {
																	color: '#e5e7eb !important',
																},
																'& .MuiButtonBase-root': {
																	color: '#e5e7eb !important',
																	'&.Mui-selected': {
																		color: '#ffffff !important',
																	},
																},
																'& .MuiPickersMonth-monthButton': {
																	color: '#e5e7eb !important',
																	'&:hover': {
																		backgroundColor: 'rgba(249, 115, 22, 0.1)',
																		color: '#ffffff !important',
																	},
																	'&.Mui-selected': {
																		backgroundColor: '#f97316 !important',
																		color: '#ffffff !important',
																		fontWeight: 600,
																		'& > *': {
																			color: '#ffffff !important',
																		},
																		'&:hover': {
																			backgroundColor: '#ea580c !important',
																			color: '#ffffff !important',
																		},
																		'&:focus': {
																			backgroundColor: '#f97316 !important',
																			color: '#ffffff !important',
																		},
																	},
																},
																// Global overrides to force white text on selected items
																'& button.Mui-selected': {
																	color: '#ffffff !important',
																},
																'& .Mui-selected *': {
																	color: '#ffffff !important',
																},
																'& button': {
																	color: '#e5e7eb !important',
																},
																'& span': {
																	color: 'inherit',
																},
															},
														},
													},
												}}
											/>
										</LocalizationProvider>
									</div>
									<div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
										<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="phoneNumber">
											Phone Number <span className="text-orange-500">*</span>
										</label>
										<input
											id="phoneNumber"
											type="tel"
											value={phoneNumber}
											onChange={(e) => {
												// Only allow +94 followed by digits
												const value = e.target.value;
												if (value === '' || value === '+' || value === '+9' || value === '+94' || /^\+94\d{0,9}$/.test(value)) {
													setPhoneNumber(value);
												}
											}}
											placeholder="+94771234567"
											required={role === "Customer"}
											maxLength={12}
											className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
										/>
										<p className="mt-1 text-xs text-gray-400">Format: +94XXXXXXXXX (no spaces)</p>
									</div>
									<div className="md:col-span-2 animate-fadeIn" style={{ animationDelay: '250ms' }}>
										<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="address">
											Address <span className="text-orange-500">*</span>
										</label>
										<input
											id="address"
											type="text"
											value={address}
											onChange={(e) => setAddress(e.target.value)}
											placeholder="Enter your full address"
											required={role === "Customer"}
											minLength={10}
											maxLength={200}
											className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
										/>
									</div>
								</>
							)}

							<div className="animate-fadeIn" style={{ animationDelay: role === "Customer" ? '300ms' : '150ms' }}>
								<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Password</label>
								<div className="relative">
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="••••••••••••"
										required
										minLength={8}
										maxLength={128}
										className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 pr-12 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none transition-colors"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
							</div>
							<div className="animate-fadeIn" style={{ animationDelay: role === "Customer" ? '350ms' : '200ms' }}>
								<label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirmPassword">Confirm Password</label>
								<div className="relative">
									<input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										placeholder="••••••••••••"
										required
										minLength={8}
										maxLength={128}
										className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 pr-12 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none transition-colors"
									>
										{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
							</div>
						</>
					)}

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

			{/* Error Popup */}
			<ErrorPopUp
				open={errorPopup.open}
				onClose={() => setErrorPopup({ ...errorPopup, open: false })}
				message={errorPopup.message}
				type={errorPopup.type}
			/>
		</div>
	);
}


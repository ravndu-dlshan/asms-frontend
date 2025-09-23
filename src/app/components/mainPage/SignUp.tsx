"use client";

import { FormEvent, useState } from "react";

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

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!firstName || !lastName || !email || !dob || !gender || !password || !confirmPassword) {
			setMessage("Please fill in all fields.");
			return;
		}
		if (password !== confirmPassword) {
			setMessage("Passwords do not match.");
			return;
		}
		setMessage("Registering… (demo)");
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
		</div>
	);
}


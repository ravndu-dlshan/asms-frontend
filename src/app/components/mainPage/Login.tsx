"use client";

import { FormEvent, useState } from "react";
import SignUp from "./SignUp";

type View = "intro" | "login" | "signup";

export default function Login() {
	const [view, setView] = useState<View>("intro");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState<string | null>(null);

	const handleLogin = (e: FormEvent) => {
		e.preventDefault();
		// Demo only — no real auth. Provide a friendly message.
		if (!username || !password) {
			setMessage("Please enter both username and password.");
			return;
		}
		setMessage("Attempting to log in… (demo)");
	};

	if (view === "signup") {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
				<SignUp onBackToLogin={() => setView("login")} />
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				{view === "intro" ? (
					<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
						<h1 className="text-2xl font-semibold text-gray-900">Welcome to Auto Service Manager</h1>
						<p className="mt-3 text-gray-600 leading-relaxed">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
							Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
						</p>
						<button
							className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm px-5 py-2 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
							onClick={() => setView("login")}
						>
							Login
						</button>
					</section>
				) : (
					<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
						<h2 className="text-xl font-semibold text-gray-900 text-center">Login</h2>
						<p className="mt-2 text-sm text-gray-600 text-center">
							Enter your credentials to continue
						</p>

						<form onSubmit={handleLogin} className="mt-6 space-y-4">
							{message && (
								<div className="rounded-md bg-blue-50 text-blue-800 text-sm px-3 py-2 border border-blue-100">
									{message}
								</div>
							)}
							<div>
								<label htmlFor="username" className="block text-sm font-medium text-gray-700">
									Username
								</label>
								<input
									id="username"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Enter your username"
									className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
								/>
							</div>
							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700">
									Password
								</label>
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
								/>
							</div>
							<button
								type="submit"
								className="w-full rounded-lg bg-blue-600 text-white font-medium px-4 py-2.5 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
							>
								Login
							</button>
						</form>

						<div className="mt-6 text-center text-sm text-gray-700">
							<span className="text-gray-600">New Customer?</span>{" "}
							<button
								className="font-medium text-blue-700 hover:underline"
								onClick={() => setView("signup")}
							>
								Register Now
							</button>
						</div>
					</section>
				)}
			</div>
		</main>
	);
}


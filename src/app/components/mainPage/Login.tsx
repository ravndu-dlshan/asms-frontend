"use client";

import { FormEvent, useState } from "react";
import SignUp from "./SignUp";
import { loginUser } from "@/app/services/UserRegisterAndLoginServices";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

type View = "intro" | "login" | "signup";

export default function Login() {
	const [view, setView] = useState<View>("intro");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState<string | null>(null);
	const router= useRouter();

	const redirectUser = (role:string)=>{
		if(role==="ADMIN"){
			router.push("/admin");
		}else if (role==="CUSTOMER"){
			router.push("/customer");
		}else if (role==="EMPLOYEE"){
			router.push("/employee");
		}else{
			router.push("/");
		}
	}
	
	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		if (!username || !password) {
			setMessage("Please enter both username and password.");
			return;
		}

		setMessage("Attempting to log in…");
		const loginData = { email: username, password };

		try {
			const response = await loginUser(loginData);

			if (response && response.token) {
				setMessage("Login Successful!");
				localStorage.setItem(
					"userInfo",
					JSON.stringify({
					firstName: response.firstName,
					lastName: response.lastName,
					email: response.email,
					role: response.role,
					})
				);
				redirectUser(response.role);
			} else {
				setMessage("Login failed. Please try again.");
			}
		} catch (error) {
				setMessage("An error occurred. Please try again.");
		}
		};


	if (view === "signup") {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
				<SignUp onBackToLogin={() => setView("login")} />
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 relative overflow-hidden">
			{/* Background automotive pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-20 left-20 w-32 h-32 border border-orange-500 rounded-full"></div>
				<div className="absolute top-40 right-32 w-24 h-24 border border-orange-500 rounded-full"></div>
				<div className="absolute bottom-32 left-40 w-16 h-16 border border-orange-500 rounded-full"></div>
			</div>
			
			<div className="w-full max-w-md relative z-10">
				{view === "intro" ? (
					<section className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 text-center">
						{/* Logo/Brand */}
						<div className="flex items-center justify-center mb-6">
							<div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
								<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
								</svg>
							</div>
							<h1 className="text-3xl font-bold text-white">
								Car<span className="text-orange-500">vo</span>
							</h1>
						</div>
						
						<h2 className="text-xl font-semibold text-gray-200 mb-4">
							Auto Service Management System
						</h2>
						<p className="text-gray-400 leading-relaxed mb-6">
							Streamline your automotive service operations with our comprehensive management platform. 
							From service scheduling to customer management, Carvo delivers professional-grade tools 
							for modern auto service centers.
						</p>
						
						{/* Stats */}
						<div className="grid grid-cols-3 gap-4 mb-8 py-6 border-t border-b border-gray-700/50">
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-500">500+</div>
								<div className="text-xs text-gray-400 uppercase tracking-wide">Services</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-500">24/7</div>
								<div className="text-xs text-gray-400 uppercase tracking-wide">Support</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-500">99%</div>
								<div className="text-xs text-gray-400 uppercase tracking-wide">Uptime</div>
							</div>
						</div>
						
						<button
							className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm px-6 py-3 shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-800"
							onClick={() => setView("login")}
						>
							<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
							</svg>
							Get Started
						</button>
					</section>
				) : (
					<section className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
						{/* Logo/Brand for login view */}
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
						
						<h3 className="text-lg font-semibold text-gray-200 text-center mb-2">Welcome Back</h3>
						<p className="text-sm text-gray-400 text-center mb-6">
							Sign in to access your dashboard
						</p>

						<form onSubmit={handleLogin} className="space-y-5">
							{message && (
								<div className={`rounded-lg px-4 py-3 text-sm border ${
									message.includes('Successful') 
										? 'bg-green-900/50 text-green-400 border-green-800' 
										: message.includes('error') || message.includes('failed')
										? 'bg-red-900/50 text-red-400 border-red-800'
										: 'bg-blue-900/50 text-blue-400 border-blue-800'
								}`}>
									{message}
								</div>
							)}
							
							<div>
								<label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
									Username / Email
								</label>
								<input
									id="username"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Enter your username or email"
									className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
								/>
							</div>
							
							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
									Password
								</label>
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••••••"
									className="w-full rounded-xl border border-gray-600 bg-gray-700/50 backdrop-blur-sm px-4 py-3 text-gray-200 placeholder:text-gray-500 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:bg-gray-700 transition-all duration-200"
								/>
							</div>
							
							<button
								type="submit"
								className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-4 py-3 shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-800"
							>
								Sign In
							</button>
						</form>

						<div className="mt-6 text-center">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-600"></div>
								</div>
								<div className="relative flex justify-center text-xs">
									<span className="bg-gray-800 px-4 text-gray-400 uppercase tracking-wide">New to Carvo?</span>
								</div>
							</div>
							
							<button
								className="mt-4 font-medium text-orange-400 hover:text-orange-300 transition-colors duration-200 flex items-center justify-center w-full"
								onClick={() => setView("signup")}
							>
								<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
								</svg>
								Create New Account
							</button>
						</div>
					</section>
				)}
			</div>
		</main>
	);
}
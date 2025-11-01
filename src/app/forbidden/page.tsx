'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { getUserInfo } from '@/app/lib/cookies';

export default function ForbiddenPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(10);
    const [redirectUrl, setRedirectUrl] = useState<string>('/');

    useEffect(() => {
     
        const referrer = document.referrer;
        
        if (referrer && referrer.includes(window.location.host)) {
          
            const url = new URL(referrer);
            setRedirectUrl(url.pathname);
        } else {
          
            const storedUserInfo = getUserInfo();
            if (storedUserInfo) {
                const role = storedUserInfo.role || '';
                if (role === 'ROLE_ADMIN') setRedirectUrl('/admin');
                else if (role === 'ROLE_CUSTOMER') setRedirectUrl('/customer');
                else if (role === 'ROLE_EMPLOYEE') setRedirectUrl('/employee');
                else setRedirectUrl('/');
            } else {
                setRedirectUrl('/');
            }
        }
    }, []);

    useEffect(() => {
      
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleGoBack();
        }
    }, [countdown, redirectUrl]);

    const handleGoBack = () => {
        router.push(redirectUrl);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 overflow-hidden relative">
         
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full">
            
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 md:p-12 text-center">
             
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
                        </div>
                        <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full border-4 border-orange-500/30 animate-bounce">
                            <ShieldAlert className="w-16 h-16 text-orange-500" strokeWidth={1.5} />
                        </div>
                    </div>

          
                    <div className="mb-4">
                        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-2 animate-pulse">
                            403
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-gray-400 mb-3">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs font-medium tracking-wider uppercase">Access Denied</span>
                        </div>
                    </div>

           
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                        Hmm... Seems Like This Page
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                            Is Not Available For You
                        </span>
                    </h2>

         
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        You don't have permission to access this page.
                    </p>

               
                    <div className="mb-6 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
                        <p className="text-gray-300 text-xs mb-1">
                            Redirecting you back in
                        </p>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 animate-pulse">
                            {countdown}
                        </div>
                        <p className="text-gray-400 text-xs mt-1">seconds</p>
                    </div>

           
                    <div className="mt-6 pt-6 border-t border-gray-700/50">
                        <p className="text-gray-500 text-xs">
                            If you believe this is an error, please contact your system administrator.
                        </p>
                    </div>
                </div>

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
        </div>
    );
}

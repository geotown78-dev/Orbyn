import { useState } from "react";

import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useApp } from '../AppContext';

export const Auth = () => {
  const { setIsAuthenticated } = useApp();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0E0F15] bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-[#0E0F15]/90 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#13141C] border border-[#20212B] rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7038fa] to-[#4b1fc4] flex items-center justify-center shadow-[0_0_30px_rgba(112,56,250,0.5)] mb-4">
              <span className="font-bold text-white text-3xl">O</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Orbyn</h1>
            <p className="text-gray-400 text-sm text-center">
              {isLogin ? "Welcome back! Please login to your account." : "Create an account to join the community."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-3 text-gray-500" />
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#181922] border border-[#20212B] rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-[#7038fa]/50 transition-colors"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-3 text-gray-500" />
                <input 
                  type="email" 
                  required
                  className="w-full bg-[#181922] border border-[#20212B] rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-[#7038fa]/50 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3 text-gray-500" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-[#181922] border border-[#20212B] rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-[#7038fa]/50 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <span className="text-xs text-[#7038fa] cursor-pointer hover:underline font-medium">Forgot password?</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#7038fa] hover:bg-[#5b2bd4] text-white rounded-xl py-3 font-bold transition-all shadow-[0_0_20px_rgba(112,56,250,0.3)] hover:shadow-[0_0_30px_rgba(112,56,250,0.5)] flex items-center justify-center gap-2 mt-6"
            >
              {isLogin ? "Login" : "Sign Up"} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#7038fa] font-bold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

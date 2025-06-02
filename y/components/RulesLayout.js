'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RulesLayout({ 
  children, 
  title, 
  description, 
  badgeText, 
  icon: Icon,
  iconColor = "from-purple-500 to-purple-600" 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className={`w-8 h-8 bg-gradient-to-r ${iconColor} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {title}
              </h1>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="relative z-10 max-w-6xl mx-auto py-8 sm:px-6 lg:px-8">
        <motion.div 
          className="px-4 sm:px-0 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Icon className="w-3 h-3 mr-1" />
            {badgeText}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto pb-12 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
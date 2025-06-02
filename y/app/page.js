'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, AlertTriangle, Database, Zap, Globe, LogOut } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

export default function Home() {
  const { data: session } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const glowVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Security Dashboard
              </h1>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {session ? (
                <>
                  <Link href="/info">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                      Info
                    </Button>
                  </Link>
                  <NotificationBell />
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {session.user.email}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium">
                    <Lock className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <motion.div 
          className="px-4 py-6 sm:px-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-16">
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Zap className="w-3 h-3 mr-1" />
                Next-Gen Security
              </Badge>
            </motion.div>
            
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-6"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Decentralized
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Security Monitoring
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Monitor Falco and Opa rules and manage vulnerability reports with cutting-edge blockchain-inspired security protocols
            </motion.p>
            
            {!session && (
              <motion.div variants={itemVariants}>
                <Link href="/login">
                  <motion.div
                    whileHover="hover"
                    variants={glowVariants}
                  >
                    <Button size="lg" className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium px-8 py-3 text-lg">
                      <Globe className="w-5 h-5 mr-2" />
                      Enter Dashboard
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </div>

          {session && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Link href="/falco-rules">
                  <motion.div
                    whileHover="hover"
                    variants={glowVariants}
                  >
                    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 group">
                      <CardHeader>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-white">Falco Rules</CardTitle>
                        <CardDescription className="text-gray-400">
                          Manage and deploy your security rules
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-purple-400">Active</span>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            Live
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/opa-rules">
                  <motion.div
                    whileHover="hover"
                    variants={glowVariants}
                  >
                    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 group">
                      <CardHeader>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-white">Opa Rules</CardTitle>
                        <CardDescription className="text-gray-400">
                          Manage and deploy your security rules
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-purple-400">Active</span>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            Live
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link href="/info">
                  <motion.div
                    whileHover="hover"
                    variants={glowVariants}
                  >
                    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-cyan-500/30 backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-300 group">
                      <CardHeader>
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Database className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-white">System Info</CardTitle>
                        <CardDescription className="text-gray-400">
                          Learn about the security architecture
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-cyan-400">Protocol</span>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            Docs
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-orange-500/30 backdrop-blur-xl group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-3">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">Alerts</CardTitle>
                    <CardDescription className="text-gray-400">
                      Real-time vulnerability monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-400">0</span>
                      <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                        Clear
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
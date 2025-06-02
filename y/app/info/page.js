'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  Database, 
  Zap, 
  Globe,
  Code,
  Server,
  Mail,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function Info() {
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
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                System Protocol
              </h1>
            </motion.div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto py-12 sm:px-6 lg:px-8">
        <motion.div 
          className="px-4 py-6 sm:px-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-12">
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                <Code className="w-3 h-3 mr-1" />
                Protocol Documentation
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Security
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Architecture
              </span>
            </motion.h1>
          </div>

          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">System Purpose</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    This Security Monitoring System is designed to centralize and manage security rules and vulnerability reports. 
                    It provides a unified platform for monitoring security events, managing Falco rules, and receiving automated 
                    alerts for critical vulnerabilities using next-generation blockchain-inspired architecture.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-purple-400" />
                Core Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover="hover"
                  variants={glowVariants}
                >
                  <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 group h-full">
                    <CardHeader>
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-white">Authentication</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">
                        Secure login system using PostgreSQL for credential storage and verification with enterprise-grade encryption.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover="hover"
                  variants={glowVariants}
                >
                  <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-cyan-500/30 backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-300 group h-full">
                    <CardHeader>
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-white">Falco Rules Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">
                        Create, view, and manage Falco security rules through a user-friendly interface with real-time validation.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover="hover"
                  variants={glowVariants}
                >
                  <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-orange-500/30 backdrop-blur-xl hover:border-orange-400/50 transition-all duration-300 group h-full">
                    <CardHeader>
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-white">Vulnerability Reporting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">
                        API endpoint for receiving vulnerability data with automatic severity parsing and intelligent threat assessment.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover="hover"
                  variants={glowVariants}
                >
                  <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-green-500/30 backdrop-blur-xl hover:border-green-400/50 transition-all duration-300 group h-full">
                    <CardHeader>
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-white">Smart Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">
                        Automatic email notifications for high and critical severity vulnerabilities with customizable thresholds.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Server className="w-6 h-6 mr-2 text-cyan-400" />
                Protocol Flow
              </h2>
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {[
                      {
                        number: "01",
                        title: "Authentication",
                        description: "Users log in with their credentials stored securely in PostgreSQL with bcrypt encryption.",
                        color: "from-purple-500 to-purple-600"
                      },
                      {
                        number: "02",
                        title: "Rule Management",
                        description: "Authorized users can create and view Falco rules through the web interface with real-time validation.",
                        color: "from-cyan-500 to-cyan-600"
                      },
                      {
                        number: "03",
                        title: "Vulnerability Processing",
                        description: "External systems send vulnerability data via POST API, which is processed and stored with automatic categorization.",
                        color: "from-orange-500 to-red-500"
                      },
                      {
                        number: "04",
                        title: "Alert System",
                        description: "High and critical severity vulnerabilities trigger automatic email alerts to administrators with detailed reports.",
                        color: "from-green-500 to-emerald-500"
                      }
                    ].map((step, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-start space-x-4"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {step.number}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-lg mb-1">{step.title}</h4>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Code className="w-6 h-6 mr-2 text-purple-400" />
                API Endpoints
              </h2>
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {[
                      {
                        method: "POST",
                        endpoint: "/api/falco-rules",
                        description: "Create new Falco rules (requires authentication)",
                        methodColor: "bg-green-500/20 text-green-300 border-green-500/30"
                      },
                      {
                        method: "GET",
                        endpoint: "/api/falco-rules",
                        description: "Retrieve all Falco rules (requires authentication)",
                        methodColor: "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      },
                      {
                        method: "POST",
                        endpoint: "/api/vulnerability-report",
                        description: "Submit vulnerability reports (public endpoint for external systems)",
                        methodColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
                      }
                    ].map((api, index) => (
                      <motion.div 
                        key={index}
                        className="border border-slate-600/50 rounded-lg p-4 hover:border-slate-500/50 transition-colors"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={api.methodColor}>
                            {api.method}
                          </Badge>
                          <code className="bg-slate-700/50 px-3 py-1 rounded text-cyan-400 font-mono text-sm">
                            {api.endpoint}
                          </code>
                        </div>
                        <p className="text-gray-400 text-sm ml-0">{api.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
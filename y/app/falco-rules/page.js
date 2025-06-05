'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Shield, Search, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RulesLayout from '@/components/RulesLayout';
import RuleCard from '@/components/RuleCard';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function FalcoRules() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rules, setRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRule, setSelectedRule] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('/api/falco/rules');
        if (!response.ok) {
          throw new Error('Failed to fetch Falco rules');
        }
        const data = await response.json();
        setRules(data.rules);
        setFilteredRules(data.rules);
      } catch (error) {
        console.error('Error fetching Falco rules:', error);
        toast.error('Failed to fetch Falco rules');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchRules();
    }
  }, [session]);

  useEffect(() => {
    const filtered = rules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRules(filtered);
  }, [rules, searchTerm]);

  const handleViewRule = (rule) => {
    setSelectedRule(rule);
  };

  const truncateDescription = (description, maxLength = 150) => {
    if (!description) return 'No description available';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  return (
    <RulesLayout
      title="Falco Rules"
      description="View and manage Falco security rules for runtime security monitoring in your Kubernetes cluster"
      badgeText="Runtime Security"
      icon={AlertTriangle}
      iconColor="from-orange-500 to-orange-600"
    >
      <motion.div
        className="px-4 sm:px-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search Falco rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">
            Loading Falco rules...
          </div>
        ) : filteredRules.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Falco rules found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No Falco rules are currently configured in your cluster"}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {filteredRules.map((rule) => (
              <motion.div key={rule.id} variants={itemVariants}>
                <RuleCard
                  rule={{
                    ...rule,
                    description: truncateDescription(rule.description)
                  }}
                  onView={() => handleViewRule(rule)}
                  priorityColor={
                    rule.priority === 'CRITICAL' ? 'text-red-500' :
                    rule.priority === 'WARNING' ? 'text-yellow-500' :
                    rule.priority === 'ERROR' ? 'text-orange-500' :
                    'text-blue-500'
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Rule Details Modal */}
      {selectedRule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">{selectedRule.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedRule(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
                <p className="text-white whitespace-pre-wrap">{selectedRule.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Condition</h3>
                <pre className="bg-slate-900 p-3 rounded text-sm text-white overflow-x-auto">
                  {selectedRule.condition}
                </pre>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Output</h3>
                <pre className="bg-slate-900 p-3 rounded text-sm text-white overflow-x-auto">
                  {selectedRule.output}
                </pre>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Priority</h3>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  selectedRule.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                  selectedRule.priority === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
                  selectedRule.priority === 'ERROR' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {selectedRule.priority}
                </span>
              </div>
              
              {selectedRule.tags && selectedRule.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRule.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </RulesLayout>
  );
}
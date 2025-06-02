'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Shield, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RulesLayout from '@/components/RulesLayout';
import RuleCard from '@/components/RuleCard';
import RuleDialog from '@/components/RuleDialog';
import { useRouter } from 'next/navigation';

export default function FalcoRules() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rules, setRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
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
    if (session) {
      fetchRules();
    }
  }, [session]);

  useEffect(() => {
    const filtered = rules.filter(rule =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRules(filtered);
  }, [rules, searchTerm]);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/falco-rules');
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (ruleData) => {
    try {
      const response = await fetch('/api/falco-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData),
      });

      if (response.ok) {
        setShowDialog(false);
        setSelectedRule(null);
        fetchRules();
      }
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handleViewRule = (rule) => {
    alert(`Rule Content:\n\n${rule.rule_content}`);
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setShowDialog(true);
  };

  const handleDeleteRule = async (rule) => {
    if (confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      console.log('Delete rule:', rule.id);
    }
  };

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  return (
    <RulesLayout
      title="Falco Rules"
      description="Create, manage, and deploy Falco security rules for runtime threat detection and compliance monitoring"
      badgeText="Runtime Security"
      icon={Shield}
      iconColor="from-purple-500 to-purple-600"
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
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
          <Button
            onClick={() => {
              setSelectedRule(null);
              setShowDialog(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </Button>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading rules...</div>
        ) : filteredRules.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No rules found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first Falco rule to get started'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowDialog(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Rule
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {filteredRules.map((rule, index) => (
              <motion.div key={rule.id} variants={itemVariants}>
                <RuleCard
                  rule={rule}
                  onView={handleViewRule}
                  onEdit={handleEditRule}
                  onDelete={handleDeleteRule}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <RuleDialog
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          setSelectedRule(null);
        }}
        onSave={handleCreateRule}
        rule={selectedRule}
        title={selectedRule ? "Edit Falco Rule" : "Create Falco Rule"}
        ruleType="falco"
      />
    </RulesLayout>
  );
}
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, Plus } from 'lucide-react';

export default function RuleDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  rule, 
  title = "Create Rule",
  ruleType = "falco" 
}) {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    description: rule?.description || '',
    rule_content: rule?.rule_content || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ name: '', description: '', rule_content: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-purple-500/30 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">{title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {rule ? 'Edit existing rule' : `Create a new ${ruleType} rule`}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Rule Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter rule name"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter rule description"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rule_content" className="text-white">Rule Content</Label>
                <Textarea
                  id="rule_content"
                  value={formData.rule_content}
                  onChange={(e) => setFormData({ ...formData, rule_content: e.target.value })}
                  placeholder={`Enter ${ruleType} rule content`}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 min-h-[200px] font-mono text-sm"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                >
                  {rule ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {rule ? 'Update Rule' : 'Create Rule'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
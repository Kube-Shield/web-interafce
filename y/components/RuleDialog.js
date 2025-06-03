"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Save, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function RuleDialog({
  isOpen,
  onClose,
  rule,
  title = "Apply Constraint Rule",
}) {
  const [formData, setFormData] = useState({
    name: rule?.name || "",
    description: rule?.description || "",
    cpu: "",
    memory: "",
    namespace: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Applying rule...");

    try {
      const res = await fetch("/api/opa/apply-rule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          name: rule?.name || "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Rule applied successfully!", { id: toastId });
        onClose();
        rule.status = "active";
      } else {
        toast.error(`Failed: ${data.error}`, { id: toastId });
        console.error("Error:", data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", { id: toastId });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl"
      >
        <Card className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-purple-500/30 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">{title}</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill the constraint values
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
            <div className="mb-6 space-y-1 text-center">
              <h2 className="text-2xl font-semibold">
                <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  {rule?.name || "Untitled Rule"}
                </span>
              </h2>
              <p className="text-gray-400 text-lg">
                {rule?.description || "No description provided."}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cpu" className="text-white">
                  CPU Limit
                </Label>
                <Input
                  id="cpu"
                  name="cpu"
                  placeholder="e.g. 500m"
                  value={formData.cpu}
                  onChange={handleChange}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memory" className="text-white">
                  Memory Limit
                </Label>
                <Input
                  id="memory"
                  name="memory"
                  placeholder="e.g. 256Mi"
                  value={formData.memory}
                  onChange={handleChange}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="namespace" className="text-white">
                  Namespace
                </Label>
                <Input
                  id="namespace"
                  name="namespace"
                  placeholder="e.g. opa-test"
                  value={formData.namespace}
                  onChange={handleChange}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
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
                  <Plus className="w-4 h-4 mr-2" />
                  Apply Rule
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

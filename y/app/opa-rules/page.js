"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Shield, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RulesLayout from "@/components/RulesLayout";
import RuleCard from "@/components/RuleCard";
import RuleDialog from "@/components/RuleDialog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OpaRules() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rules, setRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      setTimeout(() => {
        setRules([
          {
            id: 1,
            name: "Privilige Escalation",
            description: "Controls restricting escalation to root privileges",
            created_at: new Date().toISOString(),
            status: "inactive",
          },
          {
            id: 2,
            name: "Resource-Limits",
            description:
              "Requires containers to have memory and CPU limits set",
            created_at: new Date().toISOString(),
            status: "inactive",
          },
          {
            id: 3,
            name: "Allowed Repositories",
            description:
              "Requires container images to begin with a string from the specified list",
            created_at: new Date().toISOString(),
            status: "inactive",
          },
          {
            id: 4,
            name: "Capabilities",
            description: "Controls Linux capabilities on containers",
            created_at: new Date().toISOString(),
            status: "inactive",
          },
          {
            id: 5,
            name: "Priviliged",
            description:
              "Controls the ability of a container to be in privileged mode",
            created_at: new Date().toISOString(),
            status: "inactive",
          },
          {
            id: 6,
            name: "Required Labels",
            description: "Requires resources to contain specified labels",
            created_at: new Date().toISOString(),
            status: "inactive",
          },
          {
            id: 7,
            name: "Seccomp",
            description: "Controls the seccomp profile used by containers",
            created_at: new Date().toISOString(),
            status: "inactive",
          },
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [session]);

  useEffect(() => {
    const filtered = rules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRules(filtered);
  }, [rules, searchTerm]);

  const handleCreateRule = async (ruleData) => {
    console.log("Creating OPA rule:", ruleData);
    setShowDialog(false);
    setSelectedRule(null);
  };

  const handleViewRule = (rule) => {
    alert(`Rule Content:\n\n${rule.rule_content}`);
  };

  const handleApplyRule = async (rule) => {
    try {
      const res = await fetch("/api/opa/apply-rule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rule),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to apply rule");

      alert(`Rule "${rule.name}" applied successfully!`);
    } catch (err) {
      alert("Error applying rule: " + err.message);
    }
  };

  const handleDeleteRule = async (rule) => {
    const confirmDelete = window.confirm(`Delete "${rule.name}"?`);
    if (!confirmDelete) return;

    const deleteToast = toast.loading(`Deleting "${rule.name}"...`);

    try {
      const res = await fetch("/api/opa/delete-rule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: rule.name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete rule");

      toast.success(`Rule "${rule.name}" deleted successfully!`, {
        id: deleteToast,
      });

      // Update the rule status locally (optional depending on state management)
      rule.status = "inactive";
    } catch (err) {
      toast.error("Error deleting rule: " + err.message, { id: deleteToast });
    }
  };

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  return (
    <RulesLayout
      title="OPA Rules"
      description="Create and manage Open Policy Agent rules for Kubernetes admission control and policy enforcement"
      badgeText="Policy as Code"
      icon={Shield}
      iconColor="from-emerald-500 to-emerald-600"
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
              placeholder="Search OPA rules..."
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
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
            disabled
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </Button>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">
            Loading OPA rules...
          </div>
        ) : filteredRules.length === 0 ? (
          <motion.div className="text-center py-12" variants={itemVariants}>
            <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No OPA rules found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create your first OPA rule to get started"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowDialog(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
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
                  onEdit={() => {
                    setSelectedRule(rule);
                    setShowDialog(true);
                  }}
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
        rule={selectedRule}
        title={selectedRule ? "Edit OPA Rule" : "Create OPA Rule"}
        ruleType="opa"
      />
    </RulesLayout>
  );
}

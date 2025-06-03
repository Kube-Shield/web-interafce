"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShieldPlus, ShieldMinus } from "lucide-react";

export default function RuleCard({ rule, onView, onEdit, onDelete }) {
  const cardVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <motion.div variants={cardVariants} whileHover="hover" initial="initial">
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-white text-lg mb-2">
                {rule.name}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {rule.description || "No description provided"}
              </CardDescription>
            </div>
            <Badge
              className={` ${
                rule.status === "active"
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-red-500/20 text-red-300 border-red-500/30"
              }`}
            >
              {rule.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Created: {new Date(rule.created_at).toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onView?.(rule)}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit?.(rule)}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
              >
                <ShieldPlus className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(rule)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <ShieldMinus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

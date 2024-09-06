import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Template {
  id: string;
  name: string;
  icon: string;
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const templates: Template[] = [
    { id: "swap", name: "Swap tokens using Jupiter", icon: "🔄" },
    { id: "tip", name: "Send me tip", icon: "💰" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-400">
        Select a Template
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Button
              onClick={() => onSelect(template)}
              className="w-full h-32 text-left flex flex-col items-start justify-center p-6 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              <span className="text-4xl mb-2">{template.icon}</span>
              <span className="text-xl font-semibold">{template.name}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

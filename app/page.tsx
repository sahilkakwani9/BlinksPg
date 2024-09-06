"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { Button } from "@/components/ui/button";
import { PlusCircle, Save, Undo } from "lucide-react";
import { motion } from "framer-motion";
import { ReactConfetti } from "react-confetti";
import { TemplateSelector } from "@/components/ui/TemplateSelector";
import { DragDropArea } from "@/components/ui/DragDropArea";

type ComponentType = "image" | "input" | "button";

interface Component {
  id: string;
  type: ComponentType;
  src?: string;
  alt?: string;
  placeholder?: string;
  text?: string;
}

interface Template {
  id: string;
  name: string;
}

export default function BlinkPlayground() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [components, setComponents] = useState<Component[]>([]);
  const [history, setHistory] = useState<Component[][]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (selectedTemplate) {
      const initialComponents = getInitialComponents(selectedTemplate.id);
      setComponents(initialComponents);
      setHistory([initialComponents]);
    }
  }, [selectedTemplate]);

  const getInitialComponents = (templateId: string): Component[] => {
    switch (templateId) {
      case "swap":
        return [
          {
            id: "image-1",
            type: "image",
            src: "/placeholder.svg?height=200&width=400",
            alt: "Token Swap",
          },
          { id: "input-1", type: "input", placeholder: "Enter amount to swap" },
          { id: "button-1", type: "button", text: "Swap Tokens" },
        ];
      case "tip":
        return [
          {
            id: "image-2",
            type: "image",
            src: "/placeholder.svg?height=200&width=400",
            alt: "Tip Jar",
          },
          { id: "input-2", type: "input", placeholder: "Enter tip amount" },
          { id: "button-2", type: "button", text: "Send Tip" },
        ];
      default:
        return [];
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newComponents = Array.from(components);
    const [reorderedItem] = newComponents.splice(result.source.index, 1);
    newComponents.splice(result.destination.index, 0, reorderedItem);

    setComponents(newComponents);
    setHistory([...history, newComponents]);
  };

  const addComponent = (type: ComponentType) => {
    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type,
      ...(type === "image" && {
        src: "/placeholder.svg?height=200&width=400",
        alt: "New Image",
      }),
      ...(type === "input" && { placeholder: "New Input" }),
      ...(type === "button" && { text: "New Button" }),
    };
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setHistory([...history, newComponents]);
  };

  const undoLastAction = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setComponents(newHistory[newHistory.length - 1]);
    }
  };

  const saveDesign = () => {
    console.log("Saving design:", components);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      {showConfetti && <ReactConfetti />}
      <motion.h1
        className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Blink Playground
      </motion.h1>
      {!selectedTemplate ? (
        <TemplateSelector onSelect={setSelectedTemplate} />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              <DragDropArea components={components} />
            </div>
            <div className="lg:w-1/4">
              <motion.div
                className="bg-gray-800 rounded-lg p-6 shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  Toolbox
                </h2>
                <div className="space-y-3">
                  <Button
                    onClick={() => addComponent("image")}
                    className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                  </Button>
                  <Button
                    onClick={() => addComponent("input")}
                    className="w-full bg-pink-600 hover:bg-pink-700 transition-colors"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Input Box
                  </Button>
                  <Button
                    onClick={() => addComponent("button")}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Button
                  </Button>
                  <Button
                    onClick={undoLastAction}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 transition-colors"
                    disabled={history.length <= 1}
                  >
                    <Undo className="mr-2 h-4 w-4" /> Undo
                  </Button>
                  <Button
                    onClick={saveDesign}
                    className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Design
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
}

import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

interface Component {
  id: string;
  type: "image" | "input" | "button";
  src?: string;
  alt?: string;
  placeholder?: string;
  text?: string;
}

interface DragDropAreaProps {
  components: Component[];
}

export function DragDropArea({ components }: DragDropAreaProps) {
  const renderComponent = (component: Component) => {
    switch (component.type) {
      case "image":
        return (
          <div className="relative w-full h-48 bg-gray-700 rounded-lg overflow-hidden">
            <Image
              src={component.src || "/placeholder.svg?height=200&width=400"}
              alt={component.alt || "Placeholder"}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-lg font-semibold">
                Drag to reposition
              </span>
            </div>
          </div>
        );
      case "input":
        return (
          <Input
            placeholder={component.placeholder || "Enter text"}
            className="bg-gray-700 text-white border-gray-600"
          />
        );
      case "button":
        return (
          <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
            {component.text || "Click me"}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Droppable droppableId="playground">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="min-h-[600px] border-2 border-dashed border-gray-600 rounded-lg p-8 bg-gray-800 bg-opacity-50"
        >
          {components.map((component, index) => (
            <Draggable
              key={component.id}
              draggableId={component.id}
              index={index}
            >
              {(provided) => (
                <motion.div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="mb-4 p-4 bg-gray-700 rounded-lg shadow-lg cursor-move"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderComponent(component)}
                </motion.div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

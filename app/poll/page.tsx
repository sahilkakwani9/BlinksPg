"use client";

import { useState } from "react";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { createPoll } from "@/lib/utils/createpoll";

export default function PollCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blinkUrl, setBlinkUrl] = useState("");
  const { toast } = useToast();

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (!title || !description || options.some((option) => !option.trim())) {
      toast({
        title: "Error",
        description:
          "Please fill in all fields and provide at least two options.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await createPoll({ title, description, options });
      toast({
        title: "Success",
        description: "Poll created successfully!",
      });
      setBlinkUrl(
        `https://${window.location.hostname}/api/poll?pollId=${data.id}`
      );

      // Reset form
      setTitle("");
      setDescription("");
      setOptions(["", ""]);
      setImagePreview(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create poll. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (blinkUrl) {
        navigator.clipboard.writeText(blinkUrl);
        toast({
          title: "Link copied",
        });
        return;
      }
      await handleSubmit();
    } catch (error) {
      console.log("error submitting", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create a New Poll
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <Label
                  htmlFor="title"
                  className="text-lg font-medium text-gray-700"
                >
                  Poll Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter poll title"
                  className="mt-1 text-black"
                />
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="text-lg font-medium text-gray-700"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter poll description"
                  className="mt-1 text-black"
                  rows={4}
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="image"
                className="text-lg font-medium text-gray-700"
              >
                Upload Image
              </Label>
              <div className="mt-1 flex flex-col items-center space-y-4">
                <Label
                  htmlFor="image"
                  className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setImagePreview(null)}
                  >
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-700">
              Poll Options
            </Label>
            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2"
                >
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-grow text-black"
                  />
                  {index >= 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
            {options.length < 4 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Option
              </Button>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            onClick={onClickSubmit}
          >
            {blinkUrl
              ? "Copy Link"
              : isSubmitting
              ? "Creating Poll..."
              : "Create Poll"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

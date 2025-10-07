import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface DragSliderProps {
  onComplete?: () => void;
  navigateTo?: string;
}

export const DragSlider = ({ onComplete, navigateTo = "/signup/create" }: DragSliderProps) => {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const x = useMotionValue(0);
  
  const DRAG_THRESHOLD = 200;
  const MAX_DRAG = 300;
  
  const opacity = useTransform(x, [0, DRAG_THRESHOLD], [0.6, 1]);
  const scale = useTransform(x, [0, DRAG_THRESHOLD], [1, 1.05]);
  const progressWidth = useTransform(x, [0, MAX_DRAG], [0, 100]);
  const textOpacity = useTransform(x, [0, DRAG_THRESHOLD], [1, 0]);
  const iconRotate = useTransform(x, [0, MAX_DRAG], [0, 360]);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    setIsDragging(false);
    
    if (info.offset.x > DRAG_THRESHOLD) {
      setIsComplete(true);
      animate(x, MAX_DRAG, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }).then(() => {
        onComplete?.();
        router.push(navigateTo);
      });
    } else {
      // Smooth return to start position
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 35,
        mass: 0.8,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-16 bg-secondary/20 rounded-full overflow-hidden backdrop-blur-sm border border-border/50 shadow-inner">
        {/* Animated progress background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent"
          style={{ 
            width: progressWidth,
            transformOrigin: "left"
          }}
        />
        
        {/* Draggable knob */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: MAX_DRAG }}
          dragElastic={0.05}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="absolute top-2 left-2 h-12 w-12 rounded-full cursor-grab active:cursor-grabbing touch-none z-10"
        >
          <motion.div
            style={{ opacity, scale }}
            className="h-full w-full bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-xl shadow-primary/50"
          >
            <motion.div style={{ rotate: iconRotate }}>
              <ChevronRight className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Text label */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: textOpacity }}
        >
          <span className="text-sm font-medium text-foreground/60 select-none">
            {isComplete ? "Unlocking..." : "Swipe to continue"}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

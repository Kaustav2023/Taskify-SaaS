import { Check, Trash2, Home, Briefcase, BookOpen, Heart, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import PomodoroTimer from './PomodoroTimer';

const categoryConfig = {
    Personal: { icon: Home, class: 'badge-personal', emoji: '🏠' },
    Work: { icon: Briefcase, class: 'badge-work', emoji: '💼' },
    Learning: { icon: BookOpen, class: 'badge-learning', emoji: '📚' },
    Health: { icon: Heart, class: 'badge-health', emoji: '🏃' },
    Ideas: { icon: Lightbulb, class: 'badge-ideas', emoji: '💡' },
};

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
    const category = categoryConfig[task.category] || categoryConfig.Personal;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={`glass-card p-4 flex items-center gap-4 transition-smooth ${task.completed ? 'opacity-60' : ''
                }`}
        >
            {/* Checkbox */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleComplete(task.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-smooth border-2 ${task.completed
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-transparent'
                        : 'border-slate-500 hover:border-purple-400'
                    }`}
            >
                {task.completed && <Check size={14} className="text-white" />}
            </motion.button>

            {/* Task content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className={`${category.class} text-xs px-2 py-0.5 rounded-full text-white font-medium`}
                    >
                        {category.emoji} {task.category}
                    </span>
                </div>
                <p
                    className={`text-white truncate transition-smooth ${task.completed ? 'line-through text-slate-400' : ''
                        }`}
                >
                    {task.title}
                </p>
            </div>

            {/* Pomodoro Timer */}
            {!task.completed && (
                <PomodoroTimer minutes={task.pomodoro_minutes} />
            )}

            {/* Delete button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-smooth"
            >
                <Trash2 size={18} />
            </motion.button>
        </motion.div>
    );
};

export default TaskItem;

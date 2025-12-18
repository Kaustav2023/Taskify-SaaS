import { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskInput = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        await onAddTask(title, pomodoroMinutes);
        setTitle('');
        setIsLoading(false);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 
                       text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 
                       focus:ring-2 focus:ring-purple-500/20 transition-smooth"
                        disabled={isLoading}
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading || !title.trim()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 
                       rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                    >
                        {isLoading ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <Plus size={20} />
                        )}
                        Add Task
                    </motion.button>
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                    <Clock size={18} />
                    <span className="text-sm">Pomodoro:</span>
                    <div className="flex gap-2">
                        {[15, 25, 45, 60].map((min) => (
                            <button
                                key={min}
                                type="button"
                                onClick={() => setPomodoroMinutes(min)}
                                className={`px-3 py-1 rounded-lg text-sm transition-smooth ${pomodoroMinutes === min
                                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500'
                                        : 'bg-slate-700/50 hover:bg-slate-700'
                                    }`}
                            >
                                {min}m
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.form>
    );
};

export default TaskInput;

import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const ProgressBar = ({ completed, total }) => {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6"
        >
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    {percentage === 100 ? (
                        <CheckCircle2 className="text-green-400" size={20} />
                    ) : (
                        <Circle className="text-slate-400" size={20} />
                    )}
                    <span className="text-slate-300 font-medium">Progress</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold gradient-text">{percentage}%</span>
                    <span className="text-sm text-slate-400">
                        ({completed}/{total} tasks)
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full progress-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            {/* Motivational message */}
            <motion.p
                key={percentage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-slate-400 mt-3 text-center"
            >
                {percentage === 0 && total === 0 && "Add some tasks to get started! 🚀"}
                {percentage === 0 && total > 0 && "Ready to crush it? Let's go! 💪"}
                {percentage > 0 && percentage < 50 && "Great start! Keep the momentum! 🔥"}
                {percentage >= 50 && percentage < 100 && "Halfway there! You're on fire! ⚡"}
                {percentage === 100 && "All done! You're a productivity champion! 🏆"}
            </motion.p>
        </motion.div>
    );
};

export default ProgressBar;

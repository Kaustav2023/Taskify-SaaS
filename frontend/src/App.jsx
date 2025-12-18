import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  HelpCircle,
  Settings,
  User,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Save,
  Clock,
  Calendar as CalendarIcon,
  Trash2,
} from 'lucide-react';

const API_URL = ''; // Empty for relative paths (works on Replit and local)

// ===================== UTILITY FUNCTIONS =====================
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDaysLeft = (dueDateStr) => {
  if (!dueDateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diff;
};

const getWeekDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

// Robust date comparison - compares only Year, Month, Day (ignores time)
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  // Extract just the date part (YYYY-MM-DD)
  const d1 = date1.split('T')[0];
  const d2 = date2.split('T')[0];
  return d1 === d2;
};

// ===================== SIDEBAR COMPONENT =====================
const Sidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  ];

  const bottomNavItems = [
    { icon: HelpCircle, label: 'Support', id: 'support' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <aside className="col-span-2 bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        <span className="text-xl font-bold text-gray-900">Taskify</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activePage === item.id
                  ? 'bg-purple-800 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 pb-6">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activePage === item.id
                  ? 'bg-purple-800 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

// ===================== PROFILE CARD =====================
const ProfileCard = ({ username }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="text-white" size={24} />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{username || 'User'}</h3>
        <p className="text-sm text-gray-500">Task Manager</p>
      </div>
    </div>
  </div>
);

// ===================== MONTHLY CALENDAR =====================
const MonthlyCalendar = ({ tasks, selectedDate, setSelectedDate, onAddTask }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    // Previous month padding
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, dateStr, isCurrentMonth: true });
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date().toISOString().split('T')[0];

  const taskDates = useMemo(() => {
    const dates = new Set();
    tasks.forEach(t => {
      if (t.due_date) {
        // Extract just the date part (YYYY-MM-DD) to ensure proper matching
        dates.add(t.due_date.split('T')[0]);
      }
    });
    return dates;
  }, [tasks]);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <h3 className="font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>
        <button
          onClick={onAddTask}
          className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs text-gray-400 font-medium py-1">
            {day.charAt(0)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div
            key={i}
            onClick={() => d.dateStr && setSelectedDate(d.dateStr)}
            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs cursor-pointer transition-all relative ${!d.isCurrentMonth ? 'text-gray-200' :
              d.dateStr === selectedDate ? 'bg-purple-700 text-white' :
                d.dateStr === today ? 'bg-purple-100 text-purple-700 font-bold' :
                  'hover:bg-gray-100 text-gray-600'
              }`}
          >
            {d.day}
            {d.dateStr && taskDates.has(d.dateStr) && d.dateStr !== selectedDate && (
              <div className="absolute bottom-1 w-1 h-1 rounded-full bg-purple-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ===================== SCHEDULED TASKS =====================
const ScheduledTasks = ({ tasks, selectedDate }) => {
  const scheduledForToday = useMemo(() => {
    return tasks
      .filter(t => isSameDay(t.due_date, selectedDate) && t.start_time && !t.completed)
      .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
  }, [tasks, selectedDate]);

  const categoryColors = {
    Work: 'bg-blue-50 border-blue-200',
    Learning: 'bg-green-50 border-green-200',
    Health: 'bg-orange-50 border-orange-200',
    Ideas: 'bg-pink-50 border-pink-200',
    Personal: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock size={16} />
        Schedule
      </h3>

      {scheduledForToday.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">No scheduled tasks for this day</p>
      ) : (
        <div className="space-y-3">
          {scheduledForToday.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-xl border ${categoryColors[task.category] || categoryColors.Personal}`}
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Clock size={12} />
                {task.start_time}
              </div>
              <h4 className="font-medium text-sm text-gray-700 truncate">{task.title}</h4>
              <p className="text-xs text-gray-400">{task.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===================== 3D CATEGORY BADGE =====================
const CategoryBadge3D = ({ category }) => {
  const badgeConfig = {
    Work: {
      gradient: 'from-blue-500 to-blue-600',
      rim: 'from-yellow-400 via-yellow-200 to-yellow-500',
      icon: '💼',
      bg: 'bg-blue-900/20'
    },
    Learning: {
      gradient: 'from-emerald-500 to-emerald-600',
      rim: 'from-gray-300 via-white to-gray-400',
      icon: '📚',
      bg: 'bg-emerald-900/20'
    },
    Health: {
      gradient: 'from-orange-500 to-red-500',
      rim: 'from-amber-600 via-amber-400 to-amber-700',
      icon: '❤️',
      bg: 'bg-orange-900/20'
    },
    Ideas: {
      gradient: 'from-pink-500 to-rose-500',
      rim: 'from-yellow-400 via-yellow-200 to-yellow-500',
      icon: '💡',
      bg: 'bg-pink-900/20'
    },
    Personal: {
      gradient: 'from-purple-500 to-purple-600',
      rim: 'from-gray-300 via-white to-gray-400',
      icon: '✨',
      bg: 'bg-purple-900/20'
    }
  };

  const config = badgeConfig[category] || badgeConfig.Personal;

  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      {/* Hexagon SVG with metallic rim */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <defs>
          {/* Metallic rim gradient */}
          <linearGradient id={`rim-${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className={`text-yellow-400`} style={{ stopColor: category === 'Work' || category === 'Ideas' ? '#facc15' : '#d1d5db' }} />
            <stop offset="50%" className="text-white" style={{ stopColor: category === 'Work' || category === 'Ideas' ? '#fef3c7' : '#ffffff' }} />
            <stop offset="100%" className="text-yellow-500" style={{ stopColor: category === 'Work' || category === 'Ideas' ? '#eab308' : '#9ca3af' }} />
          </linearGradient>
          {/* Inner fill gradient */}
          <linearGradient id={`fill-${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{
              stopColor:
                category === 'Work' ? '#3b82f6' :
                  category === 'Learning' ? '#10b981' :
                    category === 'Health' ? '#f97316' :
                      category === 'Ideas' ? '#ec4899' : '#a855f7'
            }} />
            <stop offset="100%" style={{
              stopColor:
                category === 'Work' ? '#1d4ed8' :
                  category === 'Learning' ? '#047857' :
                    category === 'Health' ? '#dc2626' :
                      category === 'Ideas' ? '#be185d' : '#7c3aed'
            }} />
          </linearGradient>
        </defs>

        {/* Outer hexagon (rim) */}
        <polygon
          points="50,2 93,25 93,75 50,98 7,75 7,25"
          fill={`url(#rim-${category})`}
          className="drop-shadow-md"
        />

        {/* Inner hexagon (fill) */}
        <polygon
          points="50,8 87,28 87,72 50,92 13,72 13,28"
          fill={`url(#fill-${category})`}
        />

        {/* Shine effect */}
        <polygon
          points="50,8 87,28 87,50 50,50 13,50 13,28"
          fill="rgba(255,255,255,0.15)"
        />
      </svg>

      {/* Icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-lg">
        {config.icon}
      </div>
    </div>
  );
};

// ===================== TASK CARD =====================
const TaskCard = ({ task }) => {
  const daysLeft = getDaysLeft(task.due_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-start gap-3 mb-3">
        <CategoryBadge3D category={task.category} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{formatDate(task.due_date)}</p>
          <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
          <p className="text-sm text-gray-500">{task.category}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-700">{task.progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${task.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        {daysLeft !== null && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${daysLeft < 0 ? 'bg-red-100 text-red-600' :
            daysLeft <= 3 ? 'bg-red-50 text-red-600' :
              daysLeft <= 7 ? 'bg-yellow-50 text-yellow-600' :
                'bg-green-50 text-green-600'
            }`}>
            {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ===================== TASKS PROGRESS =====================
const TasksProgress = ({ tasks }) => {
  const weekDays = getWeekDays();
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const chartData = useMemo(() => {
    return weekDays.map(dateStr => {
      const count = tasks.filter(t => {
        if (!t.completed_at) return false;
        return t.completed_at.startsWith(dateStr);
      }).length;
      return { date: dateStr, value: count, label: dayLabels[new Date(dateStr).getDay()] };
    });
  }, [tasks, weekDays]);

  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const completedTasks = tasks.filter(t => t.completed);
  const totalTimeSpent = completedTasks.reduce((sum, t) => sum + (t.pomodoro_minutes || 0), 0);
  const hoursSpent = Math.round(totalTimeSpent / 60 * 10) / 10;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Tasks Progress</h3>
        <span className="text-sm text-gray-400">Last 7 days</span>
      </div>

      <div className="flex items-end justify-between gap-2 h-32 mb-4">
        {chartData.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              className={`w-full rounded-t ${item.value > 0 ? 'bg-purple-500' : 'bg-gray-200'}`}
              style={{ minHeight: item.value > 0 ? '8px' : '4px' }}
              initial={{ height: 0 }}
              animate={{ height: item.value > 0 ? `${(item.value / maxValue) * 100}%` : '4px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-sm text-gray-600">Time spent</span>
          </div>
          <span className="font-semibold text-gray-900">{hoursSpent}h</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600">Tasks Completed</span>
          </div>
          <span className="font-semibold text-gray-900">{completedTasks.length}</span>
        </div>
      </div>
    </div>
  );
};

// ===================== COMPLETED TODAY =====================
const CompletedToday = ({ tasks }) => {
  const today = new Date().toISOString().split('T')[0];

  const completedToday = useMemo(() => {
    return tasks.filter(t => {
      if (!t.completed || !t.completed_at) return false;
      return t.completed_at.startsWith(today);
    });
  }, [tasks, today]);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 col-span-2 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-500" />
          Completed Today
          <span className="text-gray-400 font-normal">({completedToday.length})</span>
        </h3>
      </div>

      {completedToday.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">No tasks completed yet today</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {completedToday.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100"
            >
              <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-700 truncate line-through">{task.title}</p>
                <p className="text-xs text-gray-400">{task.category} • {task.pomodoro_minutes}m</p>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                Done ✓
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===================== ASSIGNMENTS LIST =====================
const Assignments = ({ tasks, onToggleComplete, onDelete }) => {
  const completed = tasks.filter(t => t.completed).length;
  const incompleteTasks = tasks.filter(t => !t.completed);
  const progressPercent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const today = new Date().toISOString().split('T')[0];

  // Check if task is due today
  const isDueToday = (dueDateStr) => {
    if (!dueDateStr) return false;
    return dueDateStr.split('T')[0] === today;
  };

  // Check if task is overdue
  const isOverdue = (dueDateStr) => {
    if (!dueDateStr) return false;
    const dueDate = new Date(dueDateStr.split('T')[0]);
    const todayDate = new Date(today);
    return dueDate < todayDate;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header with Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">
            Assignments <span className="text-gray-400 font-normal">({tasks.length})</span>
          </h3>
          <span className="text-sm text-gray-500">{completed}/{tasks.length} done</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{progressPercent}% complete</p>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {incompleteTasks.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">All tasks completed! 🎉</p>
        ) : (
          incompleteTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${isOverdue(task.due_date)
                ? 'border-rose-200 bg-rose-50/50'
                : isDueToday(task.due_date)
                  ? 'border-amber-200 bg-amber-50/50'
                  : 'border-gray-100 hover:border-purple-200'
                }`}
            >
              <button onClick={() => onToggleComplete(task.id)} className="flex-shrink-0">
                <Circle className="text-gray-300 hover:text-purple-400" size={20} />
              </button>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-700 truncate">{task.title}</p>
                <p className="text-xs text-gray-400">{task.category} • {task.progress}%</p>
              </div>

              {/* Urgency Badges */}
              {isOverdue(task.due_date) && (
                <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-600 flex-shrink-0">
                  Overdue
                </span>
              )}
              {isDueToday(task.due_date) && !isOverdue(task.due_date) && (
                <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 flex-shrink-0">
                  Due Today
                </span>
              )}

              <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// ===================== ADD TASK MODAL =====================
const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [pomodoro, setPomodoro] = useState(25);
  const [dueDate, setDueDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Default to 7 days from now
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDueDate(d.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    await onAddTask(title, pomodoro, dueDate, startTime || null);
    setTitle('');
    setStartTime('');
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Task</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pomodoro</label>
              <div className="flex gap-2">
                {[15, 25, 45, 60].map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setPomodoro(min)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${pomodoro === min ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {min}m
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium disabled:opacity-50 transition-all"
            >
              {isLoading ? '⏳' : <Plus size={18} />}
              Add Task
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ===================== SETTINGS PAGE =====================
const SettingsPage = ({ username, setUsername }) => {
  const [name, setName] = useState(username);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUsername(name);
    localStorage.setItem('taskify_username', name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your account settings</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all"
          >
            <Save size={18} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ===================== MAIN APP =====================
function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [username, setUsername] = useState(() => localStorage.getItem('taskify_username') || 'User');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error('Failed');
      setTasks(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title, pomodoroMinutes, dueDate, startTime) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          pomodoro_minutes: pomodoroMinutes,
          due_date: dueDate,
          start_time: startTime
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/complete`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter tasks for today's cards (incomplete, sorted by due date)
  const activeTasks = useMemo(() => {
    return tasks
      .filter(t => !t.completed)
      .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))
      .slice(0, 3);
  }, [tasks]);

  // Settings Page
  if (activePage === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50 grid grid-cols-12">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="col-span-10 p-8">
          <SettingsPage username={username} setUsername={setUsername} />
        </main>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-12">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="col-span-7 p-8 overflow-y-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hi, {username} 👋</h1>
          <p className="text-gray-500">Let's finish your task today!</p>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Today Task</h2>
              <p className="text-gray-500 text-sm">Check your daily tasks and schedules</p>
            </div>
            {/* ADD NEW TASK BUTTON - PRIMARY */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
            >
              <Plus size={18} />
              Add New Task
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 text-gray-400 text-center py-8">Loading...</div>
            ) : activeTasks.length === 0 ? (
              <div className="col-span-3 bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <p className="text-gray-400">No active tasks. Add your first task!</p>
              </div>
            ) : (
              activeTasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <TasksProgress tasks={tasks} />
          <Assignments tasks={tasks} onToggleComplete={toggleComplete} onDelete={deleteTask} />
        </div>

        <CompletedToday tasks={tasks} />
      </main>

      <aside className="col-span-3 p-6 space-y-4 h-screen sticky top-0 overflow-y-auto">
        <ProfileCard username={username} />
        <MonthlyCalendar
          tasks={tasks}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onAddTask={() => setIsModalOpen(true)}
        />
        <ScheduledTasks tasks={tasks} selectedDate={selectedDate} />
      </aside>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={addTask} />
    </div>
  );
}

export default App;

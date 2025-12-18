import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Calendar = ({ tasks, onAddTask }) => {
    const [currentDate] = useState(new Date());

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Get current week dates
    const getWeekDates = () => {
        const today = currentDate.getDate();
        const dayOfWeek = currentDate.getDay();
        const monday = today - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

        return Array.from({ length: 7 }, (_, i) => monday + i);
    };

    const weekDates = getWeekDates();
    const todayDate = currentDate.getDate();

    return (
        <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                    {months[currentDate.getMonth()]}
                </h3>
                <button
                    onClick={onAddTask}
                    className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                    <Plus size={16} />
                    Add Task
                </button>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map((day) => (
                    <div key={day} className="text-center text-xs text-gray-400 font-medium">
                        {day}
                    </div>
                ))}
            </div>

            {/* Week dates */}
            <div className="grid grid-cols-7 gap-1">
                {weekDates.map((date, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${date === todayDate ? 'today' : ''}`}
                    >
                        {date}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;

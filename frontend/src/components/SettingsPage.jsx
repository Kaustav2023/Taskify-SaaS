import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

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

            <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Profile Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                        <p className="text-sm text-gray-400 mt-1">
                            This name will appear in your dashboard greeting
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Save size={18} />
                        {saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="card p-6 mt-6">
                <h2 className="font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 text-sm">
                    Taskify - AI-Powered Task Management with Pomodoro Timer
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    Built with FastAPI + React + Gemini AI
                </p>
            </div>
        </div>
    );
};

export default SettingsPage;

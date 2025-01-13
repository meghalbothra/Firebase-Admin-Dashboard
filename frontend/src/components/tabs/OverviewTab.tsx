
import { ActivityChart } from '../charts/ActivityChart';

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">User Activity</h3>
        <ActivityChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Recent Updates</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <div>
                  <p className="text-sm text-gray-600">System update completed</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-left bg-indigo-50 rounded-lg hover:bg-indigo-100">
              <p className="font-medium text-indigo-700">Add User</p>
              <p className="text-sm text-indigo-600">Create new account</p>
            </button>
            <button className="p-4 text-left bg-purple-50 rounded-lg hover:bg-purple-100">
              <p className="font-medium text-purple-700">Generate Report</p>
              <p className="text-sm text-purple-600">Download PDF</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { ArrowUp, ArrowDown, Clock, Activity } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const db = getFirestore();

// Card Components
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white shadow-lg rounded-lg p-4">{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between pb-2">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-medium text-gray-500">{children}</h3>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="pt-4">{children}</div>
);

export const PerformanceMetrics = () => {
  const [totalCalls, setTotalCalls] = useState(0);
  const [failedCalls, setFailedCalls] = useState(0);
  const [successfulCalls, setSuccessfulCalls] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [avgResponseTime, setAvgResponseTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsDocRef = doc(db, "apiMetrics", "login-metrics");
        const docSnapshot = await getDoc(metricsDocRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setTotalCalls(data?.totalCalls || 0);
          setFailedCalls(data?.failedCalls || 0);
          setSuccessfulCalls(data?.totalCalls - data?.failedCalls || 0);
          const last10Times = data?.responseTimes?.slice(-10) || [];
          setResponseTimes(last10Times);

          if (data?.responseTimes?.length) {
            const totalResponseTime = data.responseTimes.reduce((sum: number, time: number) => sum + time, 0);
            setAvgResponseTime(totalResponseTime / data.responseTimes.length);
          }
        }
      } catch (error) {
        console.error("Error fetching API metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  const apiCallPieChartData = {
    labels: ["Successful Calls", "Failed Calls"],
    datasets: [{
      data: [successfulCalls, failedCalls],
      backgroundColor: ["#22c55e", "#ef4444"],
      hoverBackgroundColor: ["#16a34a", "#dc2626"],
      borderWidth: 0
    }]
  };

  const responseTimeLineChartData = {
    labels: responseTimes.map((_, index) => `Call ${index + 1}`),
    datasets: [{
      label: "Response Time (ms)",
      data: responseTimes,
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      pointBorderColor: "#2563eb",
      tension: 0.4,
      fill: true
    }]
  };

  const getSuccessRate = () => {
    if (totalCalls === 0) return 0;
    return ((successfulCalls / totalCalls) * 100).toFixed(1);
  };

  return (
    <div className="space-y-8 p-8 max-w-8xl">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">API Performance Dashboard</h2>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span className="font-medium">Success Rate: {getSuccessRate()}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Calls</CardTitle>
            <Activity className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalCalls.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Successful</CardTitle>
            <ArrowUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successfulCalls.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed</CardTitle>
            <ArrowDown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedCalls.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Response</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {avgResponseTime ? `${avgResponseTime.toFixed(1)}ms` : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] flex justify-center">
              <Pie data={apiCallPieChartData} options={{
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                },
                maintainAspectRatio: false
              }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <Line data={responseTimeLineChartData} options={{
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                maintainAspectRatio: false
              }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetrics;

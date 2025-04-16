import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificateAPI } from '../../services/api';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FiUsers, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// StatCard component with more compact design
const StatCard = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="bg-white rounded shadow p-3">
      <div className="flex items-center">
        <div className={`rounded-full p-2 ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className="ml-2">
          <h3 className="text-xs font-medium text-gray-500">{title}</h3>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    statusDistribution: [],
    certificateTypeDistribution: [],
    dailyTrends: []
  });
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await certificateAPI.getAll();
      const applications = response.data;

      // Calculate status statistics
      const statistics = applications.reduce((acc, app) => {
        acc.total++;
        acc[app.status]++;
        
        // Track certificate types
        const typeIndex = acc.certificateTypeDistribution.findIndex(
          item => item.type === app.certificateType
        );
        
        if (typeIndex >= 0) {
          acc.certificateTypeDistribution[typeIndex].count++;
        } else {
          acc.certificateTypeDistribution.push({
            type: app.certificateType,
            count: 1
          });
        }
        
        // Track application dates for trends
        const dateStr = new Date(app.applicationDate).toLocaleDateString();
        const dateIndex = acc.dailyTrends.findIndex(item => item.date === dateStr);
        
        if (dateIndex >= 0) {
          acc.dailyTrends[dateIndex].count++;
        } else {
          acc.dailyTrends.push({
            date: dateStr,
            count: 1
          });
        }
        
        return acc;
      }, { 
        total: 0, 
        pending: 0, 
        approved: 0, 
        rejected: 0,
        certificateTypeDistribution: [],
        dailyTrends: []
      });
      
      // Create status distribution array for pie chart
      statistics.statusDistribution = [
        { status: 'Pending', count: statistics.pending },
        { status: 'Approved', count: statistics.approved },
        { status: 'Rejected', count: statistics.rejected }
      ];

      setStats(statistics);
      
      // Get recent applications (last 5)
      setRecentApplications(applications.slice(0, 5));
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to get status count
  const getStatusCount = (status) => {
    return stats[status] || 0;
  };
  
  // Chart configurations with smaller size options
  const statusDistributionConfig = {
    data: {
      labels: stats.statusDistribution.map(item => item.status),
      datasets: [
        {
          data: stats.statusDistribution.map(item => item.count),
          backgroundColor: [
            'rgba(255, 206, 86, 0.6)',  // Pending - Yellow
            'rgba(75, 192, 192, 0.6)',  // Approved - Green
            'rgba(255, 99, 132, 0.6)'   // Rejected - Red
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      maintainAspectRatio: true,
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 10,
            font: {
              size: 10
            }
          }
        },
        title: {
          display: true,
          text: 'Status Distribution',
          font: {
            size: 12
          }
        }
      }
    }
  };
  
  const dailyTrendsConfig = {
    data: {
      labels: stats.dailyTrends.map(item => item.date),
      datasets: [
        {
          label: 'Applications',
          data: stats.dailyTrends.map(item => item.count),
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.4
        }
      ]
    },
    options: {
      maintainAspectRatio: true,
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Daily Trends',
          font: {
            size: 12
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            font: {
              size: 9
            }
          }
        },
        x: {
          ticks: {
            font: {
              size: 9
            }
          }
        }
      }
    }
  };
  
  const certificateTypeConfig = {
    data: {
      labels: stats.certificateTypeDistribution.map(item => item.type),
      datasets: [
        {
          label: 'Applications',
          data: stats.certificateTypeDistribution.map(item => item.count),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      maintainAspectRatio: true,
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Certificate Types',
          font: {
            size: 12
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            font: {
              size: 9
            }
          }
        },
        x: {
          ticks: {
            font: {
              size: 9
            }
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
        <div className="flex items-center">
          <FiXCircle className="text-red-500 mr-2 h-4 w-4" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-full">
      <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards - More compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={FiUsers}
          title="Total"
          value={stats.total}
          color="text-blue-600"
        />
        <StatCard
          icon={FiCheckCircle}
          title="Approved"
          value={getStatusCount('approved')}
          color="text-green-600"
        />
        <StatCard
          icon={FiXCircle}
          title="Rejected"
          value={getStatusCount('rejected')}
          color="text-red-600"
        />
        <StatCard
          icon={FiClock}
          title="Pending"
          value={getStatusCount('pending')}
          color="text-yellow-600"
        />
      </div>

      {/* Charts - More compact layout with 3 in a row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded shadow p-3 h-64">
          <h2 className="text-sm font-semibold mb-2">Daily Application Trends</h2>
          <div className="h-56">
            <Line data={dailyTrendsConfig.data} options={dailyTrendsConfig.options} />
          </div>
        </div>
        <div className="bg-white rounded shadow p-3 h-64">
          <h2 className="text-sm font-semibold mb-2">Status Distribution</h2>
          <div className="h-56">
            <Pie data={statusDistributionConfig.data} options={statusDistributionConfig.options} />
          </div>
        </div>
        <div className="bg-white rounded shadow p-3 h-64">
          <h2 className="text-sm font-semibold mb-2">Certificate Types</h2>
          <div className="h-56">
            <Bar data={certificateTypeConfig.data} options={certificateTypeConfig.options} />
          </div>
        </div>
      </div>

      {/* Recent Applications - Compact table */}
      <div className="bg-white rounded shadow p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold">Recent Applications</h2>
          <Link
            to="/admin/applications"
            className="text-primary-600 hover:text-primary-700 text-xs"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentApplications.map((application) => (
                <tr key={application._id}>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {application._id.slice(-6)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {application.certificateType}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {application.applicant?.name || 'N/A'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {new Date(application.applicationDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
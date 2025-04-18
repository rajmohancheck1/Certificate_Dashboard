import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { certificateAPI } from '../../services/api';
import { Line, Pie, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiFilter, FiDownload, FiRefreshCw, FiCalendar, FiMap } from 'react-icons/fi';
import ApplicationManagement from './ApplicationManagement';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// StatCard component with more compact design
const StatCard = ({ icon: Icon, title, value, color, percentChange }) => {
  return (
    <div className="bg-white rounded shadow p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`rounded-full p-2 ${color.replace('text-', 'bg-').replace('600', '100')}`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className="ml-2">
            <h3 className="text-xs font-medium text-gray-500">{title}</h3>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        </div>
        {percentChange !== undefined && (
          <div className={`text-xs font-medium ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {percentChange >= 0 ? '+' : ''}{percentChange}%
          </div>
        )}
      </div>
    </div>
  );
};


// Custom dropdown selector component
const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-gray-500 mb-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

// Date range picker component
const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Polling interval in milliseconds
  const POLLING_INTERVAL = 10000; // 10 seconds
  
  // Filter states
  const [timeRange, setTimeRange] = useState('all');
  const [certificateTypeFilter, setCertificateTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subdivisionFilter, setSubdivisionFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Chart view states
  const [statusChartType, setStatusChartType] = useState('pie');
  const [trendChartType, setTrendChartType] = useState('line');
  
  // Data states
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    percentChange: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    },
    statusDistribution: [],
    certificateTypeDistribution: [],
    subdivisionDistribution: [],
    dailyTrends: [],
    monthlyTrends: []
  });
  const [recentApplications, setRecentApplications] = useState([]);
  
  // List of all certificate types and subdivisions
  const [certificateTypes, setCertificateTypes] = useState([]);
  const [subdivisions, setSubdivisions] = useState([]);
  
  // Refs for polling and socket connection
  const pollingIntervalRef = useRef(null);
  const socketRef = useRef(null);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    
    // Setup automatic polling
    setupPolling();
    
    // Setup WebSocket connection if available
    setupWebSocket();
    
    // Cleanup on component unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  // Apply filters whenever data or filter settings change
  useEffect(() => {
    applyFilters();
  }, [allData, timeRange, certificateTypeFilter, statusFilter, subdivisionFilter, startDate, endDate]);
  
  // Setup polling for data updates
  const setupPolling = () => {
    pollingIntervalRef.current = setInterval(() => {
      fetchDashboardData(false); // Pass false to indicate it's not a manual refresh
    }, POLLING_INTERVAL);
  };
  
  // Setup WebSocket connection if available
  const setupWebSocket = () => {
    // This is a placeholder for WebSocket implementation
    // Actual implementation depends on your backend WebSocket service
    
    try {
      // Example WebSocket connection
      // const socket = new WebSocket('ws://your-backend-url/certificates');
      // socketRef.current = socket;
      
      // socket.onopen = () => {
      //   console.log('WebSocket connected');
      // };
      
      // socket.onmessage = (event) => {
      //   const data = JSON.parse(event.data);
      //   if (data.type === 'CERTIFICATE_UPDATED') {
      //     // Fetch latest data when certificates are updated
      //     fetchDashboardData(false);
      //   }
      // };
      
      // socket.onerror = (error) => {
      //   console.error('WebSocket error:', error);
      //   // Fall back to polling if WebSocket fails
      //   if (!pollingIntervalRef.current) {
      //     setupPolling();
      //   }
      // };
      
      // socket.onclose = () => {
      //   console.log('WebSocket connection closed');
      //   // Fall back to polling if WebSocket is closed
      //   if (!pollingIntervalRef.current) {
      //     setupPolling();
      //   }
      // };
    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
      // Ensure polling is active if WebSocket setup fails
      if (!pollingIntervalRef.current) {
        setupPolling();
      }
    }
  };

  const fetchDashboardData = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      
      const response = await certificateAPI.getAll();
      const applications = response.data;
      
      // Check if data has actually changed to avoid unnecessary updates
      if (JSON.stringify(applications) !== JSON.stringify(allData)) {
        // Set all data
        setAllData(applications);
        
        // Extract unique certificate types and subdivisions
        const uniqueCertificateTypes = [...new Set(applications.map(app => app.certificateType))];
        const uniqueSubdivisions = [...new Set(applications.map(app => app.subdivision))];
        
        setCertificateTypes(uniqueCertificateTypes);
        setSubdivisions(uniqueSubdivisions);
        
        // Initialize dates if empty
        if (!startDate) {
          // Set default start date to 30 days ago
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
        }
        
        if (!endDate) {
          // Set default end date to today
          setEndDate(new Date().toISOString().split('T')[0]);
        }
      }
      
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
    }
  };

  const applyFilters = () => {
    if (!allData.length) return;
    
    let filtered = [...allData];
    
    // Apply certificate type filter
    if (certificateTypeFilter !== 'all') {
      filtered = filtered.filter(app => app.certificateType === certificateTypeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Apply subdivision filter
    if (subdivisionFilter !== 'all') {
      filtered = filtered.filter(app => app.subdivision === subdivisionFilter);
    }
    
    // Apply date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include the entire end day
      
      filtered = filtered.filter(app => {
        const appDate = new Date(app.applicationDate);
        return appDate >= start && appDate <= end;
      });
    }
    
    // Apply time range preset filter
    if (timeRange !== 'all' && timeRange !== 'custom') {
      const now = new Date();
      let rangeStart;
      
      switch (timeRange) {
        case 'today':
          rangeStart = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          rangeStart = new Date(now);
          rangeStart.setDate(now.getDate() - 7);
          break;
        case 'month':
          rangeStart = new Date(now);
          rangeStart.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          rangeStart = new Date(now);
          rangeStart.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          rangeStart = new Date(now);
          rangeStart.setFullYear(now.getFullYear() - 1);
          break;
        default:
          rangeStart = null;
      }
      
      if (rangeStart) {
        filtered = filtered.filter(app => new Date(app.applicationDate) >= rangeStart);
      }
    }
    
    setFilteredData(filtered);
    updateStats(filtered);
  };
  
  const updateStats = (data) => {
    // Calculate previous period data for percent change
    const currentPeriodEnd = new Date(endDate || new Date());
    const currentPeriodLength = startDate ? 
      (currentPeriodEnd - new Date(startDate)) : 
      (timeRange === 'week' ? 7 * 24 * 60 * 60 * 1000 : 
       timeRange === 'month' ? 30 * 24 * 60 * 60 * 1000 : 
       timeRange === 'quarter' ? 90 * 24 * 60 * 60 * 1000 : 
       timeRange === 'year' ? 365 * 24 * 60 * 60 * 1000 : 0);
    
    const previousPeriodStart = new Date(startDate || new Date());
    previousPeriodStart.setTime(previousPeriodStart.getTime() - currentPeriodLength);
    
    const previousPeriodEnd = new Date(startDate || new Date());
    previousPeriodEnd.setTime(previousPeriodEnd.getTime() - 1); // 1ms before current period
    
    const previousPeriodData = allData.filter(app => {
      const appDate = new Date(app.applicationDate);
      return appDate >= previousPeriodStart && appDate <= previousPeriodEnd;
    });
    
    // Calculate base statistics
    const currentStats = data.reduce((acc, app) => {
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
      
      // Track subdivisions
      const subdivisionIndex = acc.subdivisionDistribution.findIndex(
        item => item.subdivision === app.subdivision
      );
      
      if (subdivisionIndex >= 0) {
        acc.subdivisionDistribution[subdivisionIndex].count++;
      } else {
        acc.subdivisionDistribution.push({
          subdivision: app.subdivision,
          count: 1
        });
      }
      
      // Track application dates for daily trends
      const dateStr = new Date(app.applicationDate).toLocaleDateString();
      const dateIndex = acc.dailyTrends.findIndex(item => item.date === dateStr);
      
      if (dateIndex >= 0) {
        acc.dailyTrends[dateIndex].count++;
        
        // Also track status counts per day
        const statusKey = `${app.status}Count`;
        acc.dailyTrends[dateIndex][statusKey] = (acc.dailyTrends[dateIndex][statusKey] || 0) + 1;
      } else {
        const newEntry = {
          date: dateStr,
          count: 1,
          pendingCount: 0,
          approvedCount: 0,
          rejectedCount: 0
        };
        newEntry[`${app.status}Count`] = 1;
        acc.dailyTrends.push(newEntry);
      }
      
      // Track monthly trends
      const monthStr = new Date(app.applicationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const monthIndex = acc.monthlyTrends.findIndex(item => item.month === monthStr);
      
      if (monthIndex >= 0) {
        acc.monthlyTrends[monthIndex].count++;
      } else {
        acc.monthlyTrends.push({
          month: monthStr,
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
      subdivisionDistribution: [],
      dailyTrends: [],
      monthlyTrends: []
    });
    
    // Previous period stats for calculating percent changes
    const prevStats = {
      total: previousPeriodData.length,
      pending: previousPeriodData.filter(app => app.status === 'pending').length,
      approved: previousPeriodData.filter(app => app.status === 'approved').length,
      rejected: previousPeriodData.filter(app => app.status === 'rejected').length
    };
    
    // Calculate percent changes
    const calculatePercentChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };
    
    currentStats.percentChange = {
      total: calculatePercentChange(currentStats.total, prevStats.total),
      pending: calculatePercentChange(currentStats.pending, prevStats.pending),
      approved: calculatePercentChange(currentStats.approved, prevStats.approved),
      rejected: calculatePercentChange(currentStats.rejected, prevStats.rejected)
    };
    
    // Create status distribution array for pie chart
    currentStats.statusDistribution = [
      { status: 'Pending', count: currentStats.pending },
      { status: 'Approved', count: currentStats.approved },
      { status: 'Rejected', count: currentStats.rejected }
    ];
    
    // Sort trends chronologically
    currentStats.dailyTrends.sort((a, b) => new Date(a.date) - new Date(b.date));
    currentStats.monthlyTrends.sort((a, b) => {
      const monthA = new Date(a.month);
      const monthB = new Date(b.month);
      return monthA - monthB;
    });
    
    setStats(currentStats);
    setRecentApplications(data.slice(0, 5));
  };
  
  const handleRefresh = () => {
    fetchDashboardData(true); // Pass true to show loading state during manual refresh
  };
  
  const handleExport = () => {
    // Convert filtered data to CSV
    const headers = ['ID', 'Type', 'Applicant', 'Status', 'Date', 'Subdivision'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(app => [
        app._id,
        app.certificateType,
        app.applicant?.name || 'N/A',
        app.status,
        new Date(app.applicationDate).toLocaleDateString(),
        app.subdivision
      ].join(','))
    ].join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `certificate-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to get status count
  const getStatusCount = (status) => {
    return stats[status] || 0;
  };
  
  // Chart configurations
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
  
  const trendChartConfig = {
    line: {
      data: {
        labels: stats.dailyTrends.map(item => item.date),
        datasets: [
          {
            label: 'Total Applications',
            data: stats.dailyTrends.map(item => item.count),
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.4
          },
          {
            label: 'Pending',
            data: stats.dailyTrends.map(item => item.pendingCount || 0),
            fill: false,
            borderColor: 'rgba(255, 206, 86, 1)',
            borderDash: [5, 5],
            tension: 0.4
          },
          {
            label: 'Approved',
            data: stats.dailyTrends.map(item => item.approvedCount || 0),
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderDash: [5, 5],
            tension: 0.4
          },
          {
            label: 'Rejected',
            data: stats.dailyTrends.map(item => item.rejectedCount || 0),
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 10,
              font: {
                size: 9
              }
            }
          },
          title: {
            display: true,
            text: 'Daily Application Trends',
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
                size: 8
              },
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    },
    bar: {
      data: {
        labels: stats.dailyTrends.map(item => item.date),
        datasets: [
          {
            label: 'Total Applications',
            data: stats.dailyTrends.map(item => item.count),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
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
            text: 'Daily Application Trends',
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
                size: 8
              },
              maxRotation: 45,
              minRotation: 45
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
          backgroundColor: [
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(201, 203, 207, 0.6)',
            'rgba(255, 99, 71, 0.6)',
            'rgba(50, 205, 50, 0.6)',
            'rgba(138, 43, 226, 0.6)',
            'rgba(210, 105, 30, 0.6)',
            'rgba(128, 0, 128, 0.6)'
          ],
          borderColor: [
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(255, 99, 71, 1)',
            'rgba(50, 205, 50, 1)',
            'rgba(138, 43, 226, 1)',
            'rgba(210, 105, 30, 1)',
            'rgba(128, 0, 128, 1)'
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
              size: 8
            },
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  };
  
  const subdivisionDistributionConfig = {
    data: {
      labels: stats.subdivisionDistribution.map(item => item.subdivision),
      datasets: [
        {
          label: 'Applications by Subdivision',
          data: stats.subdivisionDistribution.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 20,
            font: {
              size: 11
            },
            usePointStyle: true
          }
        },
        title: {
          display: true,
          text: 'Application Distribution by Subdivision',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          suggestedMin: 0,
          ticks: {
            stepSize: 1,
            precision: 0,
            backdropColor: 'transparent',
            color: '#666',
            font: {
              size: 9
            },
            showLabelBackdrop: false
          },
          pointLabels: {
            font: {
              size: 10,
              weight: '500'
            },
            color: '#444'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      elements: {
        line: {
          tension: 0.1
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  };

  // Status indicator component for real-time updates
  const RealtimeIndicator = () => {
    const [isOnline, setIsOnline] = useState(true);
    
    useEffect(() => {
      const checkConnection = () => {
        setIsOnline(navigator.onLine);
      };
      
      window.addEventListener('online', checkConnection);
      window.addEventListener('offline', checkConnection);
      
      return () => {
        window.removeEventListener('online', checkConnection);
        window.removeEventListener('offline', checkConnection);
      };
    }, []);
    
    return (
      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-xs text-gray-500">
          {isOnline ? 'Real-time updates active' : 'Offline mode'}
        </span>
      </div>
    );
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
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-gray-900">Interactive Dashboard</h1>
          <RealtimeIndicator />
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
           <FiRefreshCw className="h-4 w-4 mr-1" />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
          >
            <FiDownload className="h-4 w-4 mr-1" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Filters row */}
      <div className="bg-white p-3 rounded shadow">
        <div className="flex flex-wrap gap-3">
          <Dropdown 
            label="Time Range"
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'quarter', label: 'Last 90 Days' },
              { value: 'year', label: 'Last 365 Days' },
              //{ value: 'custom', label: 'Custom Range' }
            ]}
            value={timeRange}
            onChange={setTimeRange}
          />
          
          {/* {timeRange === 'custom' && (
            <DateRangePicker 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          )} */}
          
          <Dropdown 
            label="Certificate Type"
            options={[
              { value: 'all', label: 'All Types' },
              ...certificateTypes.map(type => ({ value: type, label: type }))
            ]}
            value={certificateTypeFilter}
            onChange={setCertificateTypeFilter}
          />
          <div className="min-w-[150px]">
          <Dropdown 
            label="Status"
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          </div>
          <div className="min-w-[150px]">
          <Dropdown 
            label="Subdivision"
            options={[
              { value: 'all', label: 'All Subdivisions' },
              ...subdivisions.map(subdivision => ({ value: subdivision, label: subdivision }))
            ]}
            value={subdivisionFilter}
            onChange={setSubdivisionFilter}
          />
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard 
          icon={FiUsers} 
          title="Total Applications" 
          value={stats.total} 
          color="text-blue-600"
          percentChange={stats.percentChange.total}
        />
        <StatCard 
          icon={FiClock} 
          title="Pending" 
          value={getStatusCount('pending')} 
          color="text-yellow-600"
          percentChange={stats.percentChange.pending}
        />
        <StatCard 
          icon={FiCheckCircle} 
          title="Approved" 
          value={getStatusCount('approved')} 
          color="text-green-600"
          percentChange={stats.percentChange.approved}
        />
        <StatCard 
          icon={FiXCircle} 
          title="Rejected" 
          value={getStatusCount('rejected')} 
          color="text-red-600"
          percentChange={stats.percentChange.rejected}
        />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Status Distribution Chart */}
        <div className="bg-white p-3 rounded shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-medium">Status Distribution</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setStatusChartType('pie')}
                className={`text-xs px-2 py-1 rounded ${statusChartType === 'pie' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                Pie
              </button>
              <button 
                onClick={() => setStatusChartType('doughnut')}
                className={`text-xs px-2 py-1 rounded ${statusChartType === 'doughnut' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                Doughnut
              </button>
            </div>
          </div>
          <div className="h-64">
            {statusChartType === 'pie' ? (
              <Pie data={statusDistributionConfig.data} options={statusDistributionConfig.options} />
            ) : (
              <Doughnut data={statusDistributionConfig.data} options={statusDistributionConfig.options} />
            )}
          </div>
        </div>
        
        {/* Application Trends Chart */}
        <div className="bg-white p-3 rounded shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-medium">Application Trends</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setTrendChartType('line')}
                className={`text-xs px-2 py-1 rounded ${trendChartType === 'line' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                Line
              </button>
              <button 
                onClick={() => setTrendChartType('bar')}
                className={`text-xs px-2 py-1 rounded ${trendChartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                Bar
              </button>
            </div>
          </div>
          <div className="h-64">
            {trendChartType === 'line' ? (
              <Line data={trendChartConfig.line.data} options={trendChartConfig.line.options} />
            ) : (
              <Bar data={trendChartConfig.bar.data} options={trendChartConfig.bar.options} />
            )}
          </div>
        </div>
      </div>
      
      {/* Second row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Certificate Type Distribution */}
        <div className="bg-white p-3 rounded shadow">
          <h2 className="text-sm font-medium mb-3">Certificate Type Distribution</h2>
          <div className="h-64">
            <Bar data={certificateTypeConfig.data} options={certificateTypeConfig.options} />
          </div>
        </div>
        
        {/* Subdivision Distribution */}
        <div className="bg-white p-3 rounded shadow">
          <h2 className="text-sm font-medium mb-3">Subdivision Distribution</h2>
          <div className="h-64">
            <Radar data={subdivisionDistributionConfig.data} options={subdivisionDistributionConfig.options} />
          </div>
        </div>
      </div>
      
      {/* Recent Applications Table */}
      {/* <div className="bg-white p-3 rounded shadow">
        <h2 className="text-sm font-medium mb-3">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdivision</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <tr key={app._id}>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">{app._id.substring(0, 8)}...</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">{app.certificateType}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">{app.applicant?.name || 'N/A'}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(app.applicationDate).toLocaleDateString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">{app.subdivision}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <Link 
                        to={`/applications/${app._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-3 py-2 text-center text-sm text-gray-500">
                    No applications found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
       */}

       <ApplicationManagement/>
      {/* Summary section */}
      {/* <div className="bg-white p-3 rounded shadow">
        <h2 className="text-sm font-medium mb-3">Summary</h2>
        <p className="text-xs text-gray-600">
          Showing {filteredData.length} of {allData.length} total applications.
          {timeRange !== 'all' && timeRange !== 'custom' && (
            <span> Filtered by last {
              timeRange === 'today' ? '24 hours' :
              timeRange === 'week' ? '7 days' :
              timeRange === 'month' ? '30 days' :
              timeRange === 'quarter' ? '90 days' : '365 days'
            }.</span>
          )}
          {timeRange === 'custom' && startDate && endDate && (
            <span> Filtered from {startDate} to {endDate}.</span>
          )}
          {certificateTypeFilter !== 'all' && (
            <span> Certificate type: {certificateTypeFilter}.</span>
          )}
          {statusFilter !== 'all' && (
            <span> Status: {statusFilter}.</span>
          )}
          {subdivisionFilter !== 'all' && (
            <span> Subdivision: {subdivisionFilter}.</span>
          )}
        </p>
      </div> */}
    </div>
  );
};

export default Dashboard;
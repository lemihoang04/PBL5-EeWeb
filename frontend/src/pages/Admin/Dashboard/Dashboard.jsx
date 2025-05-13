import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import { getDashboardStats } from "../../../services/adminService";
import {
  FaShoppingCart,
  FaDollarSign,
  FaCheckCircle,
  FaUndo,
  FaChartLine,
  FaUsers,
  FaBox,
  FaCalendarAlt
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


const Dashboard = ({ setActiveMenu }) => {
  // Stats for the top cards

  const [dataStats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);
  // Data for the sales chart
  const stats = [
    {
      value: dataStats.totalOrders,
      label: "Orders",
      color: "primary",
      icon: <FaShoppingCart />,
      growth: "+8.4%",
      period: "vs. last month"
    },
    {
      value: dataStats.totalRevenue,
      label: "Revenue",
      color: "success",
      icon: <FaDollarSign />,
      growth: "+5.3%",
      period: "vs. last month"
    },
    {
      value: dataStats.totalUsers,
      label: "Customers",
      color: "info",
      icon: <FaUsers />,
      growth: "+12.7%",
      period: "vs. last month"
    },
    {
      value: "435",
      label: "Returns",
      color: "warning",
      icon: <FaUndo />,
      growth: "-2.3%",
      period: "vs. last month",
      negative: true
    },
  ];
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [30000, 35000, 25000, 40000, 45000, 55000, 48000, 52000, 60000, 62000, 65000, 70000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '2025 Revenue Performance'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Data for the top products chart
  const topProductsData = {
    labels: ['Laptops', 'Graphics Cards', 'Processors', 'Memory', 'Motherboards'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for recent orders
  // const recentOrders = [
  //   { id: '#ORD-7243', customer: 'John Doe', date: 'May 6, 2025', status: 'Completed', total: '$1,240.00' },
  //   { id: '#ORD-7242', customer: 'Jane Smith', date: 'May 5, 2025', status: 'Processing', total: '$857.50' },
  //   { id: '#ORD-7241', customer: 'Robert Johnson', date: 'May 5, 2025', status: 'Completed', total: '$2,170.00' },
  //   { id: '#ORD-7240', customer: 'Emily Davis', date: 'May 4, 2025', status: 'Shipped', total: '$990.25' },
  //   { id: '#ORD-7239', customer: 'Michael Brown', date: 'May 4, 2025', status: 'Completed', total: '$1,450.75' },
  // ];
  const recentOrders = dataStats.recentOrders;

  // Data for customer activities
  const customerActivities = [
    { action: 'New account created', user: 'Thomas Wilson', time: '10 minutes ago' },
    { action: 'Placed an order', user: 'Sarah Johnson', time: '45 minutes ago' },
    { action: 'Submitted a review', user: 'Richard Davis', time: '1 hour ago' },
    { action: 'Started a return', user: 'Laura Thompson', time: '2 hours ago' },
    { action: 'Contacted support', user: 'Kevin Martin', time: '3 hours ago' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'canceled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="dashboard-title">Dashboard</h2>
          <div className="date-filter d-flex align-items-center">
            <FaCalendarAlt className="me-2" />
            <span>Today: May 6, 2025</span>
          </div>
        </div>
        <p className="text-muted">Welcome to your admin dashboard. Here's what's happening with your store today.</p>
      </div>

      {/* Stat cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6">
            <div className={`stat-card card border-0 shadow-sm`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="stat-label text-muted mb-1">{stat.label}</h6>
                    <h3 className="stat-value mb-1">{stat.value}</h3>
                    <div className={`stat-growth ${stat.negative ? 'text-danger' : 'text-success'}`}>
                      {stat.growth} <span className="period">{stat.period}</span>
                    </div>
                  </div>
                  <div className={`stat-icon-wrapper bg-${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title">Revenue Overview</h5>
            </div>
            <div className="card-body">
              <Line data={salesData} options={salesOptions} />
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title">Sales by Category</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <Doughnut
                data={topProductsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity row */}
      <div className="row g-4">
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title">Recent Orders</h5>
              <button className="btn btn-sm btn-outline-primary">View All</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
                        <tr key={index}>
                          <td><strong>{order.id}</strong></td>
                          <td>{order.user_name}</td>
                          <td>{order.created_at}</td>
                          <td>
                            <span className={`badge ${getStatusClass(order.status)}`}>{capitalizeFirstLetter(order.status)}</span>
                          </td>
                          <td className="text-end">{order.price}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-3">No recent orders available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title">Recent Activities</h5>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush activity-list">
                {customerActivities.map((activity, index) => (
                  <li key={index} className="list-group-item border-0 py-3">
                    <div className="d-flex">
                      <div className="activity-icon me-3">
                        <span className="avatar-initials">
                          {activity.user.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="mb-0"><strong>{activity.action}</strong></p>
                        <p className="mb-0">{activity.user}</p>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

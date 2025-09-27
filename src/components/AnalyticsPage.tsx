import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for analytics
const salesData = [
  { date: 'Sep 20', orders: 45, revenue: 8100, waste: 8 },
  { date: 'Sep 21', orders: 52, revenue: 9360, waste: 12 },
  { date: 'Sep 22', orders: 38, revenue: 6840, waste: 6 },
  { date: 'Sep 23', orders: 61, revenue: 10980, waste: 15 },
  { date: 'Sep 24', orders: 47, revenue: 8460, waste: 9 },
  { date: 'Sep 25', orders: 55, revenue: 9900, waste: 11 },
  { date: 'Sep 26', orders: 49, revenue: 8820, waste: 7 },
  { date: 'Sep 27', orders: 58, revenue: 10440, waste: 13 }
];

const mealPopularityData = [
  { name: 'Dal Chawal', orders: 156, percentage: 35 },
  { name: 'Chicken Biryani', orders: 134, percentage: 30 },
  { name: 'Special Thali', orders: 89, percentage: 20 },
  { name: 'Samosa Combo', orders: 67, percentage: 15 }
];

const wasteAnalysis = [
  { category: 'Overproduction', value: 40, color: '#ef4444' },
  { category: 'Customer Returns', value: 30, color: '#f97316' },
  { category: 'Quality Issues', value: 15, color: '#eab308' },
  { category: 'Spoilage', value: 15, color: '#84cc16' }
];

const customerSegments = [
  { segment: 'Regular (Daily)', count: 145, revenue: 87000, retention: 92 },
  { segment: 'Weekly', count: 78, revenue: 31200, retention: 85 },
  { segment: 'Occasional', count: 234, revenue: 46800, retention: 45 },
  { segment: 'New', count: 67, revenue: 10050, retention: 15 }
];

const deliveryGroups = [
  { group: 'A-1 to A-5', orders: 67, onTime: 94, avgTime: '28 min' },
  { group: 'A-6 to A-10', orders: 52, onTime: 89, avgTime: '32 min' },
  { group: 'B-1 to B-8', orders: 78, onTime: 96, avgTime: '25 min' },
  { group: 'B-9 to B-15', orders: 84, onTime: 91, avgTime: '30 min' },
  { group: 'C-1 to C-12', orders: 61, onTime: 87, avgTime: '35 min' }
];

interface AnalyticsPageProps {
  onNavigate: (page: string) => void;
}

export function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Calculate summary statistics
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalWaste = salesData.reduce((sum, day) => sum + day.waste, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const wastePercentage = Math.round((totalWaste / totalOrders) * 100);

  // AI Insights (mock predictions)
  const aiInsights = [
    {
      type: 'recommendation',
      title: 'Reduce Dal Chawal Production',
      description: 'Based on recent trends, reduce Dal Chawal by 15% tomorrow to minimize waste.',
      impact: '+₹1,200 savings',
      confidence: 87
    },
    {
      type: 'prediction',
      title: 'Weekend Demand Spike',
      description: 'Expect 25% increase in Biryani orders this weekend. Consider bulk preparation.',
      impact: '+₹3,500 revenue',
      confidence: 92
    },
    {
      type: 'alert',
      title: 'Group C Delivery Issues',
      description: 'Delivery times for Group C increased by 12%. Consider route optimization.',
      impact: 'Customer satisfaction risk',
      confidence: 95
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="pt-16 lg:pt-20 pb-20 lg:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('admin')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Analytics & Insights</h1>
                <p className="text-sm text-gray-600">Smart insights for better business decisions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <h3 className="text-2xl font-bold">{totalOrders}</h3>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+12%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <h3 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h3>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+18%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <h3 className="text-2xl font-bold">₹{avgOrderValue}</h3>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Waste %</p>
                  <h3 className="text-2xl font-bold">{wastePercentage}%</h3>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                    <span className="text-xs text-red-600">-3%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Waste</p>
                  <h3 className="text-2xl font-bold">{totalWaste}</h3>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">-8%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🤖 AI Insights & Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-white/30 text-white">
                      {insight.type}
                    </Badge>
                    <span className="text-xs">Confidence: {insight.confidence}%</span>
                  </div>
                  <h4 className="font-semibold mb-2">{insight.title}</h4>
                  <p className="text-sm text-purple-100 mb-2">{insight.description}</p>
                  <p className="text-sm font-medium text-yellow-200">{insight.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales & Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="orders" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Meal Popularity */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mealPopularityData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Waste Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={wasteAnalysis}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {wasteAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Waste Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Waste Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="waste" stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Customer Segments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Customer Segments Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Segment</th>
                    <th className="text-left py-3 px-4">Customers</th>
                    <th className="text-left py-3 px-4">Revenue</th>
                    <th className="text-left py-3 px-4">Retention Rate</th>
                    <th className="text-left py-3 px-4">Avg Revenue/Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {customerSegments.map((segment, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{segment.segment}</td>
                      <td className="py-3 px-4">{segment.count}</td>
                      <td className="py-3 px-4">₹{segment.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${segment.retention}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{segment.retention}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">₹{Math.round(segment.revenue / segment.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Group Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryGroups.map((group, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">{group.group}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Orders</span>
                      <span className="font-medium">{group.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">On-time %</span>
                      <span className={`font-medium ${group.onTime >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {group.onTime}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Time</span>
                      <span className="font-medium">{group.avgTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}

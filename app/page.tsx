"use client"

import { useState } from "react"
import { CustomerDashboard } from "../src/components/CustomerDashboard"
import { OrderPage } from "../src/components/OrderPage"
import { AdminDashboard } from "../src/components/AdminDashboard"
import { AnalyticsPage } from "../src/components/AnalyticsPage"
import { QRScanPage } from "../src/components/QRScanPage"
import { LoginPage } from "../src/components/LoginPage"
import { Navigation } from "../src/components/Navigation"
import { Button } from "../src/components/ui/button"
import { Card, CardContent } from "../src/components/ui/card"
import { Badge } from "../src/components/ui/badge"
import { Users, Crown, LogIn } from "lucide-react"

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("welcome")
  const [userType, setUserType] = useState<"customer" | "admin">("customer")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const handleNavigation = (page: string) => {
    setCurrentPage(page)
  }

  const handleUserTypeSelect = (type: "customer" | "admin") => {
    setUserType(type)
    setCurrentPage("login")
  }

  const handleLogin = (userType: "customer" | "admin", userData: any) => {
    setUserType(userType)
    setUserData(userData)
    setIsAuthenticated(true)
    if (userType === "customer") {
      setCurrentPage("dashboard")
    } else {
      setCurrentPage("admin")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserData(null)
    setCurrentPage("welcome")
  }

  const handleBackToWelcome = () => {
    setCurrentPage("welcome")
  }

  // Welcome/User Selection Screen
  if (currentPage === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Branding */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🍱</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TiffinExpress</h1>
            <p className="text-gray-600">Fresh meals delivered daily</p>
          </div>

          {/* User Type Selection */}
          <div className="space-y-4">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-orange-300"
              onClick={() => handleUserTypeSelect("customer")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Portal</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Browse menu, place orders, and manage your meal subscriptions
                </p>
                <div className="flex justify-center space-x-2">
                  <Badge variant="secondary">Order Meals</Badge>
                  <Badge variant="secondary">Track Delivery</Badge>
                  <Badge variant="secondary">Manage Plans</Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-blue-300"
              onClick={() => handleUserTypeSelect("admin")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Manage orders, menu items, analytics, and QR scanning operations
                </p>
                <div className="flex justify-center space-x-2">
                  <Badge variant="secondary">Manage Orders</Badge>
                  <Badge variant="secondary">Analytics</Badge>
                  <Badge variant="secondary">QR Scanning</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold text-center mb-3">Platform Features</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>AI Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>QR Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Smart Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Waste Reduction</span>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Or continue as guest</p>
            <Button
              variant="outline"
              onClick={() => setCurrentPage("login")}
              className="text-gray-700 hover:text-gray-900"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In / Sign Up
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Login Page
  if (currentPage === "login") {
    return <LoginPage userType={userType} onLogin={handleLogin} onBack={handleBackToWelcome} />
  }

  // Render appropriate page based on current navigation
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <CustomerDashboard onNavigate={handleNavigation} />
      case "orders":
        return <OrderPage onNavigate={handleNavigation} />
      case "admin":
        return <AdminDashboard onNavigate={handleNavigation} />
      case "analytics":
        return <AnalyticsPage onNavigate={handleNavigation} />
      case "qr-scan":
        return <QRScanPage onNavigate={handleNavigation} />
      case "notifications":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="pt-16 lg:pt-20 pb-20 lg:pb-4 px-4">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔔</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No new notifications</h3>
                      <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      case "profile":
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="pt-16 lg:pt-20 pb-20 lg:pb-4 px-4">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
                      <p className="text-gray-600 mb-4">
                        Manage your account, delivery preferences, and subscription plans.
                      </p>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-700">
                          <strong>Name:</strong> {userData?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Email:</strong> {userData?.email || "user@tiffinexpress.com"}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Account Type:</strong> <span className="capitalize">{userType}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
            <div className="pt-16 lg:pt-20 pb-20 lg:pb-4 px-4">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-8 h-8 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Settings</h3>
                      <p className="text-gray-600 mb-4">Configure your preferences and system settings.</p>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      default:
        return <CustomerDashboard onNavigate={handleNavigation} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - only show when authenticated */}
      {isAuthenticated && currentPage !== "welcome" && currentPage !== "login" && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigation}
          userType={userType}
          userData={userData}
          onLogout={handleLogout}
        />
      )}

      {renderPage()}
    </div>
  )
}

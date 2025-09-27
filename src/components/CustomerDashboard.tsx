"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Bell, MapPin, Calendar, ShoppingCart, Star, Clock, Users } from "lucide-react"
import { Switch } from "./ui/switch"
import { createClient } from "../../lib/supabase/client"
import type { MenuItem, Notification } from "../../lib/supabase/types"

interface CustomerDashboardProps {
  onNavigate: (page: string) => void
}

export function CustomerDashboard({ onNavigate }: CustomerDashboardProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [cartItems, setCartItems] = useState<string[]>([])
  const [todayMealConfirmed, setTodayMealConfirmed] = useState(true)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadData()

    // Subscribe to real-time changes for menu items
    const menuSubscription = supabase
      .channel("customer_menu_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, (payload) => {
        console.log("[v0] Customer menu change detected:", payload)
        loadData() // Reload data when changes occur
      })
      .subscribe()

    // Subscribe to real-time changes for notifications
    const notificationsSubscription = supabase
      .channel("customer_notifications_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, (payload) => {
        console.log("[v0] Customer notifications change detected:", payload)
        loadData() // Reload data when changes occur
      })
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      menuSubscription.unsubscribe()
      notificationsSubscription.unsubscribe()
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load available menu items
      const { data: menuData, error: menuError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("available", true)
        .order("name")

      if (menuError) throw menuError
      setMenuItems(menuData || [])

      // Load recent notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      if (notificationsError) throw notificationsError
      setNotifications(notificationsData || [])

      console.log("[v0] Customer data loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading customer data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (mealId: string) => {
    setCartItems((prev) => [...prev, mealId])
    console.log("[v0] Added item to cart:", mealId)
  }

  const getDietaryColor = (dietary: string) => {
    switch (dietary) {
      case "vegetarian":
        return "bg-green-100 text-green-800"
      case "vegan":
        return "bg-emerald-100 text-emerald-800"
      case "gluten-free":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "menu-update":
        return "bg-blue-50"
      case "delivery-alert":
        return "bg-green-50"
      case "promotion":
        return "bg-orange-50"
      default:
        return "bg-gray-50"
    }
  }

  const getNotificationDotColor = (type: string) => {
    switch (type) {
      case "menu-update":
        return "bg-blue-500"
      case "delivery-alert":
        return "bg-green-500"
      case "promotion":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="pt-16 lg:pt-20 pb-20 lg:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Today's Meal Status */}
          <Card className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Today's Meal</h3>
                  <p className="text-green-100">September 27, 2025</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm">Skip</span>
                  <Switch
                    checked={todayMealConfirmed}
                    onCheckedChange={setTodayMealConfirmed}
                    className="data-[state=checked]:bg-white"
                  />
                  <span className="text-sm">Confirm</span>
                </div>
              </div>
              {todayMealConfirmed && (
                <div className="mt-4 p-3 bg-white/20 rounded-lg">
                  <p className="text-sm">✓ Your meal is confirmed for today's delivery</p>
                  <p className="text-xs text-green-100 mt-1">Estimated delivery: 12:30 PM - 1:30 PM</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Header with Cart */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <Users className="w-4 h-4" />
                <span>Delivery Group B-12</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate("orders")} className="relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs bg-red-500">{cartItems.length}</Badge>
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate("profile")}>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold">Weekly Plan</h4>
                <p className="text-sm text-gray-600">Manage your meal schedule</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate("notifications")}
            >
              <CardContent className="p-4 text-center">
                <MapPin className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold">Track Delivery</h4>
                <p className="text-sm text-gray-600">See your meal's location</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate("orders")}>
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold">Order History</h4>
                <p className="text-sm text-gray-600">View past orders</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Menu */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Today's Menu</h2>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Fresh & Hot
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((meal) => (
                <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {meal.is_special && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-semibold">
                      🎉 FESTIVE SPECIAL
                    </div>
                  )}
                  <div className="relative">
                    <ImageWithFallback src={meal.image || ""} alt={meal.name} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-semibold">4.5</span>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                      <span className="text-lg font-bold text-green-600">₹{meal.price}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{meal.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>25 min</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {meal.dietary.map((diet, index) => (
                          <Badge key={index} variant="secondary" className={`text-xs ${getDietaryColor(diet)}`}>
                            {diet}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => addToCart(meal.id)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Recent Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${getNotificationColor(notification.type)}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationDotColor(notification.type)}`}></div>
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-sm text-gray-400">New updates will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

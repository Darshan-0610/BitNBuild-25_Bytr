"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  MapPin,
  Bell,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { createClient } from "../../lib/supabase/client"
import type { MenuItem, Order, Notification } from "../../lib/supabase/types"

interface AdminDashboardProps {
  onNavigate: (page: string) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<"orders" | "menu" | "notifications">("orders")
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "general" as "menu-update" | "delivery-alert" | "promotion" | "general",
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()

    // Subscribe to real-time changes for orders
    const ordersSubscription = supabase
      .channel("orders_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        console.log("[v0] Orders change detected:", payload)
        loadData() // Reload data when changes occur
      })
      .subscribe()

    // Subscribe to real-time changes for menu items
    const menuSubscription = supabase
      .channel("menu_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, (payload) => {
        console.log("[v0] Menu change detected:", payload)
        loadData() // Reload data when changes occur
      })
      .subscribe()

    // Subscribe to real-time changes for notifications
    const notificationsSubscription = supabase
      .channel("notifications_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, (payload) => {
        console.log("[v0] Notifications change detected:", payload)
        loadData() // Reload data when changes occur
      })
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      ordersSubscription.unsubscribe()
      menuSubscription.unsubscribe()
      notificationsSubscription.unsubscribe()
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (ordersError) throw ordersError
      setOrders(ordersData || [])

      // Load menu items
      const { data: menuData, error: menuError } = await supabase.from("menu_items").select("*").order("name")

      if (menuError) throw menuError
      setMenuItems(menuData || [])

      // Load notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (notificationsError) throw notificationsError
      setNotifications(notificationsData || [])
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "preparing":
        return <Package className="w-4 h-4" />
      case "ready":
        return <CheckCircle className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (error) throw error

      // Update local state
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      console.log("[v0] Order status updated successfully")
    } catch (error) {
      console.error("[v0] Error updating order status:", error)
    }
  }

  const toggleMenuItemAvailability = async (itemId: string) => {
    try {
      const item = menuItems.find((item) => item.id === itemId)
      if (!item) return

      const { error } = await supabase.from("menu_items").update({ available: !item.available }).eq("id", itemId)

      if (error) throw error

      // Update local state
      setMenuItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item)))

      console.log("[v0] Menu item availability updated successfully")
    } catch (error) {
      console.error("[v0] Error updating menu item availability:", error)
    }
  }

  const sendNotification = async () => {
    try {
      if (!notificationForm.title || !notificationForm.message) {
        alert("Please fill in both title and message")
        return
      }

      const { error } = await supabase.from("notifications").insert([
        {
          title: notificationForm.title,
          message: notificationForm.message,
          type: notificationForm.type,
        },
      ])

      if (error) throw error

      // Reset form
      setNotificationForm({
        title: "",
        message: "",
        type: "general",
      })

      // Reload notifications
      loadData()

      console.log("[v0] Notification sent successfully")
    } catch (error) {
      console.error("[v0] Error sending notification:", error)
    }
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

  // Summary stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    readyOrders: orders.filter((o) => o.status === "ready").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="pt-16 lg:pt-20 pb-20 lg:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-sm text-gray-600">Manage orders, menu, and operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => onNavigate("analytics")}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("notifications")}>
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <h3 className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</h3>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ready</p>
                    <h3 className="text-2xl font-bold text-green-600">{stats.readyOrders}</h3>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <h3 className="text-2xl font-bold text-indigo-600">₹{stats.totalRevenue}</h3>
                  </div>
                  <TrendingUp className="w-8 h-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </Button>
            <Button variant={activeTab === "menu" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("menu")}>
              Menu Management
            </Button>
            <Button
              variant={activeTab === "notifications" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </Button>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{order.customer_name}</h4>
                            <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.total}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Users className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-500">Group {order.delivery_group}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{order.delivery_time}</span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3 h-3" />
                            <span>{order.address}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium">Items:</p>
                          <p className="text-sm text-gray-600">
                            {order.items.map((item) => `${item.name} (${item.quantity})`).join(", ")}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            Track
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Menu Management Tab */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Menu Items</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Item
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <Card key={item.id} className={`${item.available ? "" : "opacity-60"}`}>
                    {item.is_special && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-semibold">
                        🎉 SPECIAL
                      </div>
                    )}
                    <div className="relative">
                      <ImageWithFallback src={item.image || ""} alt={item.name} className="w-full h-40 object-cover" />
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive">Unavailable</Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{item.name}</h4>
                        <span className="font-bold text-green-600">₹{item.price}</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.dietary.map((diet, index) => (
                          <Badge key={index} variant="secondary" className={`text-xs ${getDietaryColor(diet)}`}>
                            {diet}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleMenuItemAvailability(item.id)}
                          />
                          <span className="text-sm">Available</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Send Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notification-title">Title</Label>
                    <Input
                      id="notification-title"
                      placeholder="Enter notification title"
                      value={notificationForm.title}
                      onChange={(e) => setNotificationForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notification-message">Message</Label>
                    <Textarea
                      id="notification-message"
                      placeholder="Enter notification message"
                      value={notificationForm.message}
                      onChange={(e) => setNotificationForm((prev) => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notification-type">Type</Label>
                    <Select
                      value={notificationForm.type}
                      onValueChange={(value) => setNotificationForm((prev) => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menu-update">Menu Update</SelectItem>
                        <SelectItem value="delivery-alert">Delivery Alert</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={sendNotification}>
                    <Bell className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { ArrowLeft, Plus, Minus, MapPin, CreditCard, Calendar, Clock } from "lucide-react"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { createClient } from "../../lib/supabase/client"
import type { MenuItem } from "../../lib/supabase/types"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  dietary: string[]
}

interface OrderPageProps {
  onNavigate: (page: string) => void
}

export function OrderPage({ onNavigate }: OrderPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSubscription, setIsSubscription] = useState(false)
  const [subscriptionPlan, setSubscriptionPlan] = useState("weekly")
  const [deliveryTime, setDeliveryTime] = useState("12:00-13:00")
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    try {
      setLoading(true)

      const { data: menuData, error } = await supabase.from("menu_items").select("*").eq("available", true)

      if (error) throw error
      setMenuItems(menuData || [])

      // Initialize cart with sample items for demo
      const sampleCart: CartItem[] = [
        {
          id: menuData?.[0]?.id || "1",
          name: menuData?.[0]?.name || "Dal Chawal Combo",
          price: menuData?.[0]?.price || 120,
          image: menuData?.[0]?.image || "",
          quantity: 2,
          dietary: menuData?.[0]?.dietary || ["vegetarian", "gluten-free"],
        },
      ]
      setCartItems(sampleCart)

      console.log("[v0] Order page data loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading order page data:", error)
    } finally {
      setLoading(false)
    }
  }

  const placeOrder = async () => {
    try {
      if (!deliveryAddress || !paymentMethod) {
        alert("Please fill in delivery address and payment method")
        return
      }

      const orderItems = cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error } = await supabase.from("orders").insert([
        {
          customer_name: "Customer User", // In a real app, this would come from auth
          customer_email: "customer@example.com",
          items: orderItems,
          total: finalTotal,
          status: "pending",
          delivery_time: deliveryTime,
          delivery_group: "B-12",
          address: deliveryAddress,
          special_instructions: specialInstructions,
        },
      ])

      if (error) throw error

      alert("Order placed successfully!")
      onNavigate("dashboard")
      console.log("[v0] Order placed successfully")
    } catch (error) {
      console.error("[v0] Error placing order:", error)
      alert("Error placing order. Please try again.")
    }
  }

  const updateQuantity = (itemId: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 300 ? 0 : 30
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + tax

  const subscriptionDiscount = isSubscription ? Math.round(subtotal * 0.15) : 0
  const finalTotal = total - subscriptionDiscount

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="pt-16 lg:pt-20 pb-20 lg:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button and Header */}
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => onNavigate("dashboard")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Order</h1>
              <p className="text-sm text-gray-600">Review and complete your purchase</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <ImageWithFallback
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.dietary.map((diet, index) => (
                            <Badge key={index} variant="secondary" className={`text-xs ${getDietaryColor(diet)}`}>
                              {diet}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, -1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Subscription Option */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Subscription Plan
                    <Switch checked={isSubscription} onCheckedChange={setIsSubscription} />
                  </CardTitle>
                </CardHeader>
                {isSubscription && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subscription-plan">Plan Duration</Label>
                        <Select value={subscriptionPlan} onValueChange={setSubscriptionPlan}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly (15% off)</SelectItem>
                            <SelectItem value="monthly">Monthly (20% off)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="delivery-time">Preferred Time</Label>
                        <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="11:00-12:00">11:00 AM - 12:00 PM</SelectItem>
                            <SelectItem value="12:00-13:00">12:00 PM - 1:00 PM</SelectItem>
                            <SelectItem value="13:00-14:00">1:00 PM - 2:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        💰 Save ₹{subscriptionDiscount} with {subscriptionPlan} subscription!
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Delivery Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                    <Input
                      id="instructions"
                      placeholder="Gate number, landmark, etc."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MapPin className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      variant={paymentMethod === "upi" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("upi")}
                      className="justify-start"
                    >
                      💳 UPI
                    </Button>
                    <Button
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("card")}
                      className="justify-start"
                    >
                      💳 Card
                    </Button>
                    <Button
                      variant={paymentMethod === "cod" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("cod")}
                      className="justify-start"
                    >
                      💵 Cash
                    </Button>
                  </div>
                  {paymentMethod === "upi" && <Input placeholder="Enter UPI ID (e.g., yourname@paytm)" />}
                  {paymentMethod === "card" && (
                    <div className="space-y-3">
                      <Input placeholder="Card Number" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="MM/YY" />
                        <Input placeholder="CVV" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (5%)</span>
                      <span>₹{tax}</span>
                    </div>
                    {isSubscription && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Subscription Discount</span>
                        <span>-₹{subscriptionDiscount}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>

                  {deliveryFee > 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-800">🚚 Add ₹{300 - subtotal} more for free delivery</p>
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Delivery: {deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Today, Sept 27</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    size="lg"
                    disabled={!deliveryAddress || !paymentMethod}
                    onClick={placeOrder}
                  >
                    Place Order • ₹{finalTotal}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Database types for type safety
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  dietary: string[]
  available: boolean
  is_special: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string | null
  items: OrderItem[]
  total: number
  status: "pending" | "preparing" | "ready" | "delivered"
  delivery_time: string | null
  delivery_group: string | null
  address: string | null
  special_instructions: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "menu-update" | "delivery-alert" | "promotion" | "general"
  is_read: boolean
  created_at: string
}

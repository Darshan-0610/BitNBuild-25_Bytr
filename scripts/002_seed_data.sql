-- Insert sample menu items
INSERT INTO public.menu_items (name, description, price, image, dietary, available, is_special) VALUES
('Dal Chawal Combo', 'Traditional yellow dal with steamed basmati rice, pickle, and salad', 120, 'https://images.unsplash.com/photo-1653849942524-ef2c6882d70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJpY2UlMjBkYWx8ZW58MXx8fHwxNzU4OTc2MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', ARRAY['vegetarian', 'gluten-free'], true, false),
('Chicken Biryani', 'Aromatic basmati rice cooked with tender chicken and spices', 180, 'https://images.unsplash.com/photo-1713780131281-61ec701ebb6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBiaXJ5YW5pJTIwbWVhbHxlbnwxfHx8fDE3NTg5NzYwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', ARRAY[]::TEXT[], true, false),
('Special Thali', 'Complete meal with dal, sabzi, roti, rice, curd, and sweet', 200, 'https://images.unsplash.com/photo-1572517499173-4e2cb8bef19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFyaWFuJTIwdGhhbGl8ZW58MXx8fHwxNzU4OTc2MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', ARRAY['vegetarian'], true, true),
('Samosa & Chutney', 'Crispy samosas served with mint and tamarind chutney', 60, 'https://images.unsplash.com/photo-1697155836252-d7f969108b5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MXx8fHwxNzU4ODgwMDQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', ARRAY['vegetarian', 'vegan'], true, false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO public.orders (customer_name, customer_email, items, total, status, delivery_time, delivery_group, address) VALUES
('Priya Sharma', 'priya@example.com', '[{"name": "Dal Chawal Combo", "quantity": 1, "price": 120}, {"name": "Samosa & Chutney", "quantity": 1, "price": 60}]'::jsonb, 180, 'preparing', '12:30 PM', 'B-12', 'Sector 15, Gurgaon'),
('Rahul Kumar', 'rahul@example.com', '[{"name": "Chicken Biryani", "quantity": 1, "price": 180}]'::jsonb, 180, 'ready', '1:00 PM', 'A-8', 'DLF Phase 2'),
('Anita Patel', 'anita@example.com', '[{"name": "Special Thali", "quantity": 1, "price": 200}]'::jsonb, 200, 'pending', '12:45 PM', 'B-12', 'Cyber City')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO public.notifications (title, message, type) VALUES
('New Festive Menu Available!', 'Special Diwali thali now available for pre-order', 'menu-update'),
('Delivery Group Update', 'You have been moved to Group B-12 for faster delivery', 'delivery-alert'),
('20% Off This Weekend', 'Use code WEEKEND20 for weekend meal subscriptions', 'promotion')
ON CONFLICT (id) DO NOTHING;

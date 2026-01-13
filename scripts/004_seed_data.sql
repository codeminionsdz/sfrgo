-- Seed data for SAFRGO (will be applied after first users sign up)
-- This creates sample agencies and offers for testing

-- Note: You'll need to run this after creating test users
-- The agency owner_id values should be updated to match real user IDs

-- For now, we'll create a function to seed demo data that can be called later
CREATE OR REPLACE FUNCTION public.seed_demo_data(admin_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  agency1_id UUID;
  agency2_id UUID;
  agency3_id UUID;
BEGIN
  -- Create demo agencies
  INSERT INTO public.agencies (id, owner_id, name, slug, logo, cover_image, description, location, rating, review_count, verified, specialties, follower_count, status, subscription_plan, subscription_status, offer_limit)
  VALUES 
    (uuid_generate_v4(), admin_user_id, 'Wanderlust Adventures', 'wanderlust-adventures', '/travel-agency-logo-w.jpg', '/tropical-beach-resort-aerial-view.jpg', 'Crafting unforgettable journeys across Southeast Asia for over 15 years. We specialize in authentic cultural experiences and eco-friendly travel.', 'Bangkok, Thailand', 4.9, 847, true, ARRAY['Southeast Asia', 'Cultural Tours', 'Eco Tourism'], 12500, 'active', 'premium', 'active', 50)
  RETURNING id INTO agency1_id;

  INSERT INTO public.agencies (id, owner_id, name, slug, logo, cover_image, description, location, rating, review_count, verified, specialties, follower_count, status, subscription_plan, subscription_status, offer_limit)
  VALUES 
    (uuid_generate_v4(), admin_user_id, 'Alpine Escapes', 'alpine-escapes', '/mountain-travel-agency-logo-a.jpg', '/swiss-alps-landscape.png', 'Your gateway to European mountain adventures. From skiing to hiking, we create premium alpine experiences.', 'Zurich, Switzerland', 4.8, 623, true, ARRAY['Europe', 'Mountain Adventures', 'Luxury Travel'], 8900, 'active', 'enterprise', 'active', 999999)
  RETURNING id INTO agency2_id;

  INSERT INTO public.agencies (id, owner_id, name, slug, logo, cover_image, description, location, rating, review_count, verified, specialties, follower_count, status, subscription_plan, subscription_status, offer_limit)
  VALUES 
    (uuid_generate_v4(), admin_user_id, 'Safari Dreams', 'safari-dreams', '/safari-travel-agency-logo-s.jpg', '/african-savanna-sunset-elephants.jpg', 'Experience the magic of Africa with our curated safari packages. Wildlife encounters and luxury lodges await.', 'Nairobi, Kenya', 4.95, 412, true, ARRAY['Africa', 'Wildlife Safari', 'Luxury Lodges'], 6700, 'active', 'premium', 'active', 50)
  RETURNING id INTO agency3_id;

  -- Create demo offers
  INSERT INTO public.offers (agency_id, title, destination, country, image, images, price, original_price, currency, duration, description, highlights, included, not_included, category, rating, review_count, saved_count, view_count, featured, active, departure_date, max_group_size)
  VALUES
    (agency1_id, 'Enchanting Bali Discovery', 'Bali', 'Indonesia', '/bali-rice-terraces-temple.jpg', ARRAY['/bali-rice-terraces.png', '/bali-temple-sunset.jpg', '/bali-beach.png'], 1299, 1599, 'USD', '8 days / 7 nights', 'Immerse yourself in the spiritual heart of Bali. From ancient temples to pristine beaches, this journey offers the perfect blend of culture, adventure, and relaxation.', ARRAY['Visit Uluwatu Temple at sunset', 'Traditional Balinese cooking class', 'Ubud rice terrace trek', 'Snorkeling in crystal-clear waters'], ARRAY['Accommodation', 'Daily breakfast', 'Airport transfers', 'Guided tours', 'Entrance fees'], ARRAY['International flights', 'Travel insurance', 'Personal expenses'], 'Cultural', 4.9, 156, 892, 5420, true, true, '2025-03-15', 12),
    
    (agency2_id, 'Swiss Alps Winter Wonderland', 'Zermatt', 'Switzerland', '/matterhorn-mountain-snow.jpg', ARRAY['/zermatt-village-winter.jpg', '/skiing-alps.jpg', '/swiss-chalet-interior.jpg'], 2899, NULL, 'USD', '6 days / 5 nights', 'Experience the magic of the Swiss Alps in Zermatt, home to the iconic Matterhorn. Perfect for skiing enthusiasts and winter lovers.', ARRAY['Ski the world-famous slopes', 'Matterhorn Glacier Paradise', 'Gourmet Swiss dining', 'Scenic train journey'], ARRAY['5-star hotel accommodation', 'Ski pass', 'Gourmet meals', 'Train transfers'], ARRAY['Flights', 'Ski equipment rental', 'Travel insurance'], 'Adventure', 4.85, 98, 654, 3210, true, true, '2025-02-01', 8),
    
    (agency3_id, 'Serengeti Safari Experience', 'Serengeti', 'Tanzania', '/serengeti-lions-safari.jpg', ARRAY['/serengeti-wildebeest-migration.png', '/safari-lodge-luxury.jpg'], 4599, 5299, 'USD', '10 days / 9 nights', 'Witness the Great Migration and encounter Africa magnificent wildlife on this once-in-a-lifetime safari adventure.', ARRAY['Great Migration viewing', 'Big Five game drives', 'Luxury tented camp', 'Maasai village visit'], ARRAY['Luxury lodge accommodation', 'All meals', 'Game drives', 'Park fees', 'Flying doctors insurance'], ARRAY['International flights', 'Visa fees', 'Gratuities'], 'Wildlife', 4.95, 73, 421, 2890, true, true, '2025-07-10', 6),
    
    (agency1_id, 'Vietnam Heritage Trail', 'Hanoi to Ho Chi Minh', 'Vietnam', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800', '/placeholder.svg?height=600&width=800'], 1599, NULL, 'USD', '12 days / 11 nights', 'Journey through Vietnam from north to south, discovering ancient traditions, stunning landscapes, and incredible cuisine.', ARRAY['Ha Long Bay cruise', 'Hoi An ancient town', 'Cu Chi Tunnels', 'Mekong Delta exploration'], ARRAY['Hotels & overnight cruise', 'Breakfast daily', 'Domestic flights', 'Guided tours'], ARRAY['International flights', 'Visa', 'Travel insurance'], 'Cultural', 4.88, 201, 756, 4100, false, true, '2025-05-05', 14),
    
    (agency2_id, 'Italian Lakes Romance', 'Lake Como', 'Italy', '/placeholder.svg?height=600&width=800', ARRAY['/placeholder.svg?height=600&width=800', '/placeholder.svg?height=600&width=800'], 2199, NULL, 'USD', '5 days / 4 nights', 'Experience la dolce vita on the shores of Lake Como. Elegant villas, charming villages, and exquisite Italian cuisine await.', ARRAY['Villa Carlotta gardens', 'Private boat tour', 'Wine tasting', 'Bellagio exploration'], ARRAY['Boutique hotel', 'Breakfast', 'Boat tours', 'Wine experience'], ARRAY['Flights', 'Lunches & dinners', 'Personal expenses'], 'Romance', 4.87, 89, 534, 2650, false, true, '2025-06-12', 10);
END;
$$;

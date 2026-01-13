-- Enable Row Level Security on all tables

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followed_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================
-- Anyone can view profiles
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (via trigger)
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- AGENCIES POLICIES
-- =============================================
-- Anyone can view active agencies
CREATE POLICY "agencies_select_all" ON public.agencies
  FOR SELECT USING (true);

-- Agency owners can update their own agency
CREATE POLICY "agencies_update_own" ON public.agencies
  FOR UPDATE USING (auth.uid() = owner_id);

-- Authenticated users can insert agencies
CREATE POLICY "agencies_insert_auth" ON public.agencies
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- =============================================
-- OFFERS POLICIES
-- =============================================
-- Anyone can view active offers
CREATE POLICY "offers_select_active" ON public.offers
  FOR SELECT USING (active = true OR EXISTS (
    SELECT 1 FROM public.agencies WHERE agencies.id = offers.agency_id AND agencies.owner_id = auth.uid()
  ));

-- Agency owners can manage their offers
CREATE POLICY "offers_insert_own" ON public.offers
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.agencies WHERE agencies.id = agency_id AND agencies.owner_id = auth.uid()
  ));

CREATE POLICY "offers_update_own" ON public.offers
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.agencies WHERE agencies.id = agency_id AND agencies.owner_id = auth.uid()
  ));

CREATE POLICY "offers_delete_own" ON public.offers
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.agencies WHERE agencies.id = agency_id AND agencies.owner_id = auth.uid()
  ));

-- =============================================
-- SAVED OFFERS POLICIES
-- =============================================
CREATE POLICY "saved_offers_select_own" ON public.saved_offers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_offers_insert_own" ON public.saved_offers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_offers_delete_own" ON public.saved_offers
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- FOLLOWED AGENCIES POLICIES
-- =============================================
CREATE POLICY "followed_agencies_select_own" ON public.followed_agencies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "followed_agencies_insert_own" ON public.followed_agencies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "followed_agencies_delete_own" ON public.followed_agencies
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- CONVERSATIONS POLICIES
-- =============================================
CREATE POLICY "conversations_select_participant" ON public.conversations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_participants.conversation_id = conversations.id 
    AND conversation_participants.user_id = auth.uid()
  ));

CREATE POLICY "conversations_insert_auth" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- CONVERSATION PARTICIPANTS POLICIES
-- =============================================
CREATE POLICY "conversation_participants_select_own" ON public.conversation_participants
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.conversation_participants cp2 
    WHERE cp2.conversation_id = conversation_participants.conversation_id 
    AND cp2.user_id = auth.uid()
  ));

CREATE POLICY "conversation_participants_insert_auth" ON public.conversation_participants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "conversation_participants_update_own" ON public.conversation_participants
  FOR UPDATE USING (user_id = auth.uid());

-- =============================================
-- MESSAGES POLICIES
-- =============================================
CREATE POLICY "messages_select_participant" ON public.messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id = auth.uid()
  ));

CREATE POLICY "messages_insert_own" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id = auth.uid()
  ));

-- =============================================
-- VERIFICATION REQUESTS POLICIES
-- =============================================
CREATE POLICY "verification_requests_select_own" ON public.verification_requests
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.agencies 
    WHERE agencies.id = verification_requests.agency_id 
    AND agencies.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "verification_requests_insert_own" ON public.verification_requests
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.agencies 
    WHERE agencies.id = agency_id 
    AND agencies.owner_id = auth.uid()
  ));

-- =============================================
-- SUBSCRIPTION REQUESTS POLICIES
-- =============================================
CREATE POLICY "subscription_requests_select_own" ON public.subscription_requests
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.agencies 
    WHERE agencies.id = subscription_requests.agency_id 
    AND agencies.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "subscription_requests_insert_own" ON public.subscription_requests
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.agencies 
    WHERE agencies.id = agency_id 
    AND agencies.owner_id = auth.uid()
  ));

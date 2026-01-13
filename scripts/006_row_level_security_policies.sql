-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE followed_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Agencies policies
CREATE POLICY "Anyone can view active agencies"
  ON agencies FOR SELECT
  TO authenticated, anon
  USING (status = 'active' OR status = 'pending');

CREATE POLICY "Admins can view all agencies"
  ON agencies FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Agency owners can update their agency"
  ON agencies FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create agencies"
  ON agencies FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Offers policies
CREATE POLICY "Anyone can view active offers"
  ON offers FOR SELECT
  TO authenticated, anon
  USING (active = true);

CREATE POLICY "Agency owners can view their offers"
  ON offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = offers.agency_id
      AND agencies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Agency owners can create offers"
  ON offers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = offers.agency_id
      AND agencies.owner_id = auth.uid()
      AND agencies.subscription_status = 'active'
    )
    AND can_create_offer(agency_id)
  );

CREATE POLICY "Agency owners can update their offers"
  ON offers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = offers.agency_id
      AND agencies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Agency owners can delete their offers"
  ON offers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = offers.agency_id
      AND agencies.owner_id = auth.uid()
    )
  );

-- Saved offers policies
CREATE POLICY "Users can view their saved offers"
  ON saved_offers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can save offers"
  ON saved_offers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave offers"
  ON saved_offers FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Followed agencies policies
CREATE POLICY "Users can view their followed agencies"
  ON followed_agencies FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can follow agencies"
  ON followed_agencies FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unfollow agencies"
  ON followed_agencies FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Conversations policies
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

-- Conversation participants policies
CREATE POLICY "Users can view their conversation participations"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can join conversations"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their participation"
  ON conversation_participants FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Subscription requests policies
CREATE POLICY "Admins can view all subscription requests"
  ON subscription_requests FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Agency owners can view their requests"
  ON subscription_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = subscription_requests.agency_id
      AND agencies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Agency owners can create subscription requests"
  ON subscription_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = subscription_requests.agency_id
      AND agencies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update subscription requests"
  ON subscription_requests FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

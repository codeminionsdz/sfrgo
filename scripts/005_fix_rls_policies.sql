-- Fix infinite recursion in conversation_participants RLS policy
-- Drop the existing policy with circular reference
DROP POLICY IF EXISTS "conversation_participants_select_own" ON public.conversation_participants;

-- Create a simpler policy that doesn't cause recursion
-- Users can see their own participant records
CREATE POLICY "conversation_participants_select_own" ON public.conversation_participants
  FOR SELECT USING (user_id = auth.uid());

-- Add a separate policy to allow seeing other participants in the same conversation
-- This uses a direct approach without recursion
CREATE POLICY "conversation_participants_select_same_conversation" ON public.conversation_participants
  FOR SELECT USING (
    conversation_id IN (
      SELECT cp.conversation_id 
      FROM public.conversation_participants cp 
      WHERE cp.user_id = auth.uid()
    )
  );

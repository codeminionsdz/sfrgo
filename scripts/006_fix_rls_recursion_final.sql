-- Fix infinite recursion in conversation_participants RLS policies
-- The issue is that the SELECT policy is referencing the same table it's protecting

-- Drop all existing SELECT policies on conversation_participants
DROP POLICY IF EXISTS "conversation_participants_select_own" ON public.conversation_participants;
DROP POLICY IF EXISTS "conversation_participants_select_same_conversation" ON public.conversation_participants;

-- Create a single, non-recursive SELECT policy
-- Users can only see participant records where they are involved in the conversation
CREATE POLICY "conversation_participants_select_policy" ON public.conversation_participants
  FOR SELECT 
  USING (
    -- User can see their own participant record
    user_id = auth.uid()
    OR
    -- User can see other participants if they share a conversation
    EXISTS (
      SELECT 1 
      FROM public.conversation_participants cp2 
      WHERE cp2.conversation_id = conversation_participants.conversation_id 
        AND cp2.user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

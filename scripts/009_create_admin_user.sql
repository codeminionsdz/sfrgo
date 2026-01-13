-- Create Admin User
-- This script creates an admin user in the system

-- First, create a function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Create profile with admin role
  INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
  VALUES (new_user_id, admin_name, admin_email, 'admin', NOW(), NOW());

  RETURN new_user_id;
END;
$$;

-- Create default admin user
-- Email: admin@safrgo.com
-- Password: admin123
-- You should change this password after first login!
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Check if admin already exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'admin@safrgo.com') THEN
    SELECT create_admin_user(
      'admin@safrgo.com',
      'admin123',
      'SAFRGO Admin'
    ) INTO admin_id;
    
    RAISE NOTICE 'Admin user created with ID: %', admin_id;
    RAISE NOTICE 'Email: admin@safrgo.com';
    RAISE NOTICE 'Password: admin123';
    RAISE NOTICE 'Please change the password after first login!';
  ELSE
    RAISE NOTICE 'Admin user already exists';
  END IF;
END $$;

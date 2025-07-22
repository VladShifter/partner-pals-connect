
-- Добавим новые статусы для заявок партнеров
ALTER TABLE partner_applications 
ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS vendor_notes TEXT,
ADD COLUMN IF NOT EXISTS communication_preference TEXT DEFAULT 'chat',
ADD COLUMN IF NOT EXISTS scheduled_call_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS multiple_products BOOLEAN DEFAULT false;

-- Обновим статусы заявок
UPDATE partner_applications 
SET status = 'submitted' 
WHERE status = 'in_progress' AND current_step = 5;

-- Создадим таблицу для связи заявок с чатами
CREATE TABLE IF NOT EXISTS partner_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES partner_applications(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  partner_id UUID NOT NULL,
  thread_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(application_id, vendor_id, partner_id)
);

-- Включим RLS для partner_chats
ALTER TABLE partner_chats ENABLE ROW LEVEL SECURITY;

-- Создадим политики для partner_chats
CREATE POLICY "Users can view their own partner chats"
  ON partner_chats FOR SELECT
  USING (vendor_id = auth.uid() OR partner_id = auth.uid());

CREATE POLICY "Users can create partner chats"
  ON partner_chats FOR INSERT
  WITH CHECK (vendor_id = auth.uid() OR partner_id = auth.uid());

CREATE POLICY "Admins can manage all partner chats"
  ON partner_chats FOR ALL
  USING (is_admin(auth.uid()));

-- Создадим таблицу для уведомлений
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включим RLS для notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Создадим политики для notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Создадим функцию для создания уведомлений
CREATE OR REPLACE FUNCTION create_notification(
  target_user_id UUID,
  notification_type TEXT,
  notification_title TEXT,
  notification_message TEXT,
  notification_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (target_user_id, notification_type, notification_title, notification_message, notification_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Создадим триггер для обновления времени изменения статуса
CREATE OR REPLACE FUNCTION update_application_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_application_status_trigger
  BEFORE UPDATE ON partner_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_application_status_timestamp();

-- Обновим updated_at триггер для partner_chats
CREATE TRIGGER update_partner_chats_updated_at
  BEFORE UPDATE ON partner_chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

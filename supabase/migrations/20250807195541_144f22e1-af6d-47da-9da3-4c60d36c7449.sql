
-- 1) Исправляем РЛС для products: сравнение через vendors.user_id
ALTER POLICY "Vendors can manage their own products"
  ON public.products
  USING (
    EXISTS (
      SELECT 1
      FROM public.vendors v
      WHERE v.id = products.vendor_id
        AND v.user_id = auth.uid()
    )
  );

ALTER POLICY "Vendors can manage their own products"
  ON public.products
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.vendors v
      WHERE v.id = products.vendor_id
        AND v.user_id = auth.uid()
    )
  );

-- 2) Исправляем РЛС для product_pricing_tiers
ALTER POLICY "Vendors can manage pricing tiers for their products"
  ON public.product_pricing_tiers
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.vendors v ON v.id = p.vendor_id
      WHERE p.id = product_pricing_tiers.product_id
        AND v.user_id = auth.uid()
    )
  );

ALTER POLICY "Vendors can manage pricing tiers for their products"
  ON public.product_pricing_tiers
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.vendors v ON v.id = p.vendor_id
      WHERE p.id = product_pricing_tiers.product_id
        AND v.user_id = auth.uid()
    )
  );

-- 3) Исправляем РЛС для product_tags
ALTER POLICY "Vendors can manage tags for their products"
  ON public.product_tags
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.vendors v ON v.id = p.vendor_id
      WHERE p.id = product_tags.product_id
        AND v.user_id = auth.uid()
    )
  );

ALTER POLICY "Vendors can manage tags for their products"
  ON public.product_tags
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.vendors v ON v.id = p.vendor_id
      WHERE p.id = product_tags.product_id
        AND v.user_id = auth.uid()
    )
  );

-- 4) Индекс по slug для быстрых выборок страницы продукта
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);

-- 5) Бакет для изображений продуктов
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Политики для bucket product-images (чтение публично, запись/обновление/удаление аутентифицированным)

-- На случай, если ранее создавались политики, удалим их и создадим заново
DROP POLICY IF EXISTS "Public read access to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update own files in product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete own files in product-images" ON storage.objects;

-- Публичное чтение
CREATE POLICY "Public read access to product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Загрузка (insert) аутентифицированным
CREATE POLICY "Authenticated can upload to product-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Обновление только своих файлов
CREATE POLICY "Authenticated can update own files in product-images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'product-images' AND owner = auth.uid());

-- Удаление только своих файлов
CREATE POLICY "Authenticated can delete own files in product-images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid());

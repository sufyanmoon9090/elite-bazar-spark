INSERT INTO public.site_settings (section_key, section_data)
VALUES ('general', '{"site_name": "Elite Bazar", "logo_url": "", "footer_text": "Your premium destination for quality products and exceptional shopping experiences."}')
ON CONFLICT (section_key) DO NOTHING;
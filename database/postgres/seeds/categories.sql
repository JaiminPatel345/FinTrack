-- Seed default expense categories
INSERT INTO expense_categories (id, company_id, name, description, is_active) 
SELECT 
    gen_random_uuid(),
    c.id,
    category.name,
    category.description,
    true
FROM companies c
CROSS JOIN (VALUES
    ('Travel', 'Travel and transportation expenses'),
    ('Food & Beverage', 'Meals and entertainment'),
    ('Accommodation', 'Hotel and lodging expenses'),
    ('Office Supplies', 'Office equipment and supplies'),
    ('Communication', 'Phone, internet, and communication'),
    ('Marketing', 'Marketing and advertising expenses'),
    ('Training', 'Training and development'),
    ('Miscellaneous', 'Other expenses')
) AS category(name, description)
ON CONFLICT DO NOTHING;

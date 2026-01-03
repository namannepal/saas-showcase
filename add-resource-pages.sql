-- Add 25 Resource Pages to saas_products table
-- This script safely adds new resource pages without affecting existing entries
-- It only inserts if a resource page with the same name doesn't already exist

INSERT INTO saas_products (name, description, url, page_type, category, featured)
SELECT * FROM (VALUES
  ('Squarespace', 'Squarespace is a popular codeless website builder known for its beautifully designed templates and intuitive design tools for creatives and businesses.', 'https://www.squarespace.com/learning', 'resource', 'Design', false),
  ('Thinkific', 'Thinkific is an eLearning platform that allows anyone to create and monetize their skills by developing and selling online courses.', 'https://www.thinkific.com/resources/', 'resource', 'Education', false),
  ('BigCommerce', 'BigCommerce is an e-commerce platform that gives business owners all the functionality they need to create an online store and manage inventory, orders, and marketing.', 'https://www.bigcommerce.com/resources/', 'resource', 'E-commerce', false),
  ('Figma', 'Figma is a collaborative design tool for all kinds of web applications, enabling teams to design, prototype, and gather feedback in real-time.', 'https://www.figma.com/resources/', 'resource', 'Design', false),
  ('Asana', 'Asana is a project management tool for organizing tasks, keeping track of deadlines, and team collaboration to improve workflow efficiency.', 'https://asana.com/resources', 'resource', 'Productivity', false),
  ('Keap', 'Keap is an all-in-one CRM platform that combines sales and marketing with built-in automation functionalities specifically for small businesses.', 'https://keap.com/resources', 'resource', 'Marketing', false),
  ('Mailchimp', 'Mailchimp is a leading email marketing tool that helps businesses build mailing lists, automate campaigns, and boost revenue through data-driven insights.', 'https://mailchimp.com/resources/', 'resource', 'Marketing', false),
  ('Calendly', 'Calendly is a scheduling automation platform perfect for busy entrepreneurs and global companies to manage meetings without the back-and-forth emails.', 'https://calendly.com/resources', 'resource', 'Productivity', false),
  ('Leadpages', 'Leadpages provides all the necessary functionality for businesses to build high-converting landing pages and websites with ease.', 'https://www.leadpages.com/resources', 'resource', 'Marketing', false),
  ('Canva', 'Canva is a superb graphic design tool that almost anybody can use to create visuals for posts, presentations, posters, videos, or logos.', 'https://www.canva.com/learn/', 'resource', 'Design', false),
  ('Tableau', 'Tableau is a powerful analytics software for processing and analyzing business data, helping users visualize and understand their data effectively.', 'https://www.tableau.com/learn', 'resource', 'Analytics', false),
  ('Semrush', 'Semrush is an all-in-one tool suite for improving online visibility and discovering marketing insights through SEO, PPC, and content analysis.', 'https://www.semrush.com/resources/', 'resource', 'Marketing', false),
  ('Carrd', 'Carrd is a platform designed to build simple, free, fully responsive one-page sites for pretty much anything.', 'https://carrd.co/docs', 'resource', 'Design', false),
  ('PandaDoc', 'PandaDoc is a contract management and e-signing tool that streamlines the process of creating, sending, and tracking documents.', 'https://www.pandadoc.com/resources/', 'resource', 'Productivity', false),
  ('Unbounce', 'Unbounce is a landing page builder packed with tools to optimize marketing efforts through AI-powered conversion features.', 'https://unbounce.com/resources/', 'resource', 'Marketing', false),
  ('SurveyMonkey', 'SurveyMonkey is a popular survey creation, management, and analysis platform used to gather feedback and drive business decisions.', 'https://www.surveymonkey.com/mp/resources/', 'resource', 'Analytics', false),
  ('Pipedrive', 'Pipedrive is a CRM tool that helps sales and marketing teams manage leads and deals while automating repetitive tasks.', 'https://www.pipedrive.com/en/resources', 'resource', 'Sales', false),
  ('Bynder', 'Bynder is a digital asset management platform that helps brands create, find, and use content more efficiently.', 'https://www.bynder.com/en/resources/', 'resource', 'Marketing', false),
  ('Ghost', 'Ghost is a powerful platform for professional publishers to create, share, and grow their business around their content.', 'https://ghost.org/resources/', 'resource', 'Content', false),
  ('Ramp', 'Ramp is a finance automation platform that helps businesses spend less time on manual tasks and more time on strategic growth.', 'https://ramp.com/resources', 'resource', 'Finance', false),
  ('ClickUp', 'ClickUp is an all-in-one productivity platform that replaces multiple tools with a single place for tasks, docs, chat, and goals.', 'https://clickup.com/resources', 'resource', 'Productivity', false),
  ('Webflow', 'Webflow is a visual web design tool that allows users to build professional, custom websites without writing code.', 'https://webflow.com/resources', 'resource', 'Design', false),
  ('Jasper', 'Jasper is an AI content platform that helps marketing teams create high-quality content faster using generative AI.', 'https://www.jasper.ai/resources', 'resource', 'Content', false),
  ('Pitch', 'Pitch is a collaborative presentation software that enables teams to create stunning decks with ease and speed.', 'https://pitch.com/resources', 'resource', 'Productivity', false),
  ('Slack', 'Slack is a messaging app for business that connects people to the information they need, transforming the way organizations communicate.', 'https://slack.com/resources', 'resource', 'Productivity', false)
) AS new_pages(name, description, url, page_type, category, featured)
WHERE NOT EXISTS (
  SELECT 1 FROM saas_products 
  WHERE saas_products.name = new_pages.name 
  AND saas_products.page_type = 'resource'
);

-- Show summary of what was inserted
SELECT 
  COUNT(*) as inserted_count,
  'resource pages added successfully' as message
FROM saas_products
WHERE page_type = 'resource';


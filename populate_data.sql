-- Populate the 'experience' table
-- Ensure dates are in 'YYYY-MM-DD' format or NULL.
-- display_order helps control the order on the timeline (lower numbers first).

INSERT INTO experience (id, job_title, company, start_date, end_date, description, display_order) VALUES
(gen_random_uuid(), 'AI Solutions Architect', 'Big Sister AI', '2024-01-01', NULL, 'Leading the design and implementation of AI solutions, collaborating with stakeholders to translate business needs into technical specifications, and developing AI models and data pipelines.', 1),
(gen_random_uuid(), 'AI Engineer & No-Code Development Lead', 'Keer Lab', '2023-01-01', NULL, 'Developing AI agents for research, customer support, and sales management. Leveraging No-Code automation and Python scripting to facilitate API integrations.', 2),
(gen_random_uuid(), 'Co-Founder', 'Autosynthiq', '2023-01-01', '2024-01-01', 'Led product development resulting in a platform that reduces clients'' customer acquisition costs by 45%. Directed a strategy overhaul that propelled a user base increase of 150% within five months.', 3),
(gen_random_uuid(), 'Sales Director', 'Griffin | Facility Management', '2022-01-01', '2023-01-01', 'Established a sales department from scratch and engineered a strategy that doubled revenue from 60 to 120 million within a year, exceeding industry averages by 20%.', 4),
(gen_random_uuid(), 'Chief Executive Officer', 'KidWay', '2020-01-01', '2022-01-01', 'Scaled the start-up to a revenue of 12 million UAH in the first year, surpassing average industry growth rates by 25%. Implemented CRM and ERP systems that increased operational efficiency.', 5),
(gen_random_uuid(), 'Head Of Sales', 'Vema Kids', '2018-01-01', '2019-01-01', 'Managed and optimized a sales team of 40+ members, facilitating a 25% YOY revenue increase. Improved CRM system functionality leading to 15% increase in customer retention.', 6);

-- Populate the 'skills' table
-- display_order helps control the order of categories and skills within them.

INSERT INTO skills (id, name, category, display_order) VALUES
-- AI/ML Technologies (Category Order 1)
(gen_random_uuid(), 'Large Language Models (LLMs)', 'AI/ML Technologies', 1),
(gen_random_uuid(), 'OpenAI GPT Models', 'AI/ML Technologies', 2),
(gen_random_uuid(), 'Azure Machine Learning', 'AI/ML Technologies', 3),
(gen_random_uuid(), 'Prompt Engineering', 'AI/ML Technologies', 4),
(gen_random_uuid(), 'Stable Diffusion', 'AI/ML Technologies', 5),
(gen_random_uuid(), 'LangChain', 'AI/ML Technologies', 6),
(gen_random_uuid(), 'AI Agents', 'AI/ML Technologies', 7),
-- Cloud Platforms (Category Order 2)
(gen_random_uuid(), 'Amazon Web Services (AWS)', 'Cloud Platforms', 1),
(gen_random_uuid(), 'Microsoft Azure', 'Cloud Platforms', 2),
(gen_random_uuid(), 'Google Cloud Platform', 'Cloud Platforms', 3),
-- Removed duplicate Azure DevOps from here
-- Removed duplicate Terraform from here
(gen_random_uuid(), 'Cloud Infrastructure', 'Cloud Platforms', 4), -- Adjusted display_order again
-- Programming Languages (Category Order 3)
(gen_random_uuid(), 'Python', 'Programming Languages', 1),
(gen_random_uuid(), 'TypeScript', 'Programming Languages', 2),
(gen_random_uuid(), 'JavaScript', 'Programming Languages', 3),
(gen_random_uuid(), 'JSON', 'Programming Languages', 4),
(gen_random_uuid(), 'Markdown', 'Programming Languages', 5),
(gen_random_uuid(), 'Jinja', 'Programming Languages', 6),
-- No-Code/Low-Code Tools (Category Order 4)
(gen_random_uuid(), 'Flowise AI', 'No-Code/Low-Code Tools', 1),
(gen_random_uuid(), 'n8n', 'No-Code/Low-Code Tools', 2),
(gen_random_uuid(), 'Zapier', 'No-Code/Low-Code Tools', 3),
(gen_random_uuid(), 'Make.com (Integromat)', 'No-Code/Low-Code Tools', 4),
(gen_random_uuid(), 'HighLevel', 'No-Code/Low-Code Tools', 5),
(gen_random_uuid(), 'Workflow Automation', 'No-Code/Low-Code Tools', 6),
-- Data Engineering (Category Order 5)
(gen_random_uuid(), 'Data Ingestion', 'Data Engineering', 1),
(gen_random_uuid(), 'Data Transformation', 'Data Engineering', 2),
(gen_random_uuid(), 'Data Storage', 'Data Engineering', 3),
(gen_random_uuid(), 'BigQuery', 'Data Engineering', 4),
(gen_random_uuid(), 'Data Pipelines', 'Data Engineering', 5),
(gen_random_uuid(), 'ETL Processes', 'Data Engineering', 6),
-- DevOps (Category Order 6)
(gen_random_uuid(), 'CI/CD', 'DevOps', 1),
(gen_random_uuid(), 'Azure DevOps', 'DevOps', 2),
(gen_random_uuid(), 'Terraform', 'DevOps', 3),
(gen_random_uuid(), 'Infrastructure as Code', 'DevOps', 4),
(gen_random_uuid(), 'Deployment Automation', 'DevOps', 5),
(gen_random_uuid(), 'Version Control (Git)', 'DevOps', 6);

-- Populate the 'projects' table
-- technologies should be a PostgreSQL array literal e.g., '{"Python", "API"}'.
-- display_order controls the order on the projects page.

INSERT INTO projects (id, name, description, technologies, url, display_order) VALUES
(gen_random_uuid(), 'Flowise AI Integration', 'Customized implementation of Flowise for building LLM workflows with drag & drop UI.', '{"TypeScript", "React", "Node.js", "LLM"}', 'https://github.com/xliberty2008x/Flowise', 1),
(gen_random_uuid(), 'Semantic Router', 'A Python library for semantic routing in AI applications, enabling intelligent request handling.', '{"Python", "NLP", "Machine Learning", "API"}', 'https://github.com/xliberty2008x/semantic-router', 2),
(gen_random_uuid(), 'Prompt Engineering Framework', 'Collection of techniques and examples for effective prompt engineering with open-source LLMs.', '{"Python", "LLM", "Prompt Engineering"}', 'https://github.com/xliberty2008x/prompt-engineering-open-llms', 3),
(gen_random_uuid(), 'Crew AI Agent System', 'Framework for creating and managing teams of AI agents that collaborate to solve complex tasks.', '{"Python", "AI Agents", "LLM", "Collaboration"}', 'https://github.com/xliberty2008x/crew_ai', 4),
(gen_random_uuid(), 'Database Agent', 'AI agent specialized in database operations and management, simplifying data interactions.', '{"Python", "SQL", "AI Agent", "Database"}', 'https://github.com/xliberty2008x/Database_Agent', 5),
(gen_random_uuid(), 'MCP PostgreSQL Integration', 'Model Context Protocol implementation with PostgreSQL for efficient tool calling capabilities.', '{"JavaScript", "PostgreSQL", "MCP", "API"}', 'https://github.com/xliberty2008x/mcp-postgres', 6);

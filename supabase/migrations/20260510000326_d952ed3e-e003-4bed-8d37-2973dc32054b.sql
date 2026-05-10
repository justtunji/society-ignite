
DELETE FROM public.partners WHERE name IN ('Harvard University','Stanford University','MIT','Yale University','Columbia University','Princeton University');

INSERT INTO public.partners (name, logo_url, website_url, order_index, is_active, carousel_visible, target_blank) VALUES
('Nuffield Foundation','https://societyofblackacademics.com/wp-content/uploads/2025/07/Nuffield_Foundation.png','https://www.nuffieldfoundation.org/',1,true,true,true),
('GatenbySanderson','https://societyofblackacademics.com/wp-content/uploads/2023/07/GatenbySanderson1.png','https://www.gatenbysanderson.com/',2,true,true,true),
('University of Leicester School of Business','https://societyofblackacademics.com/wp-content/uploads/2023/07/HBS.png','https://le.ac.uk/school-of-business',3,true,true,true),
('University of Leicester','https://societyofblackacademics.com/wp-content/uploads/2023/07/UL1.png','https://le.ac.uk/school-of-business',4,true,true,true),
('Nottingham University Business School','https://societyofblackacademics.com/wp-content/uploads/2023/07/ABG.png','https://www.nottingham.ac.uk/business/who-we-are/centres-and-institutes/arg/newsevents.aspx',5,true,true,true),
('Knowledge Bridge','https://societyofblackacademics.com/wp-content/uploads/2023/07/Kb1-e1757351427231.png','https://www.knowledge-bridge.co.uk/',6,true,true,true),
('University of Edinburgh Business School','https://societyofblackacademics.com/wp-content/uploads/2023/07/PL-%E2%80%93-1.png','https://www.business-school.ed.ac.uk/',7,true,true,true),
('King''s College London Business School','https://societyofblackacademics.com/wp-content/uploads/2023/07/KBS.png','https://www.kcl.ac.uk/business',8,true,true,true),
('Scottish Black Innovation Accelerator (SBIA)','https://societyofblackacademics.com/wp-content/uploads/2023/06/SBIA1.png','https://www.sbia.business-school.ed.ac.uk/',9,true,true,true),
('Perrett Laver','https://societyofblackacademics.com/wp-content/uploads/2023/06/Parret_Laver.png','https://www.perrettlaver.com/',10,true,true,true);

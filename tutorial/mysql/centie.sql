CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(256) NOT NULL,
  description LONGTEXT,
  uploaded_by VARCHAR(50),
  date DATETIME
);

INSERT INTO articles (title, description, uploaded_by, date)

VALUES
(
  'IT''S Women''s Month! Let us celebrate Women!',
  'Late Night with Dr. Ria Liza featuring up-close and personal with The Philippine Association of University Women PAUW - NATIONAL.',
  'Ria Liza Centeno',
  '2022-03-26'
);
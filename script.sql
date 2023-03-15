	DROP TABLE IF EXISTS programador_lenguaje;
	DROP TABLE IF EXISTS framework_lenguaje;
	DROP TABLE IF EXISTS lenguajes;
	DROP TABLE IF EXISTS propuesta_coder;
	DROP TABLE IF EXISTS frameworks;
	DROP TABLE IF EXISTS solicitudes;
	DROP TABLE IF EXISTS proyectos;
	DROP TABLE IF EXISTS programador_basedatos;
	DROP TABLE IF EXISTS clientes;
	DROP TABLE IF EXISTS basedatos;
	DROP TABLE IF EXISTS programadores;


	CREATE TABLE programadores(
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(50) NOT NULL,
		apellido VARCHAR(50) NOT NULL,
		clave VARCHAR(200) NOT NULL,
		foto_url VARCHAR(500),
		edad INT,
		email VARCHAR(50) UNIQUE NOT NULL,
		area VARCHAR(50) NOT NULL,
		repositorio_url VARCHAR(500),
		linkedin VARCHAR(500),
		resenha VARCHAR(1000),
		telefono VARCHAR(50),
		portafolio VARCHAR (500),
		presupuesto FLOAT(2),
		oferta_valor VARCHAR(500),
		valor_hora INT	
	);

	CREATE TABLE lenguajes(
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(50)
	);

	CREATE TABLE frameworks(
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(50)
	);

	CREATE TABLE basedatos(
	id SERIAL PRIMARY KEY,
	nombre VARCHAR (50)
	);

	CREATE TABLE programador_basedatos(
		id SERIAL PRIMARY KEY,
		programador_id INT,
		FOREIGN KEY (programador_id)
		REFERENCES programadores(id),
		basedatos_id INT,
		FOREIGN KEY (basedatos_id)
		REFERENCES basedatos(id),
		experiencia VARCHAR(500)
	);

	CREATE TABLE programador_lenguaje(
		id SERIAL PRIMARY KEY,
		programador_id INT,
		FOREIGN KEY (programador_id)
		REFERENCES programadores(id),
		lenguajes_id INT,
		FOREIGN KEY (lenguajes_id)
		REFERENCES lenguajes(id),
		experiencia VARCHAR(500)
	);

	CREATE TABLE framework_lenguaje(
		id SERIAL PRIMARY KEY,
		programador_id INT,
		FOREIGN KEY (programador_id)
		REFERENCES programadores(id),
		framework_id INT,
		FOREIGN KEY (framework_id)
		REFERENCES frameworks(id),
		experiencia VARCHAR(500)
	);

	/* Front: contactar */
	CREATE TABLE solicitudes(
		id SERIAL PRIMARY KEY,
		nombre_cliente VARCHAR(50) NOT NULL,
		apellido VARCHAR(50) NOT NULL,
		email VARCHAR(50) NOT NULL,
		titulo_proyecto VARCHAR (50),
		descripcion_proyecto VARCHAR(1000),
		stack_1 VARCHAR (50),
		stack_2 VARCHAR (50),
		stack_3 VARCHAR (50),
		stack_otros VARCHAR (50),
		boceto VARCHAR (100),
		presupuesto FLOAT(2),
		programador_id INT,
		FOREIGN KEY (programador_id)
		REFERENCES programadores(id),
		fecha_solicitud TIME DEFAULT CURRENT_TIME
	);

	CREATE TABLE propuesta_coder (
	id SERIAL PRIMARY KEY,
	solicitud_id INT,
	FOREIGN KEY (solicitud_id)
	REFERENCES solicitudes(id),
	titulo_propuesta VARCHAR (50),
	descripcion_propuesta VARCHAR (50),
	stack_1 VARCHAR (50),
	stack_2 VARCHAR (50),
	stack_3 VARCHAR (50),
	stack_otros VARCHAR (50),
	alcance VARCHAR (100),
	cantidad_revisiones INT,
	horas_estimadas INT,
	valor_final INT  
	);

	CREATE TABLE clientes(
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(50) NOT NULL,
		apellido VARCHAR(50),
		email VARCHAR(50) UNIQUE NOT NULL,
		telefono INT 
	);



	INSERT INTO programadores (nombre, apellido, clave, foto_url, edad, email, area, repositorio_url, linkedin, resenha, telefono, portafolio, presupuesto, oferta_valor, valor_hora)
	VALUES ('Gustavo', 'Lopez', '111111', 'https://goo.su/yt64A', 45, 'guslopezr@gmail.com', 'Fullstack', 'https://portafolio-glr.vercel.app/', 'https://goo.su/mFiM', 'Diseño funcional, programación front y backend', '56992382055', 'Landing pages y páginas de Ecommerce', 100000.00, 'Especial atención en el diseño de aplicaciones con foco en la experiencia del usuario', 20000),
		('Sergio', 'Miranda', '111112', 'https://goo.su/yNzp', 30, 'sergio@freecoders.com', 'Fullstack', 'https://github.com/TITANRAH', 'https://www.linkedin.com/in/sergio/', 'Programador Fullstack, resolución de problemas', '56999887766', 'Ecommerce y chat bots', 150000.00, 'Programación a la medida', 22000),
		('Andrea', 'Paez', '111113', 'https://goo.su/r2xc', 29, 'andrea@freecoders.com', 'Frontend', 'https://github.com/apaezp', 'https://goo.su/daJeW', 'Full Stack Developer | English C2', '56912341234', 'Landing Pages, Diseño Frontend con CSS avanzado', 100000.00, 'Programación de front, alto nivel de usabilidad', 21000);



	INSERT INTO lenguajes (nombre)
	VALUES ('Python'),
	('JavaScript'),
	('Java'),
	('C++'),
	('PHP'),
	('C#'),
	('Swift'),
	('TypeScript'),
	('Kotlin'),
	('Go');



	INSERT INTO frameworks (nombre)
	VALUES ('React'),
	('Angular'),
	('Vue.js'),
	('Ruby on Rails'),
	('Django'),
	('Spring'),
	('Express.js'),
	('Laravel'),
	('Flask'),
	('ASP.NET');



	INSERT INTO basedatos (nombre)
	VALUES ('MySQL'),
	('PostgreSQL'),
	('Oracle'),
	('MongoDB'),
	('Microsoft SQL Server'),
	('SQLite'),
	('Cassandra'),
	('Redis'),
	('Firebase Realtime Database'),
	('Amazon Aurora');


	INSERT INTO solicitudes (nombre_cliente, apellido, email, titulo_proyecto, descripcion_proyecto, stack_1, stack_2, stack_3, stack_otros, boceto, presupuesto, programador_id)
	VALUES 
	('Juan', 'Sintierra', 'juan@gmail.com', 'Desarrollo de una aplicación de reserva de citas', 'Se requiere desarrollar una aplicación web que permita a los usuarios reservar citas en línea.', 'React', 'Node.js', 'MongoDB', 'N/A', 'https://example.com/boceto.png', 1500.00, 1),
	('Pedro', 'Piedra', 'pedro@yahoo.com', 'Desarrollo de un sitio web de comercio electrónico', 'Se requiere desarrollar un sitio web de comercio electrónico para la venta de productos en línea.', 'HTML', 'CSS', 'JavaScript', 'PHP', 'https://example.com/boceto.png', 2500.00, 2),
	('Alan', 'Brito', 'alan@outlook.com', 'Desarrollo de aplicación seguimiento de gastos', 'Se requiere desarrollar una aplicación móvil que permita a los usuarios llevar un seguimiento de sus gastos.', 'React Native', 'Firebase', 'N/A', 'N/A', 'https://example.com/boceto.png', 1000.00, 3);

	INSERT INTO propuesta_coder (solicitud_id, titulo_propuesta, descripcion_propuesta, stack_1, stack_2, stack_3, stack_otros, alcance, cantidad_revisiones, horas_estimadas, valor_final)
	VALUES (1, 'Desarrollo de app de reserva', 'Propuesta para app de reserva de citas en línea', 'React', 'Node.js', 'MongoDB', 'N/A', 'Desarrollo completo de la aplicación', 2, 100, 2000);


	INSERT INTO propuesta_coder (solicitud_id, titulo_propuesta, descripcion_propuesta, stack_1, stack_2, stack_3, stack_otros, alcance, cantidad_revisiones, horas_estimadas, valor_final)
	VALUES (1, 'Desarrollo de tienda en línea', 'Propuesta para desarrollo sitio ecommerce.', 'HTML', 'CSS', 'JavaScript', 'PHP', 'Desarrollo completo de la tienda en línea, incluyendo diseño, implementación, pruebas y despliegue.', 3, 150, 300000),
	(2, 'Desarrollo de app de seguimiento de gastos', 'Propuesta de aplicación móvil seguimiento gastos.', 'React Native', 'Firebase', 'N/A', 'N/A', 'Desarrollo completo aplicación seguimiento de gastos. Diseño, implementación, pruebas y despliegue.', 2, 80, 1500000);


	INSERT INTO framework_lenguaje (programador_id, framework_id, experiencia) 
	VALUES
	(1, 1, '1'),
	(2, 1, '1'),
	(3, 1, '2 '),
	(2, 3, '2 ');

	INSERT INTO programador_basedatos (programador_id, basedatos_id, experiencia) VALUES
	(1, 2, '1'),
	(2, 2, '1'),
	(3, 2, '2'),
	(2, 4, '2');

	INSERT INTO programador_lenguaje (programador_id, lenguajes_id, experiencia) VALUES 
	(1, 2, '2'), 
	(1, 8, '3'), 
	(2, 1, '2'), 
	(2, 10, '3'), 
	(3, 5, '1'), 
	(3, 6, '1');



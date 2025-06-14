const mysql = require("mysql2/promise");

const dbConfig = {
    host: "mysql",
    port: 3306,
    user: "wpr",
    password: "fit2024",
};

async function setupDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        await connection.query("DROP DATABASE IF EXISTS wpr2201040036");
        await connection.query("CREATE DATABASE  wpr2201040036");
        await connection.query("USE wpr2201040036");

        await connection.query(`
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL, 
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
        `);

        // Create the emails table
        await connection.query(`
            CREATE TABLE emails (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL ,
                sender_visible BOOL NOT NULL DEFAULT true,
                receiver_visible BOOL NOT NULL DEFAULT true,
                subject VARCHAR(255) default 'no subject',
                body TEXT ,
                attachment_id INT,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES users(id),
                FOREIGN KEY (receiver_id) REFERENCES users(id)
            );
        `);

        // Insert users into the users table
        await connection.query(`
        INSERT INTO users (full_name, email, password)
        VALUES
            ('Nguyen Tuan Duong', 'a@a.com', '123'),
            ('Dang Dinh Quan','b@b.com', 'password1'),
            ('Trinh Bao Ngoc','c@c.com', 'password2')
        `);

        // Insert email messages into the emails table
        await connection.query(`
            INSERT INTO emails (sender_id, receiver_id, subject, body)
            VALUES
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Workshop Collaboration', 'Quan, would you like to collaborate on the upcoming workshop?'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Re: Workshop Collaboration', 'Absolutely, Duong! Let''s plan a meeting to discuss.'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Holiday Plans', 'Duong, any plans for the holidays? Thinking of a getaway.'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Re: Holiday Plans', 'That sounds amazing, Ngoc! Count me in. Let''s decide on a location.'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Gadget Recommendation', 'Ngoc, I found this amazing gadget online. You might like it!'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Re: Gadget Recommendation', 'Thanks, Quan! Send me the link, I''ll check it out.'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Brainstorm Session', 'Ngoc, let''s have a quick brainstorm session about the project tomorrow.'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Re: Brainstorm Session', 'Good idea, Duong. I''ll prepare some points to discuss.'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Birthday Reminder', 'Duong, don''t forget Ngoc''s birthday is coming up!'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Re: Birthday Reminder', 'Thanks, Quan! Let''s plan something special.'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Sports Event', 'Hey Quan, interested in a live sports event this weekend?'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Re: Sports Event', 'Sounds awesome, Ngoc! I''ll buy the tickets.'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Presentation Review', 'Ngoc, could you review my presentation slides?'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Re: Presentation Review', 'Sure thing, Duong! I''ll go over them this evening.'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Charity Run', 'Duong, are you joining the charity run next week?'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Re: Charity Run', 'Definitely, Quan! Let''s go together.'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Online Course', 'Quan, I found an online course that might interest you.'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Re: Online Course', 'Thanks, Ngoc! Could you share the link?'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Recipe Exchange', 'Hey Quan, I tried a new recipe! Want to exchange recipes sometime?'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Re: Recipe Exchange', 'Sounds fun, Duong! Let''s set a date for it.'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Office Party', 'Duong, there''s an office party on Friday. Are you going?'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Re: Office Party', 'Yes, Ngoc! Looking forward to it. See you there.'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Mentorship Program', 'Ngoc, are you interested in joining the mentorship program?'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Re: Mentorship Program', 'Definitely, Quan. Thanks for suggesting it!'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Monthly Book Club', 'Ngoc, are you free for this month''s book club meeting?'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Re: Monthly Book Club', 'Yes, Duong! I wouldn''t miss it.'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Pet Care Tips', 'Duong, I remember you mentioned a pet. Any care tips for a new owner?'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Re: Pet Care Tips', 'Of course, Quan! I''ll send you some resources.'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'b@b.com'), 'Road Trip Photos', 'Quan, I found some photos from our last road trip! Want me to share?'),
            ((SELECT id FROM users WHERE email = 'b@b.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Re: Road Trip Photos', 'Yes, please, Ngoc! Great memories.'),
            ((SELECT id FROM users WHERE email = 'a@a.com'), (SELECT id FROM users WHERE email = 'c@c.com'), 'Fitness Challenge', 'Ngoc, up for a fitness challenge this month?'),
            ((SELECT id FROM users WHERE email = 'c@c.com'), (SELECT id FROM users WHERE email = 'a@a.com'), 'Re: Fitness Challenge', 'Absolutely, Duong! Let''s set some goals.')

        `);

        console.log("Database setup completed successfully.");
        await connection.end();
    } catch (error) {
        console.error("Error setting up the database:", error);
    }
}

setupDatabase();

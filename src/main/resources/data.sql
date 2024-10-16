-- One admin user, named admin1 with passwor 4dm1n and authority admin
INSERT INTO authorities(id,authority) VALUES (1,'ADMIN');
INSERT INTO appusers(id,username,password,authority) VALUES (1,'admin1','$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',1);

-- player user, password pl4y3r
INSERT INTO authorities(id,authority) VALUES (5,'PLAYER');
INSERT INTO appusers(id,username,password,authority) VALUES (2,'player1','$2a$12$WTgx.LwooUx4vraIptWlp.RQo7OacKkJIgWo0l612e.ch/C8hj2lu',5);
INSERT INTO appusers(id,username,password,authority) VALUES (3,'player2','$2a$12$WTgx.LwooUx4vraIptWlp.RQo7OacKkJIgWo0l612e.ch/C8hj2lu',5);
INSERT INTO appusers(id,username,password,authority) VALUES (4,'player3','$2a$12$WTgx.LwooUx4vraIptWlp.RQo7OacKkJIgWo0l612e.ch/C8hj2lu',5);
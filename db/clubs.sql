SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION';
SET GLOBAL sql_mode = 'NO_ENGINE_SUBSTITUTION';

DROP SCHEMA IF EXISTS clubs;
CREATE SCHEMA clubs;
USE clubs;

CREATE TABLE club (
    club_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    about TEXT DEFAULT NULL,
    pictureUrl TEXT DEFAULT NULL,
    active BOOLEAN DEFAULT TRUE,
    hidden BOOLEAN DEFAULT FALSE,
    created_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(club_id)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE user (
    user_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password TEXT DEFAULT NULL, -- hash password
    pictureUrl TEXT DEFAULT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE club_member (
    user_id SMALLINT UNSIGNED NOT NULL,
    club_id SMALLINT UNSIGNED NOT NULL,
    joined_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_manager BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(user_id, club_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id),
    FOREIGN KEY(club_id) REFERENCES club(club_id)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE club_notification (
    user_id SMALLINT UNSIGNED NOT NULL,
    club_id SMALLINT UNSIGNED NOT NULL,
    email VARCHAR(50) NOT NULL,
    subscribed BOOLEAN NOT NULL DEFAULT TRUE,
    updates BOOLEAN NOT NULL DEFAULT TRUE,
    events BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY(user_id, club_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id),
    FOREIGN KEY(club_id) REFERENCES club(club_id)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE club_event (
    event_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id SMALLINT UNSIGNED NOT NULL, -- author
    club_id SMALLINT UNSIGNED NOT NULL,
    title TEXT NOT NULL,
    time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(100) DEFAULT NULL,
    content TEXT DEFAULT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    published_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(event_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id),
    FOREIGN KEY(club_id) REFERENCES club(club_id)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE club_update (
    update_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id SMALLINT UNSIGNED NOT NULL, -- author
    club_id SMALLINT UNSIGNED NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    published_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(update_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id),
    FOREIGN KEY(club_id) REFERENCES club(club_id)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE event_rsvp (
    user_id SMALLINT UNSIGNED NOT NULL, -- rsvp'er
    club_id SMALLINT UNSIGNED NOT NULL,
    event_id SMALLINT UNSIGNED NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, event_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id),
    FOREIGN KEY(club_id) REFERENCES club(club_id),
    FOREIGN KEY(event_id) REFERENCES club_event(event_id)
) DEFAULT CHARSET=utf8mb4;

-- load data
-- load admin, password: qwerty
INSERT INTO user (first_name, last_name, email, password, admin)
VALUES ('Admin', 'A', 'adobe-flash-lives-on@outlook.com', '$2b$10$TGQRHJZX0oiw6Hy5N7y4B.OZQCogr8rv9BLdsuTSmWHb6TtjrDCxe', TRUE);
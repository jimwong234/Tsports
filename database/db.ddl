
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Admins CASCADE;
DROP TABLE IF EXISTS UnreadNotifications CASCADE;
DROP TABLE IF EXISTS Friends CASCADE;
DROP TABLE IF EXISTS Sports CASCADE;
DROP TABLE IF EXISTS Interests CASCADE;
DROP TABLE IF EXISTS Event CASCADE;
DROP TABLE IF EXISTS EventUsers CASCADE;
DROP TABLE IF EXISTS EventGroupChat CASCADE;
DROP TABLE IF EXISTS OneToOneChat CASCADE;
DROP TABLE IF EXISTS Ratings CASCADE;

CREATE TABLE Users
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    birthday DATE,
    gender VARCHAR(6) ,
    height INTEGER,
    weight DECIMAL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(15),
    campus VARCHAR(15),
    password text,
    about text,
    createdAt TIMESTAMP DEFAULT now(),
    ProfileImage text,
    fbid text,
    hashedpassword VARCHAR(100)
) ;

CREATE TABLE Admins
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    account VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(30) NOT NULL
);

--Used to display to icon numbers when the user first logs in
CREATE TABLE UnreadNotifications
(
    userid INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    numfriendreqs INTEGER,
    nummessages INTEGER,
    numnotifications INTEGER,
    PRIMARY KEY(userid)
);

--Status
--0 means pending, 1 means friends
CREATE TABLE Friends
(
    friend_one INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    friend_two INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    status INTEGER,
    WhoInitiated INTEGER REFERENCES Users(id) ON DELETE CASCADE, --The person who initiated the friend req
    CONSTRAINT must_be_different CHECK(friend_one != friend_two),
    PRIMARY KEY(friend_one, friend_two)
);




--1: cycling
--2: waterpolo
--3: squash
--4: boxing
--5: taekwondo
--6: basketball
--7: tabletennis
--8: tennis
--9: volleyball
--10: football
--11: swimming
CREATE TABLE Sports
(
    sportid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE Interests
(
    userid INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    sportid INTEGER REFERENCES Sports(sportid) ON DELETE CASCADE,
    PRIMARY KEY(userid, sportid)
);


CREATE TABLE Event
(
    Eventid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location text,
    numppl INTEGER,
    attendance INTEGER, --Initially 1 (The Admin who created the event)
    DateTime TIMESTAMP,
    EndTime TIME,
    Description text,
    EventType text,
    EventTypeID INTEGER REFERENCES Sports(sportid) ON DELETE CASCADE, --The unique sport ID
    EventAdminID INTEGER REFERENCES Users(id) ON DELETE CASCADE
);


--The users attending each Event
CREATE TABLE EventUsers
(
    id INTEGER REFERENCES Event(Eventid) ON DELETE CASCADE,
    userid INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    EventRatingSubmitted text DEFAULT 'no',
    PRIMARY KEY(id, userid)
);


CREATE TABLE EventGroupChat
(
    eventid INTEGER REFERENCES Event(Eventid) ON DELETE CASCADE,
    sentById INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    chatmessage text,
    MessageTime TIMESTAMP DEFAULT now()
);

CREATE TABLE OneToOneChat
(
    sentById INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    ReceivedById INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    chatmessage text,
    MessageTime TIMESTAMP DEFAULT now()
);

CREATE TABLE Ratings
(
    userid INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    eventid INTEGER REFERENCES Event(Eventid) ON DELETE CASCADE,
    comment text,
    rating INTEGER,
    ratingDateTime TIMESTAMP DEFAULT now()
);







--DATA

INSERT INTO Sports (name) VALUES('cycling');
INSERT INTO Sports (name) VALUES('waterpolo');
INSERT INTO Sports (name) VALUES('squash');
INSERT INTO Sports (name) VALUES('boxing');
INSERT INTO Sports (name) VALUES('taekwondo');
INSERT INTO Sports (name) VALUES('basketball');
INSERT INTO Sports (name) VALUES('tabletennis');
INSERT INTO Sports (name) VALUES('tennis');
INSERT INTO Sports (name) VALUES('volleyball');
INSERT INTO Sports (name) VALUES('football');
INSERT INTO Sports (name) VALUES('swimming');









## Blog App - Node/Express Backend

The backend of my blogging application. Has two key functions:

- To allow users to create, read, update and destroy blogposts.
- To act as an API providing blog data to my blog front-end.

Created using Node, Express, JavaScript, Bootstrap, CSS, Pug for templating, and [Quilljs](https://quilljs.com/) for rich text editing.

## Project Status

MVP. Next steps are to add authentication for admin users, improve security, add functionality to select header posts, and 4 leading posts.

## Project Screen Shots

<img src="https://user-images.githubusercontent.com/64267174/106020061-418f6700-60bb-11eb-9d43-a048c59d3e09.png" width="500">

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.

Installation:

`npm install`

Access to Database

In development the app database used is the local MongoDB database, not requiring credentials. In production, the app logs into a MongoAtlas database which requires username and password.
Create .env file in root directory (same level as app.js).
Edit the following:

```
NODE_ENV=<production/development>
CLOUDDB_USERNAME=<your_atlas_username>
CLOUDDB_PASSWORD=<your_atlas_password>
```

To Start Server:

`npm start`

To Visit App:

`localhost:4000/blog-backend/admin`

To Get API Output:

`localhost:4000/blog-backend/api/blogposts`

To Deploy

scp -i ~/dev/security/key-pair/jwpf-mainserver.pem -r ~/dev/node-blog/\* jwpf100@ec2-3-19-87-9.us-east-2.compute.amazonaws.com:/var/www/api.josephfletcher.co.uk/html/blog-backend

## Reflection

This project started as a way to add additional functionality to my main side-project [Essential Coaching](https://essentialcoaching.co.uk) and to put into practice what I'd been learning about CRUD, restful APIs, Express and databases.

The main aim was to add the functionality to allow the main user to add articles to their blog without needing to understand HTML. To that end, the backend would need to allow the user to create blogposts, add formatting and add tags, while then being able to edit and delete articles. This would then need to display automatically through a front end [found here](https://github.com/jwpf100/node-blog-frontend).

The backend works as expected although there are areas that I would think about changing going forward. Work that I've been doing on an open source project has shown me that there needs to be more seperation from the interaction with the database, and the admin frontend. The method I've employed has everything interlinked, where it may be better to employ a DAO method to seperate the storage from the app logic.

I found it initially challenging to add in a text editor. The editor itself was straightforward to implement, but dealing with the potential security implications of allowing users to input text still needs to be addressed so that the site isn't at risk from injection or XSS attacks.

<p  align="center">

<a align="center" href="https://daniphantom.herokuapp.com"  target="blank"><img  src="https://i.pinimg.com/originals/13/a7/f2/13a7f2e36e658749fd97b9078ad1e22f.png"  width="320" align="center" alt="Phantom Logo"  /></a>

<h1 align="center">Phantom</h1>
</p>

### Table of Contents

1. [Description](#Description)
2. [Screenshots](#Screenshots)
3. [Links](#Links)
4. [Tools](#Tools)
5. [Getting Started](#Getting-Started)
   - [Server](#Server)
     - [Run](#Run)
     - [Env Variables](#Env-Variables)
     - [Database Seeds](#Database-Seeds)
     - [Api Documentation](#Api-Documentation)
     - [JsDoc](#JsDoc)
   - [Frontend](#Frontend)
     - [Run](#Frontend-Run)
     - [Env Variables](#Frontend-Env-Variables)
6. [Contributing](#Contributing)
7. [Contributors](#Stay-in-touch)
8. [License](#Lisence)

## Description

[Phantom](https://daniphantom.herokuapp.com) A mimic website of Pinterest where one can share ideas , socialize , find inspirational ideas .

## Screenshots

- **Create New Phantom Account And Try It Yourself**

      	![Sign Up](https://i.ibb.co/svYdvMw/Screenshot-628.png)



* **Tell Us What Interests You**
  ![Interests](https://i.ibb.co/Xss9YZY/Screenshot-607.png)

- **Explore Your Home Feed With Pins Recommended For You**

      	![HomeFeed](https://i.ibb.co/4Y7qBz5/Screenshot-605.png)



* **Create Your Boards And Manage How They Look**

      	![Profile Boards](https://i.ibb.co/qny2zLH/Screenshot-609.png)



- **Have More Control and Divide Your Board Into Sections**
  ![Sections](https://i.ibb.co/vY76xxp/Screenshot-610.png)

* **Invite Collaborators Into Your Boards And Share Your Intersts**

      	![Collaborators](https://i.ibb.co/vzv3jT2/Screenshot-611.png)


- **Create Your Own Pins And Add Them To Your Boards**

      	![Create Pin](https://i.ibb.co/z6QvbJj/Screenshot-612.png)



* **Don't Miss A Thing And Keep Up With Your Notifications**

      	![Notifications](https://i.ibb.co/qrvjxpQ/120200486-420557965577056-2215085349692718248-n.png)



- **Chat With Others And Make New Friends Who Share You Some Interests**

      	![Chat](https://i.ibb.co/Vm9K4KB/Screenshot-625.png)



* **Follow People Recommended For You**

      	![Follow](https://i.ibb.co/nQxG71P/Screenshot-615.png)



- **Tune Your Home Feed With What You Like**

      	![Topics](https://i.ibb.co/fdqW66N/Screenshot-616.png)



* **Manage Your Profile Info And Account Settings**

      	![Setting](https://i.ibb.co/9Znk8T9/Screenshot-619.png)



* **Close Your Account Whenever You Want**

      	![Close Account](https://i.ibb.co/0FR6gfM/120491498-2547124752244967-6231769206552288935-n.png)

* **Search By Filters About What You Want**

      	![Search](https://i.ibb.co/mzfcGyh/Screenshot-620.png)



- **Socialize More And Share Your Thoughts About Others' Pins**

      	![Comments](https://i.ibb.co/10ZWQh2/Screenshot-621.png)

      	![Reacts](https://i.ibb.co/YZkSdTr/Screenshot-622.png)

- **Find More Ideas Related To A Pin You Opened**

![More Pins](https://i.ibb.co/W0k3rSz/120541924-801293377290818-1399688178565917352-n.png)

## Links

- #### [Website Url](https://daniphantom.herokuapp.com)
- #### Api Base Url : https://daniphantomserver.herokuapp.com

## Tools

1. Frontend
   - Vue
   - Vue lazyload
   - Bootstrap
   - Firebase
   - Socket io
1. Backend
   - Nestjs
   - Mongodb
   - Firebase
   - WebSockets
   - Google Api

## Getting Started

- ## Server

  - #### Run

        ```bash
        	$ cd server/phantom

        	# install
        	$ npm install

        	# development
        	$ npm run start

        	# watch mode
        	$ npm run start:dev

        	# production mode
        	$ npm run start:prod

        ```

    - #### Env Variables
      - refer to [.env.example](server/phantom/.env.example)
    - #### Database Seeds

      ```bash
      	$ cd server/phantom

      	$ npm install mongonaut

      	#seeds will be added to a new mongo local db
      	$ npm run seeds

      ```

    - #### Api Documentation
      - refer to[ Api Doc ](https://documenter.getpostman.com/view/10647228/TVRdAWo9)
    - #### JsDoc

      ```bash
      	$ cd server/phantom

      	$ npm install -g "@compodoc/compodoc"

      	$ npm run compodoc
      	# then open documentation/index.html

      ```

- ## Frontend

  - #### Frontend Run

        ```bash
        	$ cd client

        	# install
        	$ npm install

        	# development
        	$ npm run serve

        	# production mode
        	$ npm run build

        ```

    - #### Frontend Env Variables
      - refer to [.env.example](client/.env.example)

## Contributing

```bash
1. Fork this repo
2. Create new branch
	$ git checkout -b <FeatureBranch>
3. Add your feature then
	$ git commit -m "add my feature"
	$ git push origin <FeatureBranch>
4. Create PR
```

## Stay in touch

- Frontend - Nihal Mansour - nihalmansour0599@gmail.com - Eman Othman - eothman21@gmail.com - Menna Mahmoud - menna123mahmoud@gmail.com
- Backend - Dina Alaa - dinaalaaahmed@gmail.com - Aya Samir - ayasabohadima@gmail.com - Nada AbdElmaboud - nada5aled52@gmail.com

## License

Phantom is [MIT licensed](LICENSE).

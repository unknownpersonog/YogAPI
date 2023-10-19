
# UnknownVPS API

Application Programming Interface (API) for UnknownVPS and can be used for various other purposes as well. 

Brought by UnknownVPS Team



## Official API Hook
#### The API is officially hooked into a discord bot
Bot Link: [Discord Bot by LongZ3r](https://github.com/longz3r/unknownvps-discord-bot)


## Acknowledgements

 - [LongZ3r](https://github.com/LongZ3r) - Discord Bot Contribution



## Deployment

To deploy this project on your trusted infrastructure.
This guide considers you have Node 16 or 18 installed and you are doing all things in one go.

##### Step 1 - Make a new directory (Name is changable)
```bash
  mkdir -p UnknownVPS
```
##### Step 2 - Install curl (or any package) to get files.
```bash
  sudo apt-get install curl -y
```
##### Step 3 - Change Directory
```bash
  cd UnknownVPS
```
##### Step 4 - Get the package.json
```bash
  curl -Lo package.json "https://github.com/unknownpersonog/unknownvps-v2/raw/master/package.json"
```
##### Step 5 - Get updater.js
```bash
  curl -Lo updater.js "https://github.com/unknownpersonog/unknownvps-v2/raw/master/updater.js"
```
##### Step 6 - Install Dependencies
```bash
  npm i
```
##### Step 7 - Run updater.js
```bash
  node updater.js
```
##### Step 8 - Change directory to unknownvps-api/dist
```bash
  cd unknownvps-api/dist
```
##### Step 9 - Create a .env file and fill the required details from example env in the repository
```bash
  nano .env
```
##### Step 10 - Run the API
```bash
  node index.js
```
## API Reference

#### Ping API

```http
  GET /api/ping
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `None` | `string` | Get API Response Time |

#### Create User

```http
  POST /api/users/create
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Email of user to create. |
| `discordId`      | `string` | **Required**. Discord Id of user to create. |

#### Verify User
```http
  POST /api/users/verify/mail
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Email of user to create. |
| `discordId`      | `string` | **Required**. Discord Id of user to verify. |

```http
  POST /api/users/verify/token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. Token received on email |
| `discordId`      | `string` | **Required**. Discord Id of user to verify. |

#### User Info

```http
  GET /api/users/info/${discordId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `discordId`      | `string` | **Required**. Discord Id of user to get data from. |

#### Add VPS

```http
  POST /api/vps/add
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `vps_name`      | `string` | **Required**. Name of VPS. |
| `vps_os`      | `string` | **Required**. OS of VPS. |
| `vps_pass`      | `string` | **Required**. Password of VPS for the defined user. |
| `vps_user`      | `string` | **Required**. User for VPS. |
| `vps_ip`      | `string` | **Required**. IP to access VPS. |

#### Assign VPS

```http
  POST /api/vps/assign
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `discordId`      | `string` | **Required**. Discord ID to assign VPS to. |

### These API routes can change without being updated on every updated, check code for better infomation
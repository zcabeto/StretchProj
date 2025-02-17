### STRETCH PROJECT
This website acts as a platform to understand different techniques used to attack websites and how we can guard against them. One can try to break the website and alter method of attack based on the defenses put in place (as chosen by buttons at the top of the page). The user can read on the side bar about potential attacks for them to try out, demonstrating further why these protections are necessary. 

Defenses Include
- Encryption (plaintext -> hash password -> https)
- Input Safety (none -> sanitise text -> encode characters)
- URL Safety (pass all data -> limited url -> restrict CORS)

Attacks Include
- A01: CORS illegal access
- A02: Network Sniffing
- A03: SQL Injection
- A03: Cross-Site Scripting

### SETUP AND RUN INSTRUCTIONS
If one wishes to run this locally to their own device, from the root folder (where this README.md lies) run with the following commands. View from http://localhost:3000.
- chmod +x run.sh
- ./run.sh

### Screenshots
#### Login Page
![Login Page](https://github.com/zcabeto/StretchProj/blob/main/pictures/login-page.png)
#### Data Page
![Data Page](https://github.com/zcabeto/StretchProj/blob/main/pictures/data-page.png)
#### Communication Page
![Communication Page](https://github.com/zcabeto/StretchProj/blob/main/pictures/com-page.png)
#### SQL Injection
![SQL Injection](https://github.com/zcabeto/StretchProj/blob/main/pictures/SQLI.png)
#### Data Encoding
![Data Encoding](https://github.com/zcabeto/StretchProj/blob/main/pictures/encoding.png)

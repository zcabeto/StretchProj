### STRETCH PROJECT
This website acts as a platform to understand different techniques used to attack websites and how we can guard against them. Using several buttons at the top of the page, one can turn on and off protections against an array of attacks. When off, one can see how the attack can damage the system, when on they see how we might prevent it. Attack's include:
- SQL Injection (login & film data, freq analysis on login)
- Login Data Hashing (&salt?) (freq analysis still doable, can't see u-p link)
- Page Source Viewing?
- XSS (backend inject external script)
- CSRF (frontend inject change cookies use secret tokens)
- CORS?

### TODO Planning
- w/c 05/08: Hashing data protection. Explanations & Instructions of use with different combinations of protection.
- 12-19/08: presentation for the project, updated with further progress.
- 12-29/08: XSS, CSRF, CORS, etc.
- PRESENTATION QA 30/08
- PRESENTATION CL 04/09

### SETUP AND RUN INSTRUCTIONS
If one wishes to run this locally to their own device, from the root folder (where this README.md lies) run with the following commands. View from http://localhost:3000.
- chmod +x run.sh
- ./run.sh

05/08 - button frontend, on reload send to backend. SQL button activate sanitise
06/08 - hashing function
07/08 - fill DB with sample users & passwords
08/08 - two DBs made on launch one hashed one not. Use different DB depending on button.
09/08 - improve SQL Sanitisation
10/08 - explanations for two switches

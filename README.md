### STRETCH PROJECT
This website acts as a platform to understand different techniques used to attack websites and how we can guard against them. Using several buttons at the top of the page, one can turn on and off protections against an array of attacks. When off, one can see how the attack can damage the system, when on they see how we might prevent it. Attack's include:
- SQL Injection (login & film data, freq analysis on login)
- Login Data Hashing (&salt?) (freq analysis still doable, can't see u-p link)
- XSS (backend inject external script)
- CSRF (frontend inject change cookies use secret tokens)
- CORS?

### TODO Planning
- w/c 29/07: add the on/off buttons to add protections at a time. Start with SQL Injection only. Random passwords in DB.
- w/c 05/08: Hashing data protection. Explanations & Instructions of use with different combinations of protection.
- 12-19/08: presentation for the project, updated with further progress.
- 12-29/08: XSS, CSRF, CORS, etc.
- PRESENTATION QA 30/08
- PRESENTATION CL 04/09

### SETUP AND RUN INSTRUCTIONS
If one wishes to run this locally to their own device, from the root folder (where this README.md lies) run with the following commands. View from http://localhost:3000.
- chmod +x run.sh
- ./run.sh

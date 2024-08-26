### STRETCH PROJECT
This website acts as a platform to understand different techniques used to attack websites and how we can guard against them. One can try to break the website and alter method of attack based on the defenses put in place (as chosen by buttons at the top of the page). The user can read on the side bar about potential attacks for them to try out, demonstrating further why these protections are necessary. 

Defenses Include
- Encryption (plain -> hash -> https)
- Input Safety (none -> sanitise -> encode)
- URL Safety (any url text -> limited url text -> restricted CORS)

Attacks Include
- A01: CORS illegal access (comment as user)
- A02: Network Sniffing (see, crack, pass-the-hash)
- A03: SQL Injection
- A03: Cross-Site Scripting (XSS)

### SETUP AND RUN INSTRUCTIONS
If one wishes to run this locally to their own device, from the root folder (where this README.md lies) run with the following commands. View from http://localhost:3000.
- chmod +x run.sh
- ./run.sh

### TODO Planning
- 26/08 - extra page listing hrefs log with times + crackstation.net link.
- 27-29/08 - set up https. rewrite XSS guide on comments. make CORS vulnerability query - pass username to comment page to comment as user.
- 30/08 - (re)writeup Encryption Defence, Input Safety Defence, URL Safety Defence. writeup A01 & A02. writeup index. finish up any previous stuff.

- A02 - Set up a url listener. Writeup A02 monitor urls MitM (log window.location.hrefs) stopped w https (can send can't receive). 
- A01 - CORS access surrounding files w/o authentication, send urls found in A02 MitM. Writeup as A01. need reconnaissance, run commands somehow?

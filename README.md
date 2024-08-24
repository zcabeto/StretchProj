### STRETCH PROJECT
This website acts as a platform to understand different techniques used to attack websites and how we can guard against them. One can try to break the website and alter method of attack based on the defenses put in place (as chosen by buttons at the top of the page). The user can read on the side bar about potential attacks for them to try out, demonstrating further why these protections are necessary. 

Defenses Include
- Input Safety (none -> sanitise -> encode)
- URL Safety (any url text -> restricted CORS -> limited url text)
- Encryption (plain -> hash -> https)

Attacks Include
- A01: CORS illegal access
- A02: Network Sniffing
- A03: SQL Injection
- A03: Cross-Site Scripting

### TODO Planning
- 19-24/08: finish and clean up details of initial functionality.
- 25-26/08: Reformat some frontend.
- 27-30/08: OWASP A02 url listener.
- 01-03/09: OWAPS A01 CORS illegal access.
- PRESENTATIONS 04-06/09

### SETUP AND RUN INSTRUCTIONS
If one wishes to run this locally to their own device, from the root folder (where this README.md lies) run with the following commands. View from http://localhost:3000.
- chmod +x run.sh
- ./run.sh

### CLOSEUP TODO
- 23/08 - run XSS across sessions if possible.
- 25-26/08 - add copy to clipboard. rewrite defences (+hash crack website). redo button controls. index page.
- next week - Set up a url listener. Writeup A02 monitor urls MitM (log window.location.hrefs) stopped w https (can send can't receive).
- next week - CORS access surrounding files w/o authentication, send urls found in A02 MitM. Writeup as A01.

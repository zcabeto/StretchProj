### STRETCH PROJECT
This website acts as a platform to understand different techniques used to attack websites and how we can guard against them. One can try to break the website and alter method of attack based on the defenses put in place (as chosen by buttons at the top of the page). The user can read on the side bar about potential attacks for them to try out, demonstrating further why these protections are necessary. 

Defenses Include
- A02: Data Hashing
- A03: Input Sanitisation
- A03: Input Encoding
-   Input Safety (none -> sanitise -> encode)
-   Network Safety (url text -> cookie text -> https)
-   Encryption (plain -> weak hash -> strong hash)

Attacks Include
- A03: SQL Injection
- A03: XSS

### TODO Planning
- 19-24/08: finish and clean up details of initial functionality with 
- 25-26/08: OWASP A01 Access Control & CORS
- 27-30/08: another OWASP vulnerability - A02 spy on unencrypted data sent?
- PRESENTATIONS 04-06/09

### SETUP AND RUN INSTRUCTIONS
If one wishes to run this locally to their own device, from the root folder (where this README.md lies) run with the following commands. View from http://localhost:3000.
- chmod +x run.sh
- ./run.sh

### CLOSEUP TODO
- 23/08 - run XSS across sessions if possible. run link to website with cookies
- 24/08 - write up for XSS attack (short explanations).
- 25-6/08 - add copy to clipboard. rewrite defences (+hash crack website). redo button controls.
- next week - Set up a url listener. Writeup A02 monitor urls MitM.
- next week - CORS access surrounding files w/o authentication, send urls found in A02 MitM. Writeup as A01.

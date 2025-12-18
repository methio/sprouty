#Sprouty

Dev stack
node -> express -> handlebars (templating)
-> nodemon 

express documentation: https://expressjs.com/en/guide/routing.html
handlebars documentation: https://handlebarsjs.com/guide/

views = front end pages templates
views/partials = block of html to repeat in multiples pages

How to launch the server locally :
```
npm run devStart 
```


-----

# How to get a public url from localhost (computer with local server)

0. launch the server on your laptop with the command `nnpm run devStart` 
1. on laptop, open `https://pinggy.io/`
2. enter your local adress `localhost:3000`
3. the website should give you a command like: `ssh -p 443 -R0:localhost:3000 qr@free.pinggy.io`
4. paste the command in your terminal, you should receive url and QRCode looking like: `http://wodhd-46-193-65-1.a.free.pinggy.link`
5. open the public url to your local server on your mobile phone ✨

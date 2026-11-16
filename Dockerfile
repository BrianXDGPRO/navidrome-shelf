FROM nginx:alpine
COPY index.html manifest.json extension.js index.js heart.png backroomwall.jpg /usr/share/nginx/html/
EXPOSE 80

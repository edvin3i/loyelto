FROM nginx:1.27

COPY containers/nginx/config/loyel.to.conf /etc/nginx/sites-available/

RUN rm -rf /etc/nginx/http.d/default.conf && \
    ln -s /etc/nginx/sites-available/loyel.to.conf /etc/nginx/http.d/
    

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
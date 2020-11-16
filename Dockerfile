#-------------------------------------------------
# Build environment
#-------------------------------------------------
FROM node:8-alpine as react-build

# Set environment variables
ENV PORT 8080
ENV HOST 0.0.0.0

# Create src directory
RUN mkdir /src
WORKDIR /src

# Copy files to image
COPY ./src /src/
RUN yarn
RUN yarn build

#-------------------------------------------------
# Server environment
#-------------------------------------------------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

COPY --from=react-build /app/build /usr/share/nginx/html

EXPOSE 8080

CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
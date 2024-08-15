<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# RIE+
1. Debemos clonar el proyecto

2. Ejecutar comando ```npm install```

3. Debemos clonar el archivo ```.env.template``` y renombrarlo a ```.env```

4. Cambiar las variables de entorno

5. Ejecutar prisma

```
npx prisma init
npx prisma migrate dev --name init

```

6. Levantar el proyecto: ```npm run start:dev```

7. Descargar archivo ```endpoints-blog-bootcamp.json``` con los endpoints ya escritos para probar API RESTFULL

8. Montarlo en Postman/Insomia/etc.

9. Probar endpoints por postman y/o insomia

```
http://localhost:3000/api/users

http://localhost:3000/api/posts

http://localhost:3000/api/admin
```

create database final;
use final;
create table productos(
idProductos int unsigned not null auto_increment,
nombre varchar(60),
descripcion varchar(120),
precio int unsigned not null,
primary key (idProductos)
);
create table usuarios(
idEmail varchar(30),
passW varchar(150),
primary key(idEmail)
);
create table usuarioProducto(
idUsuarioProducto int unsigned not null auto_increment,
primary key (idUsuarioProducto),
idEmail varchar(150),
idProductos int unsigned not null,
foreign key (idEmail) references usuarios(idEmail),
foreign key (idProductos) references productos(idProductos)
);

drop table usuarios;
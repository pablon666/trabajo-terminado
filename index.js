
const express = require('express');
const app = express();
const mysql = require('mysql2');
const hbs = require('hbs');
const nodemailer = require('nodemailer');
const path = require('path');
const { ifError } = require('assert');
const PORT = 3001
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

require('dotenv').config()          

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname,'views/partials'))

app.listen(PORT, ()=>{
    console.log(`puerto trabajando en el puerto ${PORT}`);
});
const conexion = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})
conexion.connect((error)=>{
    if(error){
        console.log(`el error es ${error}`);
    }
    else{
        console.log('conectado a base de datos'); 
    }
})
app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/productos',(req,res)=>{
    res.render('productos')
})
app.get('/usuarios',(req,res)=>{
    res.render('usuarios')
})
app.get('/clinicaMedica',(req,res)=>{
    res.render('clinicaMedica')
})
app.get('/terapiaIntensiva',(req,res)=>{
    res.render('terapiaIntensiva')        
})          
app.get('/unidadCoronaria',(req,res)=>{
    res.render('unidadCoronaria')        
})
app.get('/registro',(req,res)=>{
    res.render('registro')       
})  
app.get('/mercado',(req,res)=>{
    let sql = "SELECT * FROM productos";
    conexion.query(sql, function(err,result){
        if (err) throw err;
        console.log(result);
        res.render('mercado',{
            datos : result})
        })        
})
//conexion.query("create database pruebasql");
//conexion.query("create table clientes (nombre VARCHAR(100),apellido VARCHAR(100))");
//let sql = "insert into clientes (nombre)values ('carlos')";
//let sql = "select * from clientes";
//conexion.query(sql, function(err,result){
//    console.log(result);})  
//let sql = "delete from clientes where nombre = 'carlos'"
//conexion.query(sql, function(err,result){
//       console.log(result);})   
//let sql = "update clientes set nombre = 'pete' where nombre = 'carlos'";
//conexion.query(sql, function(err,result){
//    console.log(result);})   
app.post('/registro', (req, res) =>{
    const email = req.body.email;
    const passw = req.body.passw;

    async function envioMail(){
        let trasporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            }
        });
        let info = await trasporter.sendMail({ 
            from: process.env.EMAIL,
            to: `${email}`,
            subject: "Gracias por suscribirte a nuestra app",
            html: `Bienvenido a la comunidad MEDICARG la primera app creada por personal de salud pensada para facilitar el trabajo dia a dia. <br>No dejes de apoyar a la comunidad para poder ir mejorando dia a dia te dejaremos el siguiente cbu donde podras colaborar con nosotros cbu:3458383747383344. <br>¡¡cara de nalga!! `
        })
    }

    let datos = {
        idEmail : email,
        passw : passw
    }

    let sql = "INSERT INTO usuarios set ?";
    conexion.query(sql,datos,function(err){
        if(err) throw err;
            console.log(`un registro insertado`);
            envioMail().catch(console.error);
            res.render('productos')
        })
})
app.post('/productos', (req,res) =>{
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;

    let datos = {
        nombre : nombre,
        precio : precio,
        descripcion : descripcion
    }
    let sql = "INSERT INTO productos set ?";
    conexion.query(sql,datos,function(err){
        if(err) throw err;
            console.log(`un registro insertado`);   
            res.render('productos')
        })
})

app.post('/delete',(req,res)=>{  

    let sql = "DELETE FROM productos WHERE idProductos = " + req.body.idProductos + "";
        conexion.query(sql, function(err,result){
            if(err)throw err;
            console.log('dato eliminado:'+result.affectedRows); 
            res.render('mercado')     
        }) 
})  

app.post('/update',(req,res)=>{
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;
    const idProductos = req.body.idProductos;

    let sql = "UPDATE productos SET nombre = '" + nombre + "',precio = '" + precio + "',descripcion = '"+ descripcion +"' WHERE idProductos = " + req.body.idProductos + ""; 

    console.log(sql);

    conexion.query(sql, function(err,result){
        if(err)throw err;
            console.log('dato actualizado'); 
            res.render('productos') 
    })
})
app.post('/auth', (req,res)=>{
    const idEmail = req.body.idEmail;
    const passw = req.body.passw;
    if(idEmail && passw){
        
                res.render ('productos')
            }else{
                res.render('registro')
            }
        })

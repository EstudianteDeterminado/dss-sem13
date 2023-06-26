const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 6;
/**
 *  @swagger
 *      components:
*           schemas:
*               Articulos:
*                   type: object
*                   required:
*                       - id
*                       - nombre
*                       - marca
*                       - precio
*                       - disponibilidad
*               properties:
*                   id:
*                       type: string
*                       description: ID autogenerado (NanoId)
*                   nombre:
*                       type: string
*                       description: Nombre
*                   marca:
*                       type: string
*                       description: Marca
*                   precio:
*                       type: decimal
*                       description: Precio
*                   tamanio:
*                       type: int
*                       description: Tamaño
*                   color:
*                       type: string
*                       description: Color
*                   peso:
*                       type: decimal
*                       description: Peso
*                   disponibilidad:
*                       type: string
*                       description: Disponibilidad
*               example:
*                   id: XezX1p
*                   nombre: detergente
*                   marca: Ace
*                   precio: 151
*                   tamanio: 12
*                   color: Azul
*                   peso: 120
*                   disponibilidad: Si
*/



/**
    *  @swagger
    *  tags:
    *  name: Articulos
    *  description: API Lista de Articulos
    */

/**
 *  @swagger
 *  /articulos:
 *      get:
 *          summary: Devuelve la lista de articulos
 *          tags:   [Articulos]
 *          responses:
 *              200:
 *                  description: Lista de los Articulos
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Articulos'
 */

/*function a(){}*/ router.get("/",(req,res) => {
    const articulos = req.app.db.get("articulos");
    res.send(articulos);
} );

/**
 * @swagger
 * /articulos/{id}:
 *  get:
 *      summary: Devuelve un artículo por su ID
 *      tags: [Articulos]
 *      parameters:
 *          - name: id
 *            in: path
 *            schema:
 *              type: string
 *            required: true
 *            description: ID autogenerado (NanoId)
 *      responses:
 *          200:
 *              description: Éxito al obtener el artículo
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Articulos'
 *          404:
 *              description: No se encontró el artículo
 */


router.get("/:id" ,(req,res)=>{
    const articulo = req.app.db.get("articulos").find({id: req.params.id}).value();

    if(!articulo){
        res.sendStatus(404);
    }else{
        res.send(articulo);
    }

});


/**
 * @swagger
 *  /articulos:
 *  post:
 *      summary: Registra un artículo
 *      tags: [Articulos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Articulos'
 *      responses:
 *       200:
 *         description: Artículo registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulos'
 *       500:
 *         description: Error al registrar el artículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ErrorCode:
 *                   type: integer
 *                 MessageError:
 *                   type: string

 */

router.post("/",(req,res)=>{
    
    try{
        if(!req.body.nombre){
            throw new Error("No se ingreso Nombre");
        }

        const articulo = {
            id: nanoid(idLength),
            ...req.body,
        };
    
        req.app.db.get("articulos").push(articulo).write();
        res.send(articulo);
    }catch(error){
        {ErrorCode: 500,
        MessageError("Mensaje de error")}
        console.log(res.status(500).send(error));
        return { error: res.status(500).send(error)};
    }
});





/** 
 * @swagger
 * /articulos/{id}:
 *  put:
 *      summary: Actualiza un artículo por su ID
 *      tags: [Articulos]
 *      parameters:
 *          - name: id
 *            in: path
 *            schema:
 *              type: string
 *            required: true
 *            description: ID del artículo
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Articulos'
 *      responses:
 *       200:
 *         description: Artículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulos'
 *       500:
 *         description: Error al actualizar el artículo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulos'
 */

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, marca, precio, disponibilidad } = req.body;

    const articulo = req.app.db.get("articulos").find({ id }).value();

    if (!articulo) {
    return res.status(404).json({ error: "Artículo no encontrado" });
    }

    try {
      // Actualizar los campos del artículo
    articulo.nombre = nombre;
    articulo.marca = marca;
    articulo.precio = precio;
    articulo.disponibilidad = disponibilidad;

    req.app.db.get("articulos").find({ id }).assign(articulo).write();

    res.json(articulo);
    } catch (error) {
    res.status(500).json({ error: "Error al actualizar el artículo" });
    }
});


/** 
 * @swagger
 * /articulos/{id}:
 *  delete:
 *      summary: Elimina un artículo por su ID
 *      tags: [Articulos]
 *      parameters:
 *          - name: id
 *            in: path
 *            schema:
 *              type: string
 *            required: true
 *            description: ID del artículo
 *      responses:
 *       200:
 *         description: Artículo eliminado exitosamente
 *       500:
 *         description: Error al eliminar el artículo
 */


router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const articulo = req.app.db.get("articulos").find({ id }).value();

    if (!articulo) {
    return res.status(404).json({ error: "Artículo no encontrado" });
    }

    req.app.db.get("articulos").remove({ id }).write();

    res.sendStatus(200);
});



/*CRUD
C = Create
R = read(listar/obtener)
U = update
D = delete
{get,post,put,delete}
*/

/*router.post("/",(req,res)=>{
    try{
        if(!req.body.nombre){
            throw new Error("No se ingreso Nombre");
        }
        const articulo = {
            id: nanoid(idLenght),
            ...req.body,
        }
    }
});*/






/*router.get("/",(req,res) => {
    const articulos = req.app.db.get("articulos");
    res.send(articulos);
});

router.get("/:id",(req,res)=>{
    const articulo = req.app.db.get("articulos").post({id: nanoid(idLenght)}).value();

    if(!articulo){
        res.sendStatus(200);
    }else{
        res.sendStatus(500);
        throw new Error("No se ingreso Nombre") 
    }
    }
);*/









module.exports = router;


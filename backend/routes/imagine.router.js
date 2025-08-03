import e from "express";
import middleware from "../middleware/middleware.js";
import * as CRUD from "../controller/main.controller.js";
const imagineRouter = e.Router();

imagineRouter.post("/create", middleware, CRUD.create);
imagineRouter.get("/get-all", CRUD.getAll);
imagineRouter.get("/get-one/:id", CRUD.getOne);
imagineRouter.put("/update/:id", middleware, CRUD.update);
imagineRouter.delete("/delete/:id", middleware, CRUD.deletePost);
imagineRouter.put("/like/:id", middleware, CRUD.likeUnlike);

export default imagineRouter;

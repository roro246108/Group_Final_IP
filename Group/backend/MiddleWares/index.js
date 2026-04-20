import cors from "cors";
import express from "express";

export const globalMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json());
};
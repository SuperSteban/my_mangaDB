import { Router, RequestHandler } from "express";

// Define the possible HTTP methods for routes
type RouteMethod = "get" | "post" | "put" | "delete" | "patch";

// Interface to describe the configuration of each route
export interface RouteConfig {
    method: RouteMethod;       // HTTP method (GET, POST, etc.)
    path: string;              // Path for the route
    handler: RequestHandler;   // Request handler for the route (controller method)
    middlewares?: RequestHandler[];  // Optional middlewares for this route
}

// Abstract base class for creating routes
export default abstract class BaseRouter {
    public router: Router;

    // Constructor that initializes the router
    constructor() {
        this.router = Router();  // Create a new Express Router instance
        this.registerRoutes();   // Register routes when the instance is created
    }

    // Abstract method that must be implemented by subclasses to define the routes
    protected abstract routes(): RouteConfig[];

    private registerRoutes(): void {
        this.routes().forEach(({ method, path, handler, middlewares = [] }) => {
            this.router[method](path, ...middlewares, handler);
        });
    }
} 
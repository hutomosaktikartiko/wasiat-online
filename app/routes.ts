import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Main pages
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("features", "routes/features.tsx"),
  
  // Dashboard routes
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboard/testator", "routes/dashboard/testator.tsx"),
  route("dashboard/beneficiary", "routes/dashboard/beneficiary.tsx"),
  
  // Will management routes
  route("will/create", "routes/will/create.tsx"),
  route("will/:id", "routes/will/$id.tsx"),
  route("will/manage", "routes/will/manage.tsx"),

] satisfies RouteConfig;

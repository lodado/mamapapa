import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Simmey",
    short_name: "Simmey",
    description: "Use a face-matching AI to see how much you resemble your mom and dad!",
    theme_color: "#2470FF",
    background_color: "#FFFFFF",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: "/?app=pwa",
  };
}

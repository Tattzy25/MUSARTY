import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables
  projectId: "b75f0bbf-f99a-48a0-bd8e-9f7f50fab6d5",
  publishableClientKey: "pck_03139b16dxwxc4t0bbz42z5mp4wy6bvna58tq8ca1przr",
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate,
  },
});

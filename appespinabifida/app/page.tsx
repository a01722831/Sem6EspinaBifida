import Login from "./componentes/login";

export default function Home() {
  const googleConfigured =
    Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

  return <Login googleConfigured={googleConfigured} />;
}
import Login from "./components/login";

const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

export default function HomePage() {
  return <Login googleConfigured={googleConfigured} />;
}

import Login from "./components/login";

export default function HomePage({searchParams}: any) {
  return <Login error={searchParams?.error}/>;
}

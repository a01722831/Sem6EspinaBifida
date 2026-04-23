import Login from "./components/login";

export default async function HomePage({searchParams}: any) {
  const params = await searchParams;
  return <Login error={params?.error}/>;
}

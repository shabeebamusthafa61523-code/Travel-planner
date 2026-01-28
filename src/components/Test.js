export default function Test() {
  console.log("Env Test:", process.env.REACT_APP_OPENWEATHER_API_KEY);
  return <div>Check console for env key</div>;
}
